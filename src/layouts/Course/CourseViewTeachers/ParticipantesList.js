import React from "react";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import PeopleIcon from "@mui/icons-material/People";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import { useState } from "react";

function ParticipantesList({ teachers, students }) {
  // Filtros de búsqueda
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  // Función para exportar estudiantes a Excel
  const handleExportExcel = () => {
    const data = filteredStudents.map((s) => ({
      Nombre: s.name,
      Cédula: s.id,
      Email: s.email,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "estudiantes.xlsx");
  };
  // Filtrado de estudiantes
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchName.toLowerCase()) &&
    s.id.toLowerCase().includes(searchId.toLowerCase())
  );
  return (
    <Card sx={{ p: 3, boxShadow: 'none', borderRadius: 3, minHeight: 320, background: '#f8fafc' }}>
      <MDTypography variant="h5" mb={1.5} display="flex" alignItems="center" fontWeight="bold" color="primary.main">
        <PeopleIcon sx={{ mr: 1 }} /> Participantes
      </MDTypography>
      {/* Filtros y botón Excel */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mb: 1 }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Buscar nombre"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{ width: 150, background: '#fff', borderRadius: 2 }}
          inputProps={{ style: { fontSize: 13 } }}
        />
        <TextField
          size="small"
          variant="outlined"
          placeholder="Buscar cédula"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          sx={{ width: 120, background: '#fff', borderRadius: 2 }}
          inputProps={{ style: { fontSize: 13 } }}
        />
        <Tooltip title="Descargar Excel" arrow>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{ minWidth: 0, width: 36, height: 36, p: 0, borderRadius: '50%', boxShadow: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleExportExcel}
          >
            <DownloadIcon sx={{ fontSize: 20 }} />
          </Button>
        </Tooltip>
      </Box>
   
      <MDTypography variant="subtitle2" color="text.secondary" mb={1} fontWeight="bold">
        Estudiantes
      </MDTypography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', mb: 2, p: 0, background: 'transparent' }}>
        <Table sx={{ tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ width: 160, fontWeight: 'bold', color: 'primary.main', py: 2.5, px: 25, fontSize: 16, letterSpacing: 1, textAlign: 'left', pl: 10, borderTopLeftRadius: 12, borderBottom: '2px solid #e3e3e3', background: '#f5f7fa' }}>
                Nombre
              </TableCell>
              <TableCell align="left" sx={{ width: 120, fontWeight: 'bold', color: 'primary.main', py: 2.5, px: 23, fontSize: 16, letterSpacing: 1, textAlign: 'left', pl: 10, borderBottom: '2px solid #e3e3e3', background: '#f5f7fa' }}>
                Cédula
              </TableCell>
              <TableCell align="left" sx={{ width: 220, fontWeight: 'bold', color: 'primary.main', py: 2.5, px: 35, fontSize: 16, letterSpacing: 1, textAlign: 'left', pl: 10, borderTopRightRadius: 12, borderBottom: '2px solid #e3e3e3', background: '#f5f7fa' }}>
                Email
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((s, idx) => (
              <TableRow key={s.email} hover sx={{ verticalAlign: 'top', background: idx % 2 === 0 ? '#fff' : '#f8fafc', transition: 'background 0.2s', '&:hover': { background: '#e3f2fd' } }}>
                <TableCell align="left" sx={{ width: 160, whiteSpace: 'pre-line', wordBreak: 'break-word', verticalAlign: 'top', textAlign: 'left', py: 2, borderBottom: '1px solid #e3e3e3' }}>
                  {s.name}
                </TableCell>
                <TableCell align="left" sx={{ width: 120, verticalAlign: 'top', textAlign: 'left', py: 2, borderBottom: '1px solid #e3e3e3' }}>
                  {s.id}
                </TableCell>
                <TableCell align="left" sx={{ width: 220, verticalAlign: 'top', textAlign: 'left', py: 2, borderBottom: '1px solid #e3e3e3' }}>
                  {s.email}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

ParticipantesList.propTypes = {
  teachers: PropTypes.array.isRequired,
  students: PropTypes.array.isRequired,
};

export default ParticipantesList;
