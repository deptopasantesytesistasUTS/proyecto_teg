import React from "react";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import LinearProgress from "@mui/material/LinearProgress";
import { 
  CheckCircle, 
  Warning, 
  Error,
  TrendingUp,
  People,
  Assignment
} from "@mui/icons-material";
import { 
  Chip, 
  Box, 
  Grid, 
  Paper, 
  ListItemIcon,
  Divider
} from "@mui/material";
import PropTypes from "prop-types";

function EstadisticasEntregas({ estadisticas, totalEstudiantes = 25 }) {
  // Calcular estadísticas generales
  const totalEntregas = estadisticas.reduce((sum, e) => sum + e.value, 0);
  const promedioEntregas = totalEntregas / estadisticas.length;
  const actividadesCompletadas = estadisticas.filter(e => e.value >= 70).length;
  const actividadesPendientes = estadisticas.filter(e => e.value < 70).length;

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
            📊 Control de Entregas
          </MDTypography>
          <MDTypography variant="h6" sx={{ color: '#666', mt: 1 }}>
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <People sx={{ fontSize: 40, mb: 1 }} />
            <MDTypography variant="h4" fontWeight="bold">
              {totalEstudiantes}
            </MDTypography>
            <MDTypography variant="body2">
              Total Estudiantes
            </MDTypography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <CheckCircle sx={{ fontSize: 40, mb: 1 }} />
            <MDTypography variant="h4" fontWeight="bold">
              {actividadesCompletadas}
            </MDTypography>
            <MDTypography variant="body2">
              Actividades Completadas
            </MDTypography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Warning sx={{ fontSize: 40, mb: 1 }} />
            <MDTypography variant="h4" fontWeight="bold">
              {actividadesPendientes}
            </MDTypography>
            <MDTypography variant="body2">
              Actividades Pendientes
            </MDTypography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
            <MDTypography variant="h4" fontWeight="bold">
              {promedioEntregas.toFixed(1)}%
            </MDTypography>
            <MDTypography variant="body2">
              Promedio General
            </MDTypography>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de actividades */}
      <Card 
        elevation={3}
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
          background: '#ffffff'
        }}
      >
        <MDBox 
          sx={{ 
            p: 3, 
            backgroundColor: '#f8f9fa',
            borderBottom: '2px solid #e0e0e0'
          }}
        >
          <MDTypography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
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
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transition: 'background-color 0.3s ease'
                  }
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
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
                          {getEstudiantesPorActividad(actividad.value)} de {totalEstudiantes} estudiantes han entregado
                        </MDTypography>
                      }
                      sx={{ m: 0 }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      icon={getStatusIcon(actividad.value)}
                      label={`${actividad.value}%`}
                      color={getStatusColor(actividad.value)}
                      variant="filled"
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        minWidth: 80
                      }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ width: "100%", position: 'relative' }}>
                  <LinearProgress
                    variant="determinate"
                    value={actividad.value}
                    sx={{ 
                      width: "100%", 
                      height: 16, 
                      borderRadius: 8,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 8,
                        background: `linear-gradient(90deg, ${
                          actividad.value >= 80 ? '#4caf50' : 
                          actividad.value >= 60 ? '#ff9800' : '#f44336'
                        } 0%, ${
                          actividad.value >= 80 ? '#45a049' : 
                          actividad.value >= 60 ? '#f57c00' : '#d32f2f'
                        } 100%)`
                      }
                    }}
                  />
                  <MDTypography 
                    variant="caption" 
                    sx={{ 
                      position: 'absolute', 
                      right: 0, 
                      top: -20,
                      color: 'text.secondary',
                      fontWeight: 'bold'
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
  totalEstudiantes: PropTypes.number,
};

export default EstadisticasEntregas;
