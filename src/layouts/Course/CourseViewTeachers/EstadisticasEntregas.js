import React, { useState } from "react";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import LinearProgress from "@mui/material/LinearProgress";
import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { backendUrl } from "config";
import { CheckCircle, Warning, Error, TrendingUp, People, Assignment } from "@mui/icons-material";
import { Chip, Box, Grid, Paper, ListItemIcon, Divider } from "@mui/material";
import PropTypes from "prop-types";

function EstadisticasEntregas({categoria}) {
  const { id, idMateria } = useParams();
  const [totalEstudiantes, setTotal] = useState(0);
  const [estadisticas, setEstadisticas] = useState([
    { label: "Entrega de Título", value: 85 },
    { label: "Entrega de Borrador 1", value: 72 },
  ]);
  const [totalEntregas, setTotalEntregas] = useState(0);
  const [promedioEntregas, setPromedioEntregas] = useState(0);
  const [actividadesCompletadas,setactividadesCompletadas] = useState(0);
  const [actividadesPendientes, setactividadesPendientes] = useState(0);

  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Get user ID from localStorage or context
      let user = null;
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          user = JSON.parse(userStr);
        }
      } catch (e) {
        user = null;
      }
      console.log(user.userId);
      const userId = user.userId; // You might need to adjust this based on your auth system

      const response = await fetch(`${backendUrl}/user/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("user",data)
        setUserData(data);
      } else {
        setError("Error al cargar los datos del usuario");
        // Set default data for development
        setUserData({
          firstName: "",
          secondName: "",
          firstLastName: "",
          secondLastName: "",
          id: "",
          email: "",
          phone: "",
          role: "Docente",
        });
      }
    } catch (err) {
      setError("Error de conexión");
      console.error("Error fetching user data:", err);
      // Set default data for development
    } finally {
      setLoading(false);
    }
  };

  const fetchEstadisticas = async () => {
    try {
      setLoading(true);
      // Get user ID from localStorage or context
      let user = null;
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          user = JSON.parse(userStr);
        }
      } catch (e) {
        user = null;
      }
      console.log(userData);
      const userId = user.userId; // You might need to adjust this based on your auth system

      const response = await fetch(
        `${backendUrl}/aulavirtualDocente/estadisticas/${idMateria}/${userData?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("data",data)
        setTotal(data.totalEst);
        if (categoria === "investigacion_II") {
          console.log("Inv2");
          setEstadisticas([
            {
              label: "Protocolo de Investigación 1",
              label: data.protocolo1,
            },
            {
              label: "Protocolo de Investigación 2",
              value: data.protocolo2,
            },
            {
              label: "Protocolo de Investigación 3",
              value: data.protocolo3,
            },
            { label: "Capitulo 1", value: data.cap1 },
            { label: "Carta Empresarial", value: data.caE },
            { label: "Capitulo 2", value: data.cap2 },
            { label: "Capitulo 3", value: data.cap3 },
            {
              label: "Instrumentos de Investigaccion",
              value: data.InstrInv,
            },
          ]);
          setTotalEntregas(
            data.protocolo1 +
              data.protocolo3 +
              data.protocolo2 +
              data.cap1 +
              data.caE +
              data.cap2 +
              data.cap3 +
              data.InstrInv
          );
        } else if (categoria === "Trabajo_Especial_de_Grado") {
          console.log("TEG")
          setEstadisticas([
            { label: "Entrega Instrumento 1", value: data.instr1 },
            { label: "Entrega Instrumento 2", value: data.instr2 },
            { label: "Entrega de Propuesta", value: data.eProp },
            {
              label: "Informe Completo",
              value: data.Informe,
            },
            {
              label: "Tomo Completo (Correciones Predefensa)",
              value: data.TomoC,
            },
            { label: "Entrega de Diapositivas", value: data.Diapositivas },
          ]);
          setTotalEntregas(
            data.instr1 +
              data.instr2 +
              data.eProp +
              data.Informe +
              data.TomoC +
              data.Diapositivas
          );
          console.log("TEG fin");
        } else {
          console.log("Tut");
          setEstadisticas([])
          setTotalEntregas(0)
        }
        


      } else {
        setError("Error al cargar las estadisticas");
        // Set default data for development
      }
    } catch (err) {
      setError("Error de conexión");
      console.error("Error al cargar las estadisticas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchEstadisticas();
  }, []);

  useEffect(() => {
    fetchEstadisticas();
  }, [userData]);

  useEffect(() => {
    console.log("legth", estadisticas.length);
    console.log(estadisticas);
    setPromedioEntregas(totalEntregas / estadisticas.length);
    setactividadesCompletadas(totalEntregas);
    setactividadesPendientes(estadisticas.length * totalEstudiantes - totalEntregas);
  }, [estadisticas]);

  // Calcular estadísticas generales


  // Función para obtener el color del estado
  const getStatusColor = (value) => {
    if (value >= 80) return "success";
    if (value >= 60) return "warning";
    return "error";
  };

  // Función para obtener el icono del estado
  const getStatusIcon = (value) => {
    if (value >= 80) return <CheckCircle fontSize="small" />;
    if (value >= 60) return <Warning fontSize="small" />;
    return <Error fontSize="small" />;
  };

  // Calcular estudiantes por actividad
  const getEstudiantesPorActividad = (percentage) => {
    return Math.round((percentage / 100) * totalEstudiantes);
  };

  return (
    <MDBox sx={{ p: 3 }}>
      {/* Header con título */}
      <MDBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <MDBox>
          <MDTypography variant="h4" sx={{ color: "#1976d2", fontWeight: "bold" }}>
            📊 Control de Entregas
          </MDTypography>
          <MDTypography variant="h6" sx={{ color: "#666", mt: 1 }}>
            Seguimiento de Actividades Académicas
          </MDTypography>
        </MDBox>
      </MDBox>

      {/* Estadísticas generales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              textAlign: "center",
            }}
          >
            <People sx={{ fontSize: 40, mb: 1 }} />
            <MDTypography variant="h4" fontWeight="bold">
              {totalEstudiantes}
            </MDTypography>
            <MDTypography variant="body2">Total Estudiantes</MDTypography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
              color: "white",
              textAlign: "center",
            }}
          >
            <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
            <MDTypography variant="h4" fontWeight="bold">
              {actividadesCompletadas}
            </MDTypography>
            <MDTypography variant="body2">Actividades Completadas</MDTypography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
              color: "white",
              textAlign: "center",
            }}
          >
            <Warning sx={{ fontSize: 40, mb: 1 }} />
            <MDTypography variant="h4" fontWeight="bold">
              {actividadesPendientes}
            </MDTypography>
            <MDTypography variant="body2">Actividades Pendientes</MDTypography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
              color: "white",
              textAlign: "center",
            }}
          >
            <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
            <MDTypography variant="h4" fontWeight="bold">
              {promedioEntregas.toFixed(1)}%
            </MDTypography>
            <MDTypography variant="body2">Promedio General</MDTypography>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de actividades */}
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          background: "#ffffff",
        }}
      >
        <MDBox
          sx={{
            p: 3,
            backgroundColor: "#f8f9fa",
            borderBottom: "2px solid #e0e0e0",
          }}
        >
          <MDTypography
            variant="h5"
            sx={{ color: "#1976d2", fontWeight: "bold", display: "flex", alignItems: "center" }}
          >
            <Assignment sx={{ mr: 1 }} />
            Actividades Académicas
          </MDTypography>
        </MDBox>

        <List sx={{ p: 0 }}>
          {estadisticas.map((actividad, index) => (
            <React.Fragment key={actividad.label}>
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 3,
                  px: 3,
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    transition: "background-color 0.3s ease",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getStatusIcon(actividad.value)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <MDTypography component="span" fontWeight="bold" variant="h6">
                          {actividad.label}
                        </MDTypography>
                      }
                      secondary={
                        <MDTypography variant="body2" color="text.secondary">
                          {getEstudiantesPorActividad(actividad.value)} de {totalEstudiantes}{" "}
                          estudiantes han entregado
                        </MDTypography>
                      }
                      sx={{ m: 0 }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Chip
                      icon={getStatusIcon(actividad.value)}
                      label={`${actividad.value}%`}
                      color={getStatusColor(actividad.value)}
                      variant="filled"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        minWidth: 80,
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ width: "100%", position: "relative" }}>
                  <LinearProgress
                    variant="determinate"
                    value={actividad.value}
                    sx={{
                      width: "100%",
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 8,
                        background: `linear-gradient(90deg, ${
                          actividad.value >= 80
                            ? "#4caf50"
                            : actividad.value >= 60
                            ? "#ff9800"
                            : "#f44336"
                        } 0%, ${
                          actividad.value >= 80
                            ? "#45a049"
                            : actividad.value >= 60
                            ? "#f57c00"
                            : "#d32f2f"
                        } 100%)`,
                      },
                    }}
                  />
                  <MDTypography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: -20,
                      color: "text.secondary",
                      fontWeight: "bold",
                    }}
                  >
                    {getEstudiantesPorActividad(actividad.value)}/{totalEstudiantes}
                  </MDTypography>
                </Box>
              </ListItem>
              {index < estadisticas.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Card>
    </MDBox>
  );
}

EstadisticasEntregas.propTypes = {
  estadisticas: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  categoria: PropTypes.any,
};

export default EstadisticasEntregas;
