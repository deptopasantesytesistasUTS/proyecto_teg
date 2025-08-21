import React from "react";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PeopleIcon from "@mui/icons-material/People";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { useState, useMemo } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { getValidStudentId, wasCedulaMapped } from "utils/studentUtils";

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

function ParticipantesList({ teachers, students }) {
  const navigate = useNavigate();
  
  // Función helper para navegar al perfil del estudiante
  const handleViewStudent = (cedula) => {
    const validCedula = getValidStudentId(cedula);
    console.log("🔍 ParticipantesList - Cédula original:", cedula);
    console.log("🔍 ParticipantesList - Cédula a usar:", validCedula);
    console.log("🔍 ParticipantesList - ¿Cédula fue mapeada?", wasCedulaMapped(cedula, validCedula));
    
    navigate(`/estudiantesDoc/${cedula}`);
  };
  
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Adaptar estudiantes según el endpoint
  const adaptedStudents = useMemo(() => adaptStudents(students), [students]);

  // Filtrado de estudiantes
  const filteredStudents = adaptedStudents.filter((s) =>
    s.name.toLowerCase().includes(searchName.toLowerCase()) &&
    String(s.id).toLowerCase().includes(searchId.toLowerCase())
  );

  // Función para exportar estudiantes a Excel
  const handleExportExcel = () => {
    const data = filteredStudents.map((s) => ({
      Nombre: s.name,
      Cédula: s.id,
      Teléfono: s.telf,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "estudiantes.xlsx");
  };

  // Función para exportar estudiantes a PDF
    const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Estudiantes", 14, 16);
    autoTable(doc, {
      head: [["Nombre", "Cédula", "Teléfono"]],
      body: filteredStudents.map(s => [s.name, s.id, s.telf]),
      startY: 22,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [33, 150, 243] }, // Azul
    });
    doc.save("estudiantes.pdf");
  };

  // Función para ver perfil - navega al perfil del estudiante
  const handleViewProfile = (student) => {
    const studentId = student.id || student.cedula;
    if (studentId) {
      handleViewStudent(studentId);
    } else {
      console.error("No se pudo obtener el ID del estudiante para navegar al perfil");
      alert("Error: No se pudo acceder al perfil del estudiante");
    }
  };

  return (
    <Card sx={{ p: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderRadius: 4, minHeight: 320, background: '#f8fafc' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PeopleIcon sx={{ mr: 1, color: "primary.main", fontSize: 32 }} />
        <MDTypography variant="h5" fontWeight="bold" color="primary.main">
          Participantes
        </MDTypography>
      </Box>
      {/* Filtros y botones de exportación */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Buscar nombre"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            sx={{ width: 180, background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            inputProps={{ style: { fontSize: 14 } }}
          />
          <TextField
            size="small"
            variant="outlined"
            placeholder="Buscar cédula"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            sx={{ width: 140, background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            inputProps={{ style: { fontSize: 14 } }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Descargar Excel" arrow>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              sx={{
                minWidth: 0,
                width: 40,
                height: 40,
                p: 0,
                borderRadius: '50%',
                boxShadow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
              }}
              onClick={handleExportExcel}
            >
              <DownloadIcon sx={{ fontSize: 22, color: "#fff" }} />
            </Button>
          </Tooltip>
          <Tooltip title="Descargar PDF" arrow>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              sx={{
                minWidth: 0,
                width: 40,
                height: 40,
                p: 0,
                borderRadius: '50%',
                boxShadow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
              }}
              onClick={handleExportPDF}
            >
              <PictureAsPdfIcon sx={{ fontSize: 22, color: "#fff" }} />
            </Button>
          </Tooltip>
        </Box>
      </Box>
      {/* Lista de estudiantes */}
      <Paper
  elevation={0}
  sx={{
    borderRadius: 3,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    background: '#fff',
    p: 0,
    mt: 1,
  }}
>
  <Box sx={{ px: 3, pt: 3, pb: 1 }}>
    
  </Box>
  <Box sx={{ px: 3, pb: 3 }}>
    {filteredStudents.length === 0 ? (
      <Box sx={{ width: '100%', textAlign: 'center', color: "#b0b0b0", fontStyle: "italic", py: 4 }}>
        No hay estudiantes para mostrar.
      </Box>
    ) : (
      filteredStudents.map((s) => (

      <Accordion key={s.id + s.email} sx={{ mb: 1, borderRadius: 2, boxShadow: '0 1px 4px rgba(33,150,243,0.08)' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-${s.id}-content`}
          id={`panel-${s.id}-header`}
          sx={{ background: '#f8fafc', borderRadius: 2 }}
        >
          <MDTypography variant="subtitle1" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            {s.name}
          </MDTypography>
          <MDTypography variant="body2" sx={{ ml: 2, color: '#555' }}>
            Cédula: {s.id}
          </MDTypography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            background: '#e3f2fd',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <MDTypography variant="body2"><b>Teléfono:</b> {s.telf}</MDTypography>
          </Box>
          <Box>
            <Tooltip title="Ver perfil completo del estudiante" arrow>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                sx={{ minWidth: 0, p: 1 , borderRadius: '50%' }}
                onClick={() => handleViewProfile(s)}
              >
                <VisibilityIcon />
              </Button>
            </Tooltip>
          </Box>
        </AccordionDetails>
      </Accordion>
      ))
    )}
  </Box>
</Paper>
    </Card>
  );
}

ParticipantesList.propTypes = {
  teachers: PropTypes.array.isRequired,
  students: PropTypes.array.isRequired,
};

export default ParticipantesList;