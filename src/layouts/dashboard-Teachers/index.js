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
} from "@mui/icons-material";
import { format } from "date-fns";
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
import informatica from "assets/images/informatica.png";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

function DashboardStudents() {
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

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3003/api";

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
              // Filtrar solo las materias donde alguna sección tiene idDocente igual a la cédula
              const materiasDocente = data.filter(m => m.secciones.some(s => s.idDocente === docenteCedula));
              setMisClases(materiasDocente.map(m => ({
                idMateria: m.idMateria,
                categoria: m.categoria,
                carrera: m.carrera
              })));
            })
            .catch(() => setMisClases([]));
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
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6">
                      {format(currentMonth, "MMMM yyyy", { locale: es })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button onClick={handlePreviousMonth} sx={{ minWidth: "auto", p: 1 }}>
                      <ChevronLeftIcon />
                    </Button>
                    <Button onClick={handleNextMonth} sx={{ minWidth: "auto", p: 1 }}>
                      <ChevronRightIcon />
                    </Button>
                  </Box>
                </Box>
                <Paper
                  elevation={1}
                  sx={{
                    maxHeight: 400,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f1f1f1",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#c1c1c1",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "#a8a8a8",
                      },
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#a8a8a8",
                    },
                  }}
                >
                  <List>
                    {getCurrentMonthEvents().map((event, index) => (
                      <Box key={event.id}>
                        <ListItem
                          button
                          onClick={() => handleEventClick(event)}
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                          }}
                        >
                          <ListItemIcon sx={{ color: getEventColor(event.type) }}>
                            {getEventIcon(event.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={event.title}
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {format(event.startDate, "dd/MM/yyyy HH:mm", { locale: es })} -{" "}
                                  {format(event.endDate, "HH:mm", { locale: es })}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  {event.description.substring(0, 80)}...
                                </Typography>
                              </Box>
                            }
                          />
                          <Chip
                            label={event.type}
                            size="small"
                            sx={{
                              backgroundColor: getEventColor(event.type),
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        </ListItem>
                        {index < getCurrentMonthEvents().length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                </Paper>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <MDBox mb={3}>
              <MDTypography variant="h6" fontWeight="medium">
                Comunicados
              </MDTypography>
            </MDBox>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    maxHeight: 400,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f1f1f1",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#c1c1c1",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "#a8a8a8",
                      },
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      backgroundColor: "#a8a8a8",
                    },
                  }}
                >
                  {currentComunicados.map((comunicado) => (
                    <Box
                      key={comunicado.id}
                      sx={{ mb: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          {comunicado.titulo}
                        </Typography>
                        <Chip
                          label={comunicado.tipo}
                          size="small"
                          color={getTipoColor(comunicado.tipo)}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {comunicado.descripcion}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(comunicado.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
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
              {misClases.length === 0 ? (
                <Grid item xs={12}>
                  <MDTypography variant="body2" color="text.secondary">
                    No tienes materias asignadas.
                  </MDTypography>
                </Grid>
              ) : (
                // Filtrar clases duplicadas por id
                Array.from(new Map(misClases.map(clase => [clase.idMateria, clase])).values()).map((clase, index) => (
                  <Grid item xs={12} sm={6} md={4} key={clase.idMateria}>
                    <div
                      style={{ cursor: "pointer", height: "100%" }}
                      onClick={() => {
                        setSelectedSubject(clase);
                        setSideMenuOpen(true);
                        navigate(`/aula-virtual/${clase.idMateria}`);
                      }}
                    >
                      <DefaultProjectCard
                        image={informatica}
                        label={clase.categoria || "Materia"}
                        title={clase.carrera || "Sin carrera"}
                        description={`Cargo: DOCENTE`}
                        action={{
                          type: "internal",
                          route: `/aula-virtual/${clase.idMateria}`,
                          color: "info",
                          label: "Ver Sección",
                        }}
                        authors={[]}
                        style={{ height: "100%" }}
                      />
                    </div>
                  </Grid>
                ))
              )}
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox> {/* <- Este es el cierre correcto del bloque principal */}

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

export default DashboardStudents;
