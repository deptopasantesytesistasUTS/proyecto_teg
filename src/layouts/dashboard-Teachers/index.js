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
  Alert,
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

// Images
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

// DatePicker
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function DashboardStudents() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const { user: usuario } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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

  const API_URL = process.env.REACT_APP_API_URL || "https://proyecto-teg-bakend.onrender.com/api";

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

  // Datos de eventos/actividades del calendario
  const appointments = [
    // Diciembre 2024
    {
      id: 1,
      title: "Entrega de Proyecto TEG",
      startDate: new Date(2024, 11, 15, 10, 0),
      endDate: new Date(2024, 11, 15, 12, 0),
      description:
        "Entrega final del Trabajo Especial de Grado. Debe incluir documentación completa y presentación.",
      type: "assignment",
    },
    {
      id: 2,
      title: "Examen de Investigación II",
      startDate: new Date(2024, 11, 18, 14, 0),
      endDate: new Date(2024, 11, 18, 16, 0),
      description:
        "Examen parcial de la materia Investigación II. Temas: Metodología de investigación y análisis de datos.",
      type: "exam",
    },
    {
      id: 3,
      title: "Reunión de Tutoria",
      startDate: new Date(2024, 11, 20, 9, 0),
      endDate: new Date(2024, 11, 20, 10, 0),
      description: "Reunión con el tutor para revisar avances del proyecto de investigación.",
      type: "meeting",
    },
    {
      id: 4,
      title: "Presentación de Avances",
      startDate: new Date(2024, 11, 22, 15, 0),
      endDate: new Date(2024, 11, 22, 17, 0),
      description: "Presentación de avances del proyecto ante el comité evaluador.",
      type: "presentation",
    },
    // Enero 2025
    {
      id: 5,
      title: "Inicio de Clases",
      startDate: new Date(2025, 0, 6, 8, 0),
      endDate: new Date(2025, 0, 6, 12, 0),
      description: "Inicio del nuevo semestre académico. Presentación de horarios y materias.",
      type: "event",
    },
    {
      id: 6,
      title: "Entrega de Anteproyecto",
      startDate: new Date(2025, 0, 15, 14, 0),
      endDate: new Date(2025, 0, 15, 16, 0),
      description: "Entrega del anteproyecto de investigación para evaluación inicial.",
      type: "assignment",
    },
    {
      id: 7,
      title: "Examen de Metodología",
      startDate: new Date(2025, 0, 22, 10, 0),
      endDate: new Date(2025, 0, 22, 12, 0),
      description: "Examen de la materia Metodología de la Investigación.",
      type: "exam",
    },
    // Febrero 2025
    {
      id: 8,
      title: "Defensa de Anteproyecto",
      startDate: new Date(2025, 1, 5, 9, 0),
      endDate: new Date(2025, 1, 5, 11, 0),
      description: "Defensa oral del anteproyecto ante el comité evaluador.",
      type: "presentation",
    },
    {
      id: 9,
      title: "Reunión de Coordinación",
      startDate: new Date(2025, 1, 12, 15, 0),
      endDate: new Date(2025, 1, 12, 16, 0),
      description: "Reunión de coordinación con el tutor para planificar actividades del semestre.",
      type: "meeting",
    },
    {
      id: 10,
      title: "Entrega de Avances",
      startDate: new Date(2025, 1, 25, 13, 0),
      endDate: new Date(2025, 1, 25, 15, 0),
      description: "Entrega de avances del proyecto de investigación.",
      type: "assignment",
    },
    // Marzo 2025
    {
      id: 11,
      title: "Presentación de Resultados",
      startDate: new Date(2025, 2, 8, 14, 0),
      endDate: new Date(2025, 2, 8, 16, 0),
      description: "Presentación de resultados preliminares de la investigación.",
      type: "presentation",
    },
    {
      id: 12,
      title: "Examen Final",
      startDate: new Date(2025, 2, 20, 10, 0),
      endDate: new Date(2025, 2, 20, 12, 0),
      description: "Examen final de la materia Investigación II.",
      type: "exam",
    },
    // Julio 2025
    {
      id: 13,
      title: "Presentación de Resultados",
      startDate: new Date(2025, 6, 1, 14, 0),
      endDate: new Date(2025, 6, 1, 16, 0),
      description: "Presentación de resultados preliminares de la investigación.",
      type: "presentation",
    },
    {
      id: 14,
      title: "Examen Final",
      startDate: new Date(2025, 6, 2, 10, 0),
      endDate: new Date(2025, 6, 2, 12, 0),
      description: "Examen final de la materia Investigación II.",
      type: "exam",
    },
    {
      id: 15,
      title: "Presentación de Resultados",
      startDate: new Date(2025, 6, 8, 14, 0),
      endDate: new Date(2025, 6, 8, 16, 0),
      description: "Presentación de resultados preliminares de la investigación.",
      type: "presentation",
    },
    {
      id: 16,
      title: "Examen Final",
      startDate: new Date(2025, 6, 20, 10, 0),
      endDate: new Date(2025, 6, 20, 12, 0),
      description: "Examen final de la materia Investigación II.",
      type: "exam",
    },
  ];

  // Datos de comunicados
  const comunicados = [
    {
      id: 1,
      titulo: "Suspensión de Clases",
      descripcion:
        "Se informa que las clases del día 20 de diciembre serán suspendidas por mantenimiento de la infraestructura.",
      fecha: "2024-12-10 08:30",
      tipo: "urgente",
    },
    {
      id: 2,
      titulo: "Cambio de Horario",
      descripcion:
        "El horario de la materia Investigación II cambiará a los martes de 14:00 a 16:00 a partir del próximo mes.",
      fecha: "2024-12-09 10:15",
      tipo: "informacion",
    },
    {
      id: 3,
      titulo: "Convocatoria a Evento",
      descripcion:
        "Se invita a todos los estudiantes a participar en el evento de presentación de proyectos tecnológicos.",
      fecha: "2024-12-08 16:45",
      tipo: "evento",
    },
    {
      id: 4,
      titulo: "Recordatorio de Entrega",
      descripcion:
        "Recordatorio: La entrega del proyecto final debe realizarse antes del 15 de diciembre.",
      fecha: "2024-12-07 12:20",
      tipo: "recordatorio",
    },
    {
      id: 5,
      titulo: "Nuevo Laboratorio",
      descripcion:
        "Se ha inaugurado el nuevo laboratorio de computación con equipos de última generación.",
      fecha: "2024-12-06 09:30",
      tipo: "informacion",
    },
    {
      id: 6,
      titulo: "Horario de Consulta",
      descripcion:
        "Los profesores estarán disponibles para consultas los viernes de 10:00 a 12:00.",
      fecha: "2024-12-05 14:00",
      tipo: "informacion",
    },
    {
      id: 7,
      titulo: "Mantenimiento del Sistema",
      descripcion:
        "El sistema de gestión académica estará en mantenimiento el próximo sábado de 8:00 a 12:00.",
      fecha: "2024-12-04 11:15",
      tipo: "mantenimiento",
    },
    {
      id: 8,
      titulo: "Resultados de Evaluación",
      descripcion:
        "Los resultados de la evaluación parcial ya están disponibles en el portal estudiantil.",
      fecha: "2024-12-03 13:45",
      tipo: "resultados",
    },
  ];

  // Calcular comunicados para la página actual
  const itemsPerPage = 4;
  const totalPages = Math.ceil(comunicados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComunicados = comunicados.slice(startIndex, endIndex);

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

  const handleDateClick = (event) => {
    // setDatePickerAnchor(event.currentTarget); // Removed
    // setShowDatePicker(true); // Removed
  };

  const handleDateClose = () => {
    // setShowDatePicker(false); // Removed
    // setDatePickerAnchor(null); // Removed
  };

  const handleDateChange = (event) => {
    // setSelectedDate(new Date(event.target.value)); // Removed
  };

  // Función para generar el calendario mensual
  const generateCalendarDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Agregar días del mes anterior para completar la primera semana
    const firstDayOfWeek = start.getDay();
    const daysFromPrevMonth = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(start);
      prevDate.setDate(start.getDate() - i - 1);
      daysFromPrevMonth.push(prevDate);
    }
    
    // Agregar días del mes siguiente para completar la última semana
    const lastDayOfWeek = end.getDay();
    const daysFromNextMonth = [];
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + i);
      daysFromNextMonth.push(nextDate);
    }
    
    return [...daysFromPrevMonth, ...days, ...daysFromNextMonth];
  };

  // Función para obtener eventos de un día específico
  const getEventsForDay = (date) => {
    return appointments.filter(event => isSameDay(event.startDate, date));
  };

  // Función para obtener el color de fondo de un día
  const getDayBackgroundColor = (date) => {
    const events = getEventsForDay(date);
    if (events.length > 0) {
      return events[0].type === "assignment" ? "#fff3e0" :
             events[0].type === "exam" ? "#ffebee" :
             events[0].type === "meeting" ? "#e3f2fd" :
             events[0].type === "presentation" ? "#e8f5e8" : "#f3e5f5";
    }
    return isToday(date) ? "#e8f5e8" : "transparent";
  };

  // Función para filtrar eventos por tipo
  const getFilteredEvents = () => {
    if (filterType === "all") {
      return getCurrentMonthEvents();
    }
    return getCurrentMonthEvents().filter(event => event.type === filterType);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      {/* Mobile Menu Button */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="menu"
          onClick={() => setMobileMenuOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            display: { md: 'none' }
          }}
        >
          <MenuIcon />
        </Fab>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#fff',
            color: theme.palette.mode === 'dark' ? '#fff' : '#000'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <MDTypography variant="h6">Menú</MDTypography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <MDTypography variant="body2" color="text.secondary" mb={2}>
            Filtros de Eventos
          </MDTypography>
          <Stack spacing={1}>
            {[
              { label: "Todos", value: "all", color: "default" },
              { label: "Tareas", value: "assignment", color: "primary" },
              { label: "Exámenes", value: "exam", color: "error" },
              { label: "Reuniones", value: "meeting", color: "info" },
              { label: "Presentaciones", value: "presentation", color: "success" }
            ].map((filter) => (
              <Chip
                key={filter.value}
                label={filter.label}
                color={filter.color}
                variant={filterType === filter.value ? "filled" : "outlined"}
                onClick={() => setFilterType(filter.value)}
                sx={{ width: '100%', justifyContent: 'flex-start' }}
              />
            ))}
          </Stack>
        </Box>
      </Drawer>

      <MDBox pt={6} pb={3}>
        <Container maxWidth="xl">
          <Grid container spacing={isMobile ? 2 : 6}>
          {/* Calendario Visual - Lado izquierdo */}
          <Grid item xs={12} lg={6}>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium">
                Vista de Calendario
              </MDTypography>
            </MDBox>
            
            {/* Calendario Visual */}
            <Card 
              sx={{ 
                mb: 3,
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.card : '#fff',
                color: theme.palette.mode === 'dark' ? theme.palette.text.main : 'inherit'
              }}
            >
              <CardContent>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2,
                    color: theme.palette.mode === 'dark' ? theme.palette.text.main : 'inherit'
                  }}
                >
                  Calendario del Mes
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
                  {/* Días de la semana */}
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <Box
                      key={day}
                      sx={{
                        p: 1,
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                        color: theme.palette.mode === 'dark' ? theme.palette.text.main : "text.secondary",
                      }}
                    >
                      {day}
                    </Box>
                  ))}
                  
                  {/* Días del mes */}
                  {(() => {
                    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                    const days = [];
                    
                    // Agregar días del mes anterior para completar la primera semana
                    const firstDayOfWeek = start.getDay();
                    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                      const prevDate = new Date(start);
                      prevDate.setDate(start.getDate() - i - 1);
                      days.push({ date: prevDate, isCurrentMonth: false });
                    }
                    
                    // Agregar días del mes actual
                    for (let i = 1; i <= end.getDate(); i++) {
                      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
                      days.push({ date: currentDate, isCurrentMonth: true });
                    }
                    
                    // Agregar días del mes siguiente para completar la última semana
                    const lastDayOfWeek = end.getDay();
                    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
                      const nextDate = new Date(end);
                      nextDate.setDate(end.getDate() + i);
                      days.push({ date: nextDate, isCurrentMonth: false });
                    }
                    
                    return days.map((dayInfo, index) => {
                      const events = getEventsForDay(dayInfo.date);
                      const isToday = dayInfo.date.toDateString() === new Date().toDateString();
                      
                      return (
                        <Box
                          key={index}
                          sx={{
                            p: 1,
                            textAlign: "center",
                            borderRadius: 1,
                            cursor: events.length > 0 ? "pointer" : "default",
                            backgroundColor: events.length > 0 ? `${getEventColor(events[0].type)}20` : "transparent",
                            border: isToday ? "2px solid #1976d2" : "1px solid transparent",
                            opacity: dayInfo.isCurrentMonth ? 1 : 0.5,
                            fontSize: "0.875rem",
                            minHeight: "40px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            "&:hover": events.length > 0 ? {
                              backgroundColor: `${getEventColor(events[0].type)}30`,
                            } : {},
                          }}
                          onClick={() => {
                            if (events.length > 0) {
                              handleEventClick(events[0]);
                            }
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: isToday ? "bold" : "normal",
                              color: isToday ? "#1976d2" : "text.primary",
                            }}
                          >
                            {dayInfo.date.getDate()}
                          </Typography>
                          {events.length > 0 && (
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor: getEventColor(events[0].type),
                                mt: 0.5,
                              }}
                            />
                          )}
                        </Box>
                      );
                    });
                  })()}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Comunicados - Lado derecho */}
          <Grid item xs={12} lg={6}>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium" color="info">
                📢 Comunicados
              </MDTypography>
            </MDBox>
            
            <Card 
              sx={{ 
                height: '450px',
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
                borderRadius: 3,
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease-in-out'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  pb: 2,
                  borderBottom: '2px solid #e3f2fd'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#1976d2',
                      fontSize: '1.1rem'
                    }}
                  >
                    Últimos Comunicados
                  </Typography>
                  <Chip 
                    label={`${comunicados.length} total`}
                    size="small"
                    color="info"
                    sx={{ ml: 'auto', fontSize: '0.7rem' }}
                  />
                </Box>
                
                <Box sx={{ 
                  maxHeight: '250px', 
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#c1c1c1',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#a8a8a8',
                  },
                }}>
                  <List sx={{ width: '100%', bgcolor: 'transparent', p: 0 }}>
                    {currentComunicados.map((comunicado, index) => (
                      <div key={comunicado.id}>
                        <ListItem 
                          alignItems="flex-start" 
                          sx={{ 
                            px: 0,
                            py: 1.5,
                            borderRadius: 2,
                            mb: 1,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: '#f8f9fa',
                              transform: 'translateX(4px)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 50, mr: 1 }}>
                            <Chip
                              label={comunicado.tipo}
                              color={getTipoColor(comunicado.tipo)}
                              size="small"
                              sx={{ 
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                sx={{ 
                                  fontWeight: 'bold', 
                                  fontSize: '0.95rem',
                                  lineHeight: 1.3,
                                  mb: 0.5,
                                  color: '#2c3e50'
                                }}
                              >
                                {comunicado.titulo}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ 
                                    fontSize: '0.85rem',
                                    lineHeight: 1.4,
                                    display: 'block',
                                    mb: 1,
                                    color: '#5a6c7d'
                                  }}
                                >
                                  {comunicado.descripcion}
                                </Typography>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  gap: 1
                                }}>
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ 
                                      fontSize: '0.75rem',
                                      color: '#7f8c8d',
                                      fontWeight: '500',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5
                                    }}
                                  >
                                    📅 {comunicado.fecha}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < currentComunicados.length - 1 && (
                          <Divider 
                            variant="inset" 
                            component="li" 
                            sx={{ 
                              ml: 6,
                              borderColor: '#e0e0e0',
                              opacity: 0.6
                            }} 
                          />
                        )}
                      </div>
                    ))}
                  </List>
                </Box>
                
                {/* Paginación para comunicados */}
                {totalPages > 1 && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 1,
                    pt: 1,
                    borderTop: '1px solid #e0e0e0'
                  }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(event, value) => setCurrentPage(value)}
                      size="small"
                      color="primary"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          borderRadius: 2,
                          fontWeight: 'bold',
                          '&.Mui-selected': {
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
                          }
                        }
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </Container>
      </MDBox>

      {/* Sección Mis Clases */}
      <MDBox pt={2}>
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
            bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.card : "background.paper",
            color: theme.palette.mode === 'dark' ? theme.palette.text.main : 'inherit',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none'
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
      
      {/* Date Picker Popover */}
      {/* Removed Date Picker Popover */}
    </DashboardLayout>
  );
}

export default DashboardStudents;
