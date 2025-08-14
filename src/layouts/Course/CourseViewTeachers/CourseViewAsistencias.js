import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { IconButton, Tooltip, Chip, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Download, CheckCircle, Cancel, CalendarToday } from '@mui/icons-material';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import PropTypes from "prop-types";
import { useParams } from 'react-router-dom';
// No necesitamos importar backendUrl, usaremos la variable de entorno directamente

const fakeDates = [
  "2024-06-01",
  "2024-06-08",
  "2024-06-15",
  "2024-06-22",
  "2024-06-29"
];

// Función helper para adaptar estudiantes (similar a ParticipantesList)
function adaptStudents(students) {
  if (!Array.isArray(students)) return [];
  if (students.length > 0 && students[0].name && students[0].id) return students;
  return students.map(est => ({
    name: [
      est.nombre1,
      est.nombre2,
      est.apellido1,
      est.apellido2
    ].filter(Boolean).join(" "),
    id: est.cedula,
    email: est.correo || est.email || est.Users?.correo || "",
    telf: est.telf || "",
    perfil: est 
  }));
}

function CourseViewAsistencias ({ students, materia }) {
  // Obtener el idSeccion de la materia o de los parámetros de URL
  const { id } = useParams();
  const idSeccion = materia?.Secciones?.[0]?.idSeccion || id;
  
  const [docente, setDocente] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estas faltaban
  const [adaptedStudents, setAdaptedStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

 useEffect(() => {
  console.log("📢 idSeccion recibido:", idSeccion);
  console.log("📢 materia recibida:", materia);
  console.log("📢 students recibidos:", students);

  if (!idSeccion) {
    console.warn("⚠ No se recibió idSeccion");
    setError("No se pudo obtener el ID de la sección. Verifica que la materia tenga secciones configuradas.");
    setLoading(false);
    return;
  }

  const fetchParticipantes = async () => {
    try {
      setLoading(true);
      // Usar la URL correcta del backend (misma lógica que index.js)
      const url = `${process.env.REACT_APP_API_URL || "https://proyecto-teg-bakend.onrender.com/api"}/secciones/${idSeccion}/participantes`;
      console.log("🌐 Solicitando:", url);

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const data = await res.json();
      console.log("📦 Respuesta del backend:", data);

      setDocente(data.docente || null);
      setEstudiantes(Array.isArray(data.estudiantes) ? data.estudiantes : []);

      // Usar la función helper para adaptar estudiantes
      const adaptados = adaptStudents(data.estudiantes || []).map(s => ({
        ...s,
        idCarrera: s.perfil?.carrera || "",
        idUsuario: s.perfil?.usuario || "",
        promedio: s.perfil?.promedio || 0
      }));
      setAdaptedStudents(adaptados);

      const initAttendance = {};
      adaptados.forEach(s => {
        initAttendance[s.id] = {};
        fakeDates.forEach(date => initAttendance[s.id][date] = false);
      });
      setAttendance(initAttendance);

      setError(null);
    } catch (err) {
      console.error("🚨 Error cargando participantes:", err.message);
      
      // Si el fetch falla, intentar usar los estudiantes que vienen como props
      if (students && students.length > 0) {
        console.log("🔄 Usando estudiantes de props como fallback");
        const adaptados = adaptStudents(students).map(s => ({
          ...s,
          idCarrera: s.perfil?.carrera || "",
          idUsuario: s.perfil?.usuario || "",
          promedio: s.perfil?.promedio || 0
        }));
        setAdaptedStudents(adaptados);
        setEstudiantes(students);
        
        const initAttendance = {};
        adaptados.forEach(s => {
          initAttendance[s.id] = {};
          fakeDates.forEach(date => initAttendance[s.id][date] = false);
        });
        setAttendance(initAttendance);
        setError(null);
      } else {
        setError("No se pudieron cargar los participantes.");
        setDocente(null);
        setEstudiantes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchParticipantes();
}, [idSeccion]);

  const [selectedDateForStats, setSelectedDateForStats] = useState(fakeDates[0]);

  const exportToExcel = async () => {
    console.log("🚀 Iniciando exportación a Excel con ExcelJS...");
    
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Asistencias');
    
    // Configurar la vista para ocultar headers de columnas y filas
    worksheet.views = [
      {
        showRowColHeaders: false,
        showGridLines: true,
        showRuler: false,
        showOutlineSymbols: false
      }
    ];
    
    // Configuración adicional para forzar la ocultación de headers
    worksheet.properties.showRowColHeaders = false;
    
    // Configurar el ancho de las columnas
    worksheet.getColumn('A').width = 5;   // Columna vacía
    worksheet.getColumn('B').width = 5;   // Numeración
    worksheet.getColumn('C').width = 15;  // Cédula
    worksheet.getColumn('D').width = 30;  // Nombre
    
    // Configurar ancho para las columnas de fechas
    fakeDates.forEach((_, index) => {
      const columnLetter = String.fromCharCode(69 + index); // E, F, G, etc.
      worksheet.getColumn(columnLetter).width = 12;
    });
    
    // Agregar título principal
    worksheet.getCell('D1').value = 'CONTROL DE ASISTENCIAS';
    worksheet.getCell('D1').font = { bold: true, size: 14 };
    worksheet.getCell('D1').alignment = { horizontal: 'center' };
    
    // Agregar información de la materia
    worksheet.getCell('C3').value = 'Materia:';
    worksheet.getCell('D3').value = materia?.categoria || 'N/A';
    
    worksheet.getCell('C4').value = 'Carrera:';
    worksheet.getCell('D4').value = materia?.Carreras?.nombre || 'N/A';
    
    worksheet.getCell('C5').value = 'Profesor:';
    worksheet.getCell('D5').value = docente ? `${docente.nombre1 || ''} ${docente.apellido1 || ''}`.trim() : 'N/A';
    
    // Agregar "tabla asistencias"
    worksheet.getCell('E8').value = 'tabla asistencias';
    
    // Agregar encabezados de la tabla
    worksheet.getCell('B10').value = 'n';
    worksheet.getCell('C10').value = 'Cédula';
    worksheet.getCell('D10').value = 'Nombre';
    
    // Agregar encabezados de fechas
    fakeDates.forEach((date, index) => {
      const columnLetter = String.fromCharCode(69 + index); // E, F, G, etc.
      const formattedDate = new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      worksheet.getCell(`${columnLetter}10`).value = formattedDate;
    });
    
    // Agregar datos de estudiantes
    adaptedStudents.forEach((student, studentIndex) => {
      const rowNumber = 11 + studentIndex;
      
      worksheet.getCell(`B${rowNumber}`).value = studentIndex + 1;
      worksheet.getCell(`C${rowNumber}`).value = student.id;
      worksheet.getCell(`D${rowNumber}`).value = student.name;
      
      const today = new Date();
      fakeDates.forEach((date, index) => {
        const columnLetter = String.fromCharCode(69 + index); // E, F, G, etc.
        const dateObj = new Date(date);
        
        if (dateObj <= today) {
          const attendanceStatus = attendance[student.id][date] ? 'Asistente' : 'Inasistente';
          worksheet.getCell(`${columnLetter}${rowNumber}`).value = attendanceStatus;
        } else {
          worksheet.getCell(`${columnLetter}${rowNumber}`).value = '';
        }
      });
    });
    
    // Configuración adicional del libro de trabajo
    workbook.views = [
      {
        showRowColHeaders: false,
        showGridLines: true,
        showHorizontalScroll: true,
        showVerticalScroll: true
      }
    ];
    
    // Configuración específica para ocultar headers usando propiedades de Excel
    worksheet.properties.showRowColHeaders = false;
    worksheet.properties.showGridLines = true;
    
    // Intentar configurar propiedades específicas de Excel
    if (!worksheet.properties) worksheet.properties = {};
    worksheet.properties.showRowColHeaders = false;
    
    // Generar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `asistencias_${materia?.categoria || 'materia'}_${new Date().toISOString().split('T')[0]}.xlsx`);
    console.log("✅ Excel exportado exitosamente con ExcelJS");
  };

  const getAttendanceStatsByDate = () => {
    const statsByDate = {};
    fakeDates.forEach(date => {
      let presentCount = 0;
      let absentCount = 0;
      adaptedStudents.forEach(student => {
        if (attendance[student.id]?.[date]) {
          presentCount++;
        } else {
          absentCount++;
        }
      });
      statsByDate[date] = {
        present: presentCount,
        absent: absentCount,
        total: presentCount + absentCount,
        percentage: presentCount > 0 ? ((presentCount / (presentCount + absentCount)) * 100).toFixed(1) : '0.0'
      };
    });
    return statsByDate;
  };

  const statsByDate = getAttendanceStatsByDate();

  const columns = [
    { field: 'id', headerName: 'Cédula', width: 100 },
    { field: 'name', headerName: 'Nombre', width: 200 },
    ...fakeDates.map(date => ({
      field: date,
      headerName: new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      width: 140,
      renderCell: (params) => {
        const studentAttendance = attendance[params.row.id] || {};
        const isPresent = studentAttendance[params.field] || false;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Tooltip title={isPresent ? 'Presente' : 'Ausente'}>
              <IconButton
                size="small"
                onClick={() => {
                  setAttendance(prev => ({
                    ...prev,
                    [params.row.id]: {
                      ...prev[params.row.id],
                      [params.field]: !isPresent
                    }
                  }));
                }}
                sx={{
                  backgroundColor: isPresent ? '#4caf50' : '#f44336',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: isPresent ? '#45a049' : '#d32f2f',
                  },
                  width: 32,
                  height: 32,
                  transition: 'all 0.3s ease'
                }}
              >
                {isPresent ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
    }))
  ];

  const rows = adaptedStudents.map(s => ({
    id: s.id,
    name: s.name,
    ...fakeDates.reduce((acc, date) => {
      acc[date] = attendance[s.id]?.[date] || false;
      return acc;
    }, {})
  }));

  if (loading) {
    return (
      <MDBox sx={{ p: 3 }}>
        <MDTypography variant="h6" color="info">
          Cargando estudiantes...
        </MDTypography>
      </MDBox>
    );
  }

  if (error) {
    return (
      <MDBox sx={{ p: 3 }}>
        <MDTypography variant="h6" color="error">
          Error: {error}
        </MDTypography>
        <MDTypography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No se pudieron cargar los estudiantes de la sección. Verifica la conexión con el backend.
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <MDBox sx={{ p: 3 }}>
      {/* Header */}
      <MDBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <MDTypography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          📊 Registro de Asistencias
        </MDTypography>
        <MDButton variant="contained" color="success" startIcon={<Download />} onClick={exportToExcel}>
          Exportar a Excel
        </MDButton>
      </MDBox>

      {/* Selector de fecha y estadísticas */}
      <MDBox sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <MDBox sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <MDTypography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            📈 Estadísticas de Asistencia
          </MDTypography>
          <FormControl size="small" sx={{ minWidth: 250}}>
            <InputLabel id="date-select-label">Seleccionar Fecha</InputLabel>
            <Select
              labelId="date-select-label"
              value={selectedDateForStats}
              onChange={(e) => setSelectedDateForStats(e.target.value)}
              startAdornment={<CalendarToday sx={{ mr: 1, color: '#1976d2', height: 50 }} />}
            >
              {fakeDates.map(date => (
                <MenuItem key={date} value={date}>
                  {new Date(date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MDBox>

        <MDBox sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip icon={<CheckCircle />} label={`Presentes: ${statsByDate[selectedDateForStats]?.present || 0}`} color="success" variant="outlined" />
          <Chip icon={<Cancel />} label={`Ausentes: ${statsByDate[selectedDateForStats]?.absent || 0}`} color="error" variant="outlined" />
          <Chip label={`Total: ${statsByDate[selectedDateForStats]?.total || 0}`} color="primary" variant="outlined" />
          <Chip label={`Asistencia: ${statsByDate[selectedDateForStats]?.percentage || '0.0'}%`} color="info" variant="outlined" />
        </MDBox>
      </MDBox>

      {/* Tabla */}
      {adaptedStudents.length === 0 ? (
        <Paper elevation={3} sx={{ height: 500, width: '100%', borderRadius: 3, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MDTypography variant="h6" color="text.secondary">
            No hay estudiantes registrados en esta sección.
          </MDTypography>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ height: 500, width: '100%', borderRadius: 3, overflow: 'hidden' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          />
        </Paper>
      )}
    </MDBox>
  );
}

CourseViewAsistencias.propTypes = {
  students: PropTypes.array,
  materia: PropTypes.object,
};

export default CourseViewAsistencias;
