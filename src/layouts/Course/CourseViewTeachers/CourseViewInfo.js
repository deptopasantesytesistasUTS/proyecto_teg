import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import ParticipantesList from "./ParticipantesList";
import RecursosList from "./RecursosList";
import EstadisticasEntregas from "./EstadisticasEntregas";
import UltimosConectadosList from "./UltimosConectadosList";
import UltimosComunicadosList from "./UltimosComunicadosList";
import { backendUrl } from "config";
import PropTypes from "prop-types";

function CourseViewInfo({ seccionId }) {
  const [latestUsers, setLatestUsers] = useState([]);
  const [estadisticasEntregas, setEstadisticasEntregas] = useState([]);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);

  useEffect(() => {
    if (!seccionId) return;
    // Últimos conectados
    fetch(`${backendUrl}/aulavirtualDocente/secciones/${seccionId}/ultimos-conectados?limit=6`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => Array.isArray(data) && setLatestUsers(data))
      .catch(() => {});
    // Estadísticas de entregas
    fetch(`${backendUrl}/aulavirtualDocente/secciones/${seccionId}/estadisticas-entregas`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => Array.isArray(data) && setEstadisticasEntregas(data))
      .catch(() => {});
    // Total de estudiantes en la sección (se reutiliza el endpoint de participantes)
    fetch(`${backendUrl}/secciones/${seccionId}/participantes`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const count = Array.isArray(data?.estudiantes) ? data.estudiantes.length : 0;
        setTotalEstudiantes(count);
      })
      .catch(() => {});
  }, [seccionId]);

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
          <UltimosComunicadosList announcements={[]} />
        </Grid>
        <Grid item xs={12} md={4}>
          <UltimosConectadosList users={latestUsers} />
        </Grid>
        <Grid item xs={12} md={8}>
          <EstadisticasEntregas estadisticas={estadisticasEntregas} totalEstudiantes={totalEstudiantes} />
        </Grid>
      </Grid>
    </MDBox>
  );
}

CourseViewInfo.propTypes = {
  seccionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default CourseViewInfo;
