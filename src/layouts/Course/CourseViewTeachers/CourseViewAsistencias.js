import * as React from "react";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import PropTypes from "prop-types";

// Fechas de ejemplo (puedes reemplazar por las del backend)
const fakeDates = [
  "2024-06-01",
  "2024-06-08",
  "2024-06-15",
  "2024-06-22",
  "2024-06-29"
];

function CourseViewAsistencias({ students }) {
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

  // Columnas: ID, Nombre, ...fechas
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nombre', width: 200 },
    ...fakeDates.map(date => ({
      field: date,
      headerName: date,
      width: 120,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={!!attendance[params.row.id][date]}
          onChange={() => {
            setAttendance(prev => ({
              ...prev,
              [params.row.id]: {
                ...prev[params.row.id],
                [date]: !prev[params.row.id][date]
              }
            }));
          }}
        />
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
    <MDBox>
      <MDTypography variant="h4" sx={{ color: '#1976d2', mb: 2 }}>
        Registro de Asistencias
      </MDTypography>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
          sx={{ border: 0 }}
        />
      </Paper>
    </MDBox>
  );
}

CourseViewAsistencias.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CourseViewAsistencias; 