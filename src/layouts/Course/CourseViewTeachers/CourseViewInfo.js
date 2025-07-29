import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import ParticipantesList from "./ParticipantesList";
import RecursosList from "./RecursosList";
import EstadisticasEntregas from "./EstadisticasEntregas";
import UltimosConectadosList from "./UltimosConectadosList";
import UltimosComunicadosList from "./UltimosComunicadosList";

function CourseViewInfo() {
  // Ejemplo de participantes
  const teachers = [
    {
      name: "Dr. María González",
      role: "Profesor Principal",
      email: "maria.gonzalez@universidad.edu",
      specialty: "Inteligencia Artificial",
    },
    {
      name: "Prof. Carlos Rodríguez",
      role: "Profesor Asistente",
      email: "carlos.rodriguez@universidad.edu",
      specialty: "Desarrollo de Software",
    },
  ];
  const students = [
    {
      name: "Luis Alejandro Cárdenas Lozano",
      id: "V-30.443.230",
      email: "luiscl1804@gmail.com",
    },
    {
      name: "Ana Sofía Martínez",
      id: "V-28.123.456",
      email: "ana.martinez@estudiante.edu",
    },
    {
      name: "Carlos Eduardo López",
      id: "V-29.789.012",
      email: "carlos.lopez@estudiante.edu",
    },
  ];
  // Ejemplo de recursos
  const [resources, setResources] = useState([
    {
      name: "Calendario Académico 2024",
      type: "PDF",
      url: "#",
      description: "Calendario oficial de actividades académicas del año 2024",
    },
    {
      name: "Formato de Carta de Presentación",
      type: "DOC",
      url: "#",
      description: "Plantilla oficial para cartas de presentación de proyectos",
    },
    {
      name: "Guía de Estilo para Tesis",
      type: "PDF",
      url: "#",
      description: "Manual de formato y estilo para la presentación de tesis",
    },
    {
      name: "Formato de Evaluación de Jueces",
      type: "XLS",
      url: "#",
      description: "Planilla de evaluación utilizada por los jueces del tribunal",
    },
  ]);
  const handleAddResource = () => {
    setResources((prev) => [
      ...prev,
      {
        name: `Recurso Nuevo ${prev.length + 1}`,
        type: "PDF",
        url: "#",
        description: "Recurso agregado por el usuario.",
      },
    ]);
  };
  // Ejemplo de estadísticas
  const estadisticasEntregas = [
    { label: "Entrega de Título", value: 85 },
    { label: "Entrega de Borrador 1", value: 72 },
    { label: "Entrega de Borrador 2", value: 68 },
    { label: "Entrega de Borrador 3", value: 45 },
    { label: "Entrega de Borrador Final", value: 32 },
  ];
  // Ejemplo de últimos estudiantes conectados
  const latestUsers = [
    {
      name: "Luis Alejandro Cárdenas Lozano",
      id: "V-30.443.230",
      email: "luiscl1804@gmail.com",
      lastConnection: "2024-06-07 10:15",
    },
    {
      name: "Ana Sofía Martínez",
      id: "V-28.123.456",
      email: "ana.martinez@estudiante.edu",
      lastConnection: "2024-06-07 09:50",
    },
    {
      name: "Carlos Eduardo López",
      id: "V-29.789.012",
      email: "carlos.lopez@estudiante.edu",
      lastConnection: "2024-06-06 21:30",
    },
  ];
  // Ejemplo de últimos comunicados
  const latestAnnouncements = [
    {
      title: "Entrega de Proyecto Final",
      date: "2024-06-07",
      author: "Prof. Carlos Rodríguez",
      content: "Recuerden que la entrega del proyecto final es el 15 de junio.",
    },
    {
      title: "Reunión Extraordinaria",
      date: "2024-06-05",
      author: "Dr. María González",
      content: "Habrá una reunión extraordinaria el viernes a las 10:00 am.",
    },
    {
      title: "Nuevo Recurso Disponible",
      date: "2024-06-03",
      author: "Prof. Carlos Rodríguez",
      content: "Se ha subido la guía de estilo para tesis en la sección de recursos.",
    },
  ];

  return (
    <MDBox
      sx={{
        background: "#f8fafc",
        borderRadius: 2,
        p: { xs: 2, md: 4 },
      }}
    >
      <MDTypography
        variant="h4"
        fontWeight="bold"
        mb={3}
        color="primary.main"
        textAlign="center"
        letterSpacing={1}
      >
        Información General del Curso
      </MDTypography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <UltimosComunicadosList announcements={latestAnnouncements} />
        </Grid>
        <Grid item xs={12} md={4}>
          <UltimosConectadosList users={latestUsers} />
        </Grid>
        <Grid item xs={12} md={8}>
          <EstadisticasEntregas estadisticas={estadisticasEntregas.slice(0,0)} />
        </Grid>
      </Grid>
    </MDBox>
  );
}

export default CourseViewInfo;
