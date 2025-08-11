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
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "config";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import SubjectSideMenu from "components/SubjectSideMenu";
import { useAuth } from "../../context/AuthContext";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Cronograma from "layouts/dashboard/components/Cronograma";

import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function DashboardTeachers() {
  const theme = useTheme();
  
  const navigate = useNavigate();
  const { user: usuario } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [misClases, setMisClases] = useState([]);
  const [materiasAulaVirtual, setMateriasAulaVirtual] = useState([]);
  const [cedula, setCedula] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entregaSeleccionada, setEntregaSeleccionada] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [dashboardEvents, setDashboardEvents] = useState([]);
  


  const API_URL = backendUrl;

  useEffect(() => {
    console.log("Valor de usuario en dashboard maestros:", usuario);
    if (usuario && usuario.userId && usuario.role) {
      console.log("Dashboard fetch materias: userId=", usuario.userId, "role=", usuario.role, "cedula=", usuario.cedula);
      fetch(`${API_URL}/materias-dashboard?userId=${usuario.userId}&role=${usuario.role}`)
        .then((res) => res.json())
        .then((data) => {
          setMisClases(data);
        })
        .catch((err) => {
          setMisClases([]);
        });
      // Petición para obtener la cédula si es docente
      if (usuario.role === 2 || usuario.role === "2") {
        fetch(`${API_URL}/cedula-personal?userId=${usuario.userId}`)
          .then(res => res.json())
          .then(data => {
            console.log("Cédula del docente:", data.cedula);
            setCedula(data.cedula);
          });
      }
    }
  }, [usuario]);

  useEffect(() => {
    // Obtener la cédula del docente
    let docenteCedula = null;
    if (usuario && (usuario.role === 2 || usuario.role === "2")) {
      fetch(`${API_URL}/cedula-personal?userId=${usuario.userId}`)
        .then(res => res.json())
        .then(data => {
          docenteCedula = data.cedula;
          // Ahora sí, obtener materias aula virtual filtradas por docente
          fetch(`${API_URL}/materias-aulavirtual`)
            .then((res) => res.json())
            .then((data) => {
              // Asegurar que data sea un array
              const materiasData = Array.isArray(data) ? data : [];
              // Filtrar solo las materias donde alguna sección tiene idDocente igual a la cédula
              const materiasDocente = materiasData.filter(m => m.secciones && Array.isArray(m.secciones) && m.secciones.some(s => s.idDocente === docenteCedula));
              const materiasMapeadas = materiasDocente.map(m => ({
                idMateria: m.idMateria,
                categoria: m.categoria,
                nombre: m.nombre,
                carrera: m.carrera
              }));
              console.log("Materias del docente:", materiasMapeadas);
              console.log("Categorías disponibles:", materiasMapeadas.map(m => m.categoria));
              setMisClases(materiasMapeadas);
            })
            .catch((err) => {
              console.error("Error fetching materias docente:", err);
              setMisClases([]);
            });
        });
    }
  }, [usuario]); 

  


  useEffect(() => {
    fetch(`${API_URL}/materias-aulavirtual`)
      .then((res) => res.json())
      .then((data) => setMateriasAulaVirtual(data))
      .catch(() => setMateriasAulaVirtual([]));
  }, []);

  useEffect(() => {
    if (cedula !== null) {
      console.log("Cédula del docente (efecto):", cedula);
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

  

  // Filtrar eventos del mes actual
  const getCurrentMonthEvents = () => {
    return appointments.filter((event) => {
      const eventMonth = event.startDate.getMonth();
      const eventYear = event.startDate.getFullYear();
      const currentMonthNum = currentMonth.getMonth();
      const currentYear = currentMonth.getFullYear();

      return eventMonth === currentMonthNum && eventYear === currentYear;
    });
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "urgente":
        return "error";
      case "informacion":
        return "info";
      case "evento":
        return "success";
      case "recordatorio":
        return "warning";
      case "mantenimiento":
        return "secondary";
      case "resultados":
        return "primary";
      default:
        return "default";
    }
  }; 

  useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          // Obtener eventos del dashboard (para admin, usar role 1)
          const eventsResponse = await fetch(`${backendUrl}/dashboard/events?userId=1&role=1`);
          if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json();
            setDashboardEvents(eventsData);
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };
  
      fetchDashboardData();
    }, []);


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          
          {/* Cronograma */}
                      <Grid item xs={12} lg={8}>
                        <MDBox mb={3}>
                          <Cronograma 
                            events={dashboardEvents}
                            onEventClick={(event) => console.log('Evento seleccionado:', event)}
                          />
                        </MDBox>
                      </Grid>
          

          {/* Comunicados */}
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
              // Filtrar clases duplicadas por id
              Array.from(new Map(misClases.map(clase => [clase.idMateria, clase])).values()).map((clase, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={clase.idMateria}>
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
                    onClick={() => {
                      console.log("Materia seleccionada:", clase);
                      setSelectedSubject(clase);
                      setSideMenuOpen(true);
                      navigate(`/aula-virtual/${clase.idMateria}`);
                    }}
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
                            Cargo: DOCENTE
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

      
      <SubjectSideMenu
        open={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
        subject={selectedSubject}
        userType="docente"
        onOptionClick={(optionKey) => {
          // Aquí puedes manejar la navegación o acciones según la opción seleccionada
          // Por ejemplo: navegar a una ruta, abrir un modal, etc.
          console.log("Opción seleccionada:", optionKey);
        }}
      />
    </DashboardLayout>
  );
}

export default DashboardTeachers;
