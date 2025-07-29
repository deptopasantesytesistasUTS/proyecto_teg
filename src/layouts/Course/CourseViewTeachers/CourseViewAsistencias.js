import * as React from "react";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { IconButton, Tooltip, Chip, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Download, CheckCircle, Cancel, CalendarToday } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import PropTypes from "prop-types";

// Fechas de ejemplo (puedes reemplazar por las del backend)
const fakeDates = [
  "2024-06-01",
  "2024-06-08",
  "2024-06-15",
  "2024-06-22",
  "2024-06-29"
];

function CourseViewAsistencias({ students, materia }) {
  // Estado: { [studentId]: { [fecha]: bool } }
  const [attendance, setAttendance] = React.useState(() => {
    const initial = {};
    students.forEach(s => {
      initial[s.id] = {};
      fakeDates.forEach(date => {
        initial[s.id][date] = false;
      });
    });
    return initial;
  });

  // Estado para la fecha seleccionada en las estadísticas
  const [selectedDateForStats, setSelectedDateForStats] = React.useState(fakeDates[0]);

  // Función para exportar a Excel con mejor estructura
  const exportToExcel = () => {
    // Crear workbook
    const wb = XLSX.utils.book_new();
    
    // Preparar datos para Excel
    const excelData = students.map(student => {
      const row = {
        'ID': student.id,
        'Nombre del Estudiante': student.name,
        'Email': student.email || '',
      };
      
      fakeDates.forEach(date => {
        const formattedDate = new Date(date).toLocaleDateString('es-ES', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        row[formattedDate] = attendance[student.id][date] ? 'Presente' : 'Ausente';
      });
      
      return row;
    });

    // Crear worksheet
    const ws = XLSX.utils.json_to_sheet(excelData, { origin: 'A4' }); // Empezar desde A4 para dejar espacio para el título

    // Agregar título y información de la materia
    const title = materia ? 
      `Asistencias de Tutorías - ${materia.categoria || 'Materia'} (${materia.Carreras?.nombre || 'Carrera'})` : 
      'Asistencias de Tutorías';
    
    const subtitle = `Período: ${fakeDates[0]} al ${fakeDates[fakeDates.length - 1]}`;
    const dateGenerated = `Generado el: ${new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;

    // Insertar filas de título
    XLSX.utils.sheet_add_aoa(ws, [
      [title],
      [subtitle],
      [dateGenerated],
      [] // Fila vacía
    ], { origin: 'A1' });

    // Configurar estilos y anchos de columna
    ws['!cols'] = [
      { width: 15 }, // ID
      { width: 35 }, // Nombre
      { width: 25 }, // Email
      ...fakeDates.map(() => ({ width: 20 })) // Fechas
    ];

    // Aplicar estilos al título
    if (ws['A1']) {
      ws['A1'].s = {
        font: { bold: true, size: 16, color: { rgb: "1976D2" } },
        alignment: { horizontal: "center" }
      };
    }
    if (ws['A2']) {
      ws['A2'].s = {
        font: { bold: true, size: 12, color: { rgb: "666666" } },
        alignment: { horizontal: "center" }
      };
    }
    if (ws['A3']) {
      ws['A3'].s = {
        font: { italic: true, size: 10, color: { rgb: "999999" } },
        alignment: { horizontal: "center" }
      };
    }

    // Aplicar estilos a los headers
    const headerRange = XLSX.utils.decode_range(ws['!ref']);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 3, c: col }); // Fila 4 (índice 3)
      if (ws[cellAddress]) {
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "1976D2" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };
      }
    }

    // Aplicar estilos a las celdas de datos
    for (let row = 4; row <= headerRange.e.r; row++) {
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (ws[cellAddress]) {
          // Estilo base para todas las celdas
          ws[cellAddress].s = {
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" }
            },
            alignment: { horizontal: "center", vertical: "center" }
          };

          // Estilo especial para celdas de asistencia
          if (col >= 3) { // Columnas de fechas
            const cellValue = ws[cellAddress].v;
            if (cellValue === 'Presente') {
              ws[cellAddress].s.fill = { fgColor: { rgb: "C8E6C9" } }; // Verde claro
              ws[cellAddress].s.font = { bold: true, color: { rgb: "2E7D32" } };
            } else if (cellValue === 'Ausente') {
              ws[cellAddress].s.fill = { fgColor: { rgb: "FFCDD2" } }; // Rojo claro
              ws[cellAddress].s.font = { bold: true, color: { rgb: "C62828" } };
            }
          }
        }
      }
    }

    // Agregar estadísticas por fecha al final
    const stats = getAttendanceStats();
    const totalRows = excelData.length + 6; // 4 filas de título + 1 fila vacía + datos + 1 fila vacía
    
    // Estadísticas generales
    XLSX.utils.sheet_add_aoa(ws, [
      [], // Fila vacía
      ['RESUMEN GENERAL DE ASISTENCIAS'],
      [`Total de Estudiantes: ${students.length}`],
      [`Total de Sesiones: ${fakeDates.length}`],
      [`Total de Asistencias: ${stats.totalPresent}`],
      [`Total de Ausencias: ${stats.totalAbsent}`],
      [`Porcentaje de Asistencia General: ${((stats.totalPresent / (stats.totalPresent + stats.totalAbsent)) * 100).toFixed(1)}%`],
      [] // Fila vacía
    ], { origin: `A${totalRows}` });

    // Estadísticas por fecha
    const statsByDateData = [
      ['ESTADÍSTICAS POR FECHA'],
      ['Fecha', 'Presentes', 'Ausentes', 'Total', 'Porcentaje de Asistencia']
    ];

    fakeDates.forEach(date => {
      const formattedDate = new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const dateStats = statsByDate[date];
      statsByDateData.push([
        formattedDate,
        dateStats.present,
        dateStats.absent,
        dateStats.total,
        `${dateStats.percentage}%`
      ]);
    });

    XLSX.utils.sheet_add_aoa(ws, statsByDateData, { origin: `A${totalRows + 8}` });

    // Estilos para las estadísticas
    const summaryStartRow = totalRows;
    if (ws[`A${summaryStartRow + 1}`]) {
      ws[`A${summaryStartRow + 1}`].s = {
        font: { bold: true, size: 14, color: { rgb: "1976D2" } },
        alignment: { horizontal: "center" }
      };
    }

    // Agregar el worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, "Asistencias");

    // Generar archivo y descargar
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Nombre del archivo con información de la materia
    const fileName = materia ? 
      `asistencias_${materia.categoria?.replace(/\s+/g, '_') || 'tutorias'}_${materia.Carreras?.nombre?.replace(/\s+/g, '_') || 'carrera'}_${new Date().toISOString().split('T')[0]}.xlsx` :
      `asistencias_tutorias_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    saveAs(data, fileName);
  };

  // Función para obtener estadísticas por fecha
  const getAttendanceStatsByDate = () => {
    const statsByDate = {};
    
    fakeDates.forEach(date => {
      let presentCount = 0;
      let absentCount = 0;
      
      students.forEach(student => {
        if (attendance[student.id] && attendance[student.id][date]) {
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

  // Función para obtener estadísticas totales (para el Excel)
  const getAttendanceStats = () => {
    let totalPresent = 0;
    let totalAbsent = 0;
    
    Object.values(attendance).forEach(studentAttendance => {
      Object.values(studentAttendance).forEach(isPresent => {
        if (isPresent) totalPresent++;
        else totalAbsent++;
      });
    });
    
    return { totalPresent, totalAbsent };
  };

  // Columnas: ID, Nombre, ...fechas
  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80,
      headerClassName: 'attendance-header',
      cellClassName: 'attendance-cell'
    },
    { 
      field: 'name', 
      headerName: 'Nombre del Estudiante', 
      width: 250,
      headerClassName: 'attendance-header',
      cellClassName: 'attendance-cell'
    },
    ...fakeDates.map(date => ({
      field: date,
      headerName: new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      width: 140,
      headerClassName: 'attendance-header',
      cellClassName: 'attendance-cell',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Tooltip title={attendance[params.row.id][date] ? 'Presente' : 'Ausente'}>
            <IconButton
              size="small"
              onClick={() => {
                setAttendance(prev => ({
                  ...prev,
                  [params.row.id]: {
                    ...prev[params.row.id],
                    [date]: !prev[params.row.id][date]
                  }
                }));
              }}
              sx={{
                backgroundColor: attendance[params.row.id][date] ? '#4caf50' : '#f44336',
                color: 'white',
                '&:hover': {
                  backgroundColor: attendance[params.row.id][date] ? '#45a049' : '#d32f2f',
                },
                width: 32,
                height: 32,
                transition: 'all 0.3s ease'
              }}
            >
              {attendance[params.row.id][date] ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      )
    }))
  ];

  // Filas: estudiantes
  const rows = students.map(s => ({
    id: s.id,
    name: s.name,
    ...fakeDates.reduce((acc, date) => {
      acc[date] = attendance[s.id][date];
      return acc;
    }, {})
  }));

  return (
    <MDBox sx={{ p: 3 }}>
      <MDBox 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <MDBox>
          <MDTypography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            📊 Registro de Asistencias
          </MDTypography>
          {materia && (
            <MDTypography variant="h6" sx={{ color: '#666', mt: 1 }}>
              {materia.categoria} - {materia.Carreras?.nombre}
            </MDTypography>
          )}
        </MDBox>
        
        <MDButton
          variant="contained"
          color="success"
          startIcon={<Download />}
          onClick={exportToExcel}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Exportar a Excel
        </MDButton>
      </MDBox>

      {/* Estadísticas por fecha */}
      <MDBox 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 2, 
          mb: 3
        }}
      >
        {/* Selector de fecha */}
        <MDBox 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <MDTypography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            📈 Estadísticas de Asistencia
          </MDTypography>
          <FormControl size="small" sx={{ minWidth: 250}}>
            <InputLabel id="date-select-label">Seleccionar Fecha</InputLabel>
            <Select
              labelId="date-select-label"
              value={selectedDateForStats}
              label="Seleccionar Fecha"
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

        {/* Chips de estadísticas */}
        <MDBox 
          sx={{ 
            display: 'flex', 
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <Chip
            icon={<CheckCircle />}
            label={`Presentes: ${statsByDate[selectedDateForStats]?.present || 0}`}
            color="success"
            variant="outlined"
            sx={{ 
              fontSize: '1rem',
              fontWeight: 'bold',
              borderWidth: 2
            }}
          />
          <Chip
            icon={<Cancel />}
            label={`Ausentes: ${statsByDate[selectedDateForStats]?.absent || 0}`}
            color="error"
            variant="outlined"
            sx={{ 
              fontSize: '1rem',
              fontWeight: 'bold',
              borderWidth: 2
            }}
          />
          <Chip
            label={`Total: ${statsByDate[selectedDateForStats]?.total || 0}`}
            color="primary"
            variant="outlined"
            sx={{ 
              fontSize: '1rem',
              fontWeight: 'bold',
              borderWidth: 2
            }}
          />
          <Chip
            label={`Asistencia: ${statsByDate[selectedDateForStats]?.percentage || '0.0'}%`}
            color="info"
            variant="outlined"
            sx={{ 
              fontSize: '1rem',
              fontWeight: 'bold',
              borderWidth: 2
            }}
          />
        </MDBox>


      </MDBox>

      {/* Tabla de asistencias */}
      <Paper 
        elevation={3}
        sx={{ 
          height: 500, 
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #e0e0e0'
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ 
            pagination: { paginationModel: { page: 0, pageSize: 10 } } 
          }}
          sx={{
            border: 0,
            '& .MuiDataGrid-root': {
              border: 'none'
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
              padding: '8px 16px'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8f9fa',
              borderBottom: '2px solid #e0e0e0'
            },
            '& .MuiDataGrid-columnHeader': {
              borderRight: '1px solid #e0e0e0',
              padding: '12px 16px',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: '#f5f5f5'
              },
              '&:nth-of-type(even)': {
                backgroundColor: '#fafafa'
              }
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: '#ffffff'
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '2px solid #e0e0e0',
              backgroundColor: '#f8f9fa'
            },
            '& .MuiDataGrid-paginationInfo': {
              fontWeight: 'bold'
            }
          }}
        />
      </Paper>

      {/* Resumen de todas las fechas */}
      <MDBox 
        sx={{ 
          display: 'flex', 
          gap: 1,
          flexWrap: 'wrap',
          mt: 3,
          p: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid #e0e0e0'
        }}
      >
        <MDTypography variant="body2" sx={{ color: '#666', fontWeight: 'bold', mr: 1 }}>
          📊 Resumen por fecha:
        </MDTypography>
        {fakeDates.map(date => (
          <Chip
            key={date}
            label={`${new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}: ${statsByDate[date]?.percentage}%`}
            size="small"
            color={parseFloat(statsByDate[date]?.percentage) >= 80 ? "success" : parseFloat(statsByDate[date]?.percentage) >= 60 ? "warning" : "error"}
            variant="outlined"
            sx={{ 
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}
          />
        ))}
      </MDBox>
    </MDBox>
  );
}

CourseViewAsistencias.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
    })
  ).isRequired,
  materia: PropTypes.shape({
    categoria: PropTypes.string,
    Carreras: PropTypes.shape({
      nombre: PropTypes.string
    })
  })
};

export default CourseViewAsistencias; 