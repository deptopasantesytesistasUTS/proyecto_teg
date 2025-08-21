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
import { useParams, useLocation } from 'react-router-dom';
import { backendUrl } from "config";
import { useAuth } from "context/AuthContext";

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
  const { id, idMateria } = useParams();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const seccionParam = search.get('idSeccion');
  const { user } = useAuth();

  const materiaId = id || idMateria;
  const idSeccion = seccionParam || materia?.Secciones?.[0]?.idSeccion || materiaId;

  const [docente, setDocente] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [docenteCedula, setDocenteCedula] = useState(null);

  const [adaptedStudents, setAdaptedStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [tutorias, setTutorias] = useState([]);
  const [loadingTutorias, setLoadingTutorias] = useState(true);
  const [fechasTutorias, setFechasTutorias] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [selectedDateForStats, setSelectedDateForStats] = useState('');

  // Obtener fechas de tutorías reales
  useEffect(() => {
    console.log("idSeccion usado para tutorías:", idSeccion);
    if (!idSeccion) return;
    setLoadingTutorias(true);
    fetch(`${backendUrl}/aulavirtual-docente/tutorias/${idSeccion}`)
      .then(res => res.json())
      .then(data => {
        console.log("Tutorías obtenidas:", data);
        setTutorias(data);
        setLoadingTutorias(false);
      })
      .catch(() => setTutorias([]));
  }, [idSeccion]);

  // Actualizar fechasTutorias cuando cambian las tutorias
  useEffect(() => {
    if (tutorias && tutorias.length > 0) {
      setFechasTutorias(tutorias.map(t => t.fecha?.split('T')[0]));
    } else {
      setFechasTutorias([]);
    }
  }, [tutorias]);

  // Obtener asistencias reales
  useEffect(() => {
    if (!idSeccion) return;
    fetch(`${backendUrl}/aulavirtual-docente/asistencias/${idSeccion}`)
      .then(res => res.json())
      .then(data => setAsistencias(data))
      .catch(() => setAsistencias([]));
  }, [idSeccion]);

  // Obtener la cédula del docente si es necesario
  useEffect(() => {
    const fetchDocenteCedula = async () => {
      if (user && user.userId && (user.role === 2 || user.role === "2")) {
        try {
          const url = `${backendUrl}/cedula-personal?userId=${user.userId}`;
          const res = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(10000)
          });
          if (res.ok) {
            const data = await res.json();
            setDocenteCedula(data.cedula);
          }
        } catch (err) {
            // Silenciar error
        }
      }
    };
    fetchDocenteCedula();
  }, [user]);

  // Cargar estudiantes y adaptar
  useEffect(() => {
    let finalIdSeccion = idSeccion;
    if (finalIdSeccion && finalIdSeccion === materiaId && materia?.Secciones && materia.Secciones.length > 0) {
      finalIdSeccion = materia.Secciones[0].idSeccion;
    }
    if (!finalIdSeccion && materia?.Secciones && materia.Secciones.length > 0) {
      finalIdSeccion = materia.Secciones[0].idSeccion;
    }
    if (!finalIdSeccion) {
      setError("No se pudo obtener el ID de la sección. Verifica que la materia tenga secciones configuradas o que la URL sea correcta.");
      setLoading(false);
      return;
    }
    const fetchParticipantes = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `${backendUrl}/secciones/${finalIdSeccion}/participantes`;
        const res = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(10000)
        });
        if (!res.ok) throw new Error(`Error del servidor: ${res.status} - ${res.statusText}`);
        const data = await res.json();
        setDocente(data.docente || null);
        setEstudiantes(Array.isArray(data.estudiantes) ? data.estudiantes : []);
        const adaptados = adaptStudents(data.estudiantes || []);
        setAdaptedStudents(adaptados);
      } catch (err) {
        if (students && students.length > 0) {
          const adaptados = adaptStudents(students);
          setAdaptedStudents(adaptados);
          setEstudiantes(students);
          setError(null);
        } else {
          setError(`No se pudieron cargar los participantes. Error: ${err.message}`);
          setDocente(null);
          setEstudiantes([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchParticipantes();
  }, [idSeccion, materia, students, seccionParam, materiaId, location.pathname, docenteCedula]);

  // Sincronizar attendance con asistencias reales y fechas
  useEffect(() => {
    if (adaptedStudents.length === 0 || fechasTutorias.length === 0) {
      setAttendance({});
      return;
    }
    const initAttendance = {};
    adaptedStudents.forEach(s => {
      initAttendance[s.id] = {};
      fechasTutorias.forEach(date => {
        // Buscar tutoria y asistencia
        const tutoria = tutorias.find(t => t.fecha?.split('T')[0] === date);
        const asistencia = asistencias.find(a => a.idEstudiante === s.id && a.idTutoria === tutoria?.idTutoria);
        initAttendance[s.id][date] = asistencia ? asistencia.asistencia : false;
      });
    });
    setAttendance(initAttendance);
  }, [adaptedStudents, fechasTutorias, asistencias, tutorias]);

  // Inicializar fecha seleccionada para estadísticas
  useEffect(() => {
    if (fechasTutorias.length > 0) {
      setSelectedDateForStats(fechasTutorias[0]);
    } else {
      setSelectedDateForStats('');
    }
  }, [fechasTutorias]);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Asistencias');
    worksheet.views = [{ showRowColHeaders: false, showGridLines: true }];
    worksheet.getColumn('A').width = 5;
    worksheet.getColumn('B').width = 5;
    worksheet.getColumn('C').width = 15;
    worksheet.getColumn('D').width = 30;
    fechasTutorias.forEach((_, index) => {
      const columnLetter = String.fromCharCode(69 + index);
      worksheet.getColumn(columnLetter).width = 12;
    });
    worksheet.getCell('D1').value = 'CONTROL DE ASISTENCIAS';
    worksheet.getCell('D1').font = { bold: true, size: 14 };
    worksheet.getCell('D1').alignment = { horizontal: 'center' };
    worksheet.getCell('C3').value = 'Materia:';
    worksheet.getCell('D3').value = materia?.categoria || 'N/A';
    worksheet.getCell('C4').value = 'Carrera:';
    worksheet.getCell('D4').value = materia?.Carreras?.nombre || 'N/A';
    worksheet.getCell('C5').value = 'Profesor:';
    worksheet.getCell('D5').value = docente ? `${docente.nombre1 || ''} ${docente.apellido1 || ''}`.trim() : 'N/A';
    worksheet.getCell('E8').value = 'tabla asistencias';
    worksheet.getCell('B10').value = 'n';
    worksheet.getCell('C10').value = 'Cédula';
    worksheet.getCell('D10').value = 'Nombre';
    fechasTutorias.forEach((date, index) => {
      const columnLetter = String.fromCharCode(69 + index);
      const formattedDate = new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      worksheet.getCell(`${columnLetter}10`).value = formattedDate;
    });
    adaptedStudents.forEach((student, studentIndex) => {
      const rowNumber = 11 + studentIndex;
      worksheet.getCell(`B${rowNumber}`).value = studentIndex + 1;
      worksheet.getCell(`C${rowNumber}`).value = student.id;
      worksheet.getCell(`D${rowNumber}`).value = student.name;
      const today = new Date();
      fechasTutorias.forEach((date, index) => {
        const columnLetter = String.fromCharCode(69 + index);
        const dateObj = new Date(date);
        if (dateObj <= today) {
          const attendanceStatus = attendance[student.id][date] ? 'Asistente' : 'Inasistente';
          worksheet.getCell(`${columnLetter}${rowNumber}`).value = attendanceStatus;
        } else {
          worksheet.getCell(`${columnLetter}${rowNumber}`).value = '';
        }
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `asistencias_${materia?.categoria || 'materia'}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getAttendanceStatsByDate = () => {
    const statsByDate = {};
    fechasTutorias.forEach(date => {
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
    ...fechasTutorias.map(date => ({
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
                onClick={async () => {
                  // Busca la tutoria correspondiente
                  const tutoria = tutorias.find(t => t.fecha?.split('T')[0] === params.field);
                  if (!tutoria) return;
                  const nuevoValor = !isPresent;
                  setAttendance(prev => ({
                    ...prev,
                    [params.row.id]: {
                      ...prev[params.row.id],
                      [params.field]: nuevoValor
                    }
                  }));
                  // Llama al backend para registrar la asistencia
                  await fetch(`${backendUrl}/aulavirtual-docente/asistencias`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      idTutoria: tutoria.idTutoria,
                      idEstudiante: params.row.id,
                      asistencia: nuevoValor
                    })
                  });
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
    ...fechasTutorias.reduce((acc, date) => {
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
              {fechasTutorias.map(date => (
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
