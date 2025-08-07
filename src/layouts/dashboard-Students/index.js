import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Pagination,
  Modal,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  useMediaQuery,
  Container,
  IconButton,
  Drawer,
  Fab,
  Stack,
} from "@mui/material";
import {
  Event as EventIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Groups as MeetingIcon,
  Slideshow as PresentationIcon,
  CalendarToday as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Cronograma from "layouts/dashboard/components/Cronograma";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

// Images
import team4 from "assets/images/team-4.jpg";
import { useAuth } from "../../context/AuthContext";

function DashboardStudents() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { user: usuario } = useAuth();
  const [misClases, setMisClases] = useState([]);
  const [materiasAulaVirtual, setMateriasAulaVirtual] = useState([]);
  const [cedula, setCedula] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Datos de eventos/actividades del calendario
  const appointments = [
    {
      id: 1,
      title: "Entrega de Proyecto TEG",
      startDate: new Date(2024, 11, 15, 10, 0),
      endDate: new Date(2024, 11, 15, 12, 0),
      description: "Entrega final del Trabajo Especial de Grado. Debe incluir documentación completa y presentación.",
      type: "assignment",
    },
    {
      id: 2,
      title: "Examen de Investigación II",
      startDate: new Date(2024, 11, 18, 14, 0),
      endDate: new Date(2024, 11, 18, 16, 0),
      description: "Examen parcial de la materia Investigación II. Temas: Metodología de investigación y análisis de datos.",
      type: "exam",
    },
    {
      id: 3,
      title: "Reunión de Tutoria",
      startDate: new Date(2024, 11, 20, 9, 0),
      endDate: new Date(2024, 11, 20, 10, 0),
      description: "Reunión con el tutor para revisar avances del proyecto de investigación.",
      type: "meeting",
    }
  ];

  useEffect(() => {
    console.log("Valor de usuario en dashboard estudiantes:", usuario);
    if (usuario && usuario.userId && usuario.role) {
      console.log("Dashboard fetch materias: userId=", usuario.userId, "role=", usuario.role, "cedula=", usuario.cedula);
      fetch(`https://proyecto-teg-bakend.onrender.com/api/materias-dashboard?userId=${usuario.userId}&role=${usuario.role}`)
        .then((res) => res.json())
        .then((data) => {
          // Asegurar que data sea un array
          const materias = Array.isArray(data) ? data : [];
          console.log("Materias recibidas:", materias);
          setMisClases(materias);
        })
        .catch((err) => {
          console.error("Error fetching materias:", err);
          setMisClases([]);
        });
      // Petición para obtener la cédula si es estudiante
      if (usuario.role === 3 || usuario.role === "3") {
        fetch(`https://proyecto-teg-bakend.onrender.com/api/cedula-estudiante?userId=${usuario.userId}`)
          .then(res => res.json())
          .then(data => {
            console.log("Cédula del estudiante:", data.cedula);
            setCedula(data.cedula);
          });
      }
    }
  }, [usuario]);

  useEffect(() => {
    fetch("https://proyecto-teg-bakend.onrender.com/api/materias-aulavirtual")
      .then((res) => res.json())
      .then((data) => setMateriasAulaVirtual(data))
      .catch(() => setMateriasAulaVirtual([]));
  }, []);

  useEffect(() => {
    if (cedula !== null) {
      console.log("Cédula del estudiante (efecto):", cedula);
    }
  }, [cedula]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "assignment":
        return <AssignmentIcon />;
      case "exam":
        return <SchoolIcon />;
      case "meeting":
        return <MeetingIcon />;
      case "presentation":
        return <PresentationIcon />;
      case "event":
        return <EventIcon />;
      default:
        return <EventIcon />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case "assignment":
        return "#ff9800";
      case "exam":
        return "#f44336";
      case "meeting":
        return "#2196f3";
      case "presentation":
        return "#4caf50";
      case "event":
        return "#9c27b0";
      default:
        return "#9c27b0";
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={8}>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium">
                Calendario de Actividades
              </MDTypography>
            </MDBox>
            <Cronograma 
              events={appointments.map(event => ({
                id: event.id,
                title: event.title,
                date: event.startDate,
                type: event.type === 'assignment' ? 'tarea' : 
                      event.type === 'exam' ? 'examen' : 
                      event.type === 'meeting' ? 'reunion' : 
                      event.type === 'presentation' ? 'proyecto' : 'clase',
                description: event.description
              }))}
              onEventClick={(event) => handleEventClick(event)}
            />
          </Grid>

          <Grid item xs={12} lg={4}>
            <MDBox mb={3}>
              <OrdersOverview />
            </MDBox>
          </Grid>
        </Grid>

        {/* Sección Mis Clases */}
        <MDBox pt={4}>
          <MDBox pt={2} px={2} lineHeight={1.25}>
            <MDTypography variant="h6" fontWeight="medium">
              Mis Clases
            </MDTypography>
            <MDBox mb={1}>
              <MDTypography variant="button" color="text">
                Actualmente estás inscrito en:
              </MDTypography>
            </MDBox>
          </MDBox>
          <MDBox p={2}>
            <Grid container spacing={3}>
              {!Array.isArray(misClases) || misClases.length === 0 ? (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <MDTypography variant="body2" color="text.secondary" textAlign="center">
                        No tienes materias asignadas.
                      </MDTypography>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                misClases.map((clase, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                        },
                        position: "relative",
                        overflow: "hidden",
                      }}
                      onClick={() => navigate(`/unidadesEst/${clase.idMateria}`)}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          height: 80,
                          background: `linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: "rgba(255,255,255,0.9)",
                            borderRadius: "12px",
                            px: 1.5,
                            py: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: "bold",
                              color: "#1976d2",
                              textTransform: "uppercase",
                              fontSize: "0.7rem",
                            }}
                          >
                            {clase.categoria || "Materia"}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color: "#2c3e50",
                              mb: 1,
                              lineHeight: 1.2,
                              fontSize: "1.1rem",
                              textAlign: "center",
                            }}
                          >
                            {clase.carrera || "Sin carrera"}
                          </Typography>
                          
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <SchoolIcon
                              sx={{
                                fontSize: "1rem",
                                color: "#7f8c8d",
                                mr: 0.5,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#7f8c8d",
                                fontSize: "0.85rem",
                              }}
                            >
                              Cargo: ESTUDIANTE
                            </Typography>
                          </Box>
                          
                          {clase.categoria && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <AssignmentIcon
                                sx={{
                                  fontSize: "1rem",
                                  color: "#7f8c8d",
                                  mr: 0.5,
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#7f8c8d",
                                  fontSize: "0.85rem",
                                }}
                              >
                                Categoría: {clase.categoria}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: "#1976d2",
                              color: "white",
                              fontWeight: "bold",
                              textTransform: "none",
                              borderRadius: "8px",
                              px: 2,
                              py: 0.5,
                              "&:hover": {
                                backgroundColor: "#1565c0",
                              },
                            }}
                          >
                            Ver Sección
                          </Button>
                          
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: "#27ae60",
                              animation: "pulse 2s infinite",
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Modal para mostrar detalles del evento */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="event-modal-title"
        aria-describedby="event-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedEvent && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ color: getEventColor(selectedEvent.type), mr: 1 }}>
                  {getEventIcon(selectedEvent.type)}
                </Box>
                <Typography id="event-modal-title" variant="h6" component="h2">
                  {selectedEvent.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Fecha:</strong>{" "}
                {format(selectedEvent.startDate, "dd/MM/yyyy HH:mm", { locale: es })} -{" "}
                {format(selectedEvent.endDate, "HH:mm", { locale: es })}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                {selectedEvent.description}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleCloseModal} variant="contained">
                  Cerrar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default DashboardStudents;
