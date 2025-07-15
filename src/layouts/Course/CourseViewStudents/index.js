import * as React from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";

// @mui icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import FolderIcon from "@mui/icons-material/Folder";
import UploadIcon from "@mui/icons-material/Upload";
import SendIcon from "@mui/icons-material/Send";
import DescriptionIcon from "@mui/icons-material/Description";
import LinkIcon from "@mui/icons-material/Link";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import InfoIcon from "@mui/icons-material/Info";
import EventIcon from "@mui/icons-material/Event";
import GroupsIcon from "@mui/icons-material/Groups";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import coursesTableData from "layouts/Course/data/coursesTableData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import SubjectSideMenu from "components/SubjectSideMenu";
import { useParams } from "react-router-dom";
import Cronograma from './Cronograma';
import DashboardMateria from './DashboardMateria';
import Recursos from './Recursos';
import SubirContenido from './SubirContenido';
import InicioMateria from './InicioMateria';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflow: "auto",
};

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// PropTypes for TabPanel
TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

function CourseView() {
  const { id } = useParams();
  // Elimina menuOptions personalizado y usa el menú por defecto de SubjectSideMenu
  const estudianteTabMap = {
    inicio: 0,
    cronograma: 1,
    recursos: 2,
    subir: 3,
  };
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedMenuKey, setSelectedMenuKey] = React.useState("inicio");
  const handleMenuOptionClick = (key) => {
    setSelectedMenuKey(key);
    setTabValue(estudianteTabMap[key] ?? 0);
  };

  // Modal states
  const [openTitleModal, setOpenTitleModal] = React.useState(false);
  const [openUploadModal, setOpenUploadModal] = React.useState(false);
  const [currentUploadType, setCurrentUploadType] = React.useState("");

  // Form states
  const [titleProposals, setTitleProposals] = React.useState(["", "", ""]);
  const [selectedTitle, setSelectedTitle] = React.useState("");
  const [approvedTitle, setApprovedTitle] = React.useState("");
  const [isTitleApproved, setIsTitleApproved] = React.useState(false);
  const [uploadFile, setUploadFile] = React.useState(null);
  const [uploadFileName, setUploadFileName] = React.useState("");

  // Calendar and communications states
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenTitleModal = () => {
    setOpenTitleModal(true);
  };

  const handleCloseTitleModal = () => {
    setOpenTitleModal(false);
  };

  const handleOpenUploadModal = (type) => {
    setCurrentUploadType(type);
    setOpenUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setOpenUploadModal(false);
    setUploadFile(null);
    setUploadFileName("");
  };

  const handleTitleProposalChange = (index, value) => {
    const newProposals = [...titleProposals];
    newProposals[index] = value;
    setTitleProposals(newProposals);
  };

  const handleSubmitTitleProposals = () => {
    if (titleProposals.some((proposal) => proposal.trim() !== "")) {
      console.log("Propuestas de título enviadas:", titleProposals);
      setSelectedTitle(titleProposals.find((proposal) => proposal.trim() !== "") || "");
      // Simular aprobación del título (en un caso real esto vendría del backend)
      setTimeout(() => {
        setIsTitleApproved(true);
        setApprovedTitle(titleProposals.find((proposal) => proposal.trim() !== "") || "");
      }, 2000);
      handleCloseTitleModal();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadFileName(file.name);
    }
  };

  const handleSubmitUpload = () => {
    if (uploadFile) {
      console.log(`Archivo enviado para ${currentUploadType}:`, uploadFile.name);
      handleCloseUploadModal();
    }
  };

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
  ];

  // Calendar and communications functions
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
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
        return <GroupsIcon />;
      case "presentation":
        return <SlideshowIcon />;
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

  // Calcular comunicados para la página actual
  const itemsPerPage = 4;
  const totalPages = Math.ceil(comunicados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComunicados = comunicados.slice(startIndex, endIndex);

  // Mock data for participants
  const teachers = [
    {
      name: "Dr. María González",
      role: "Profesor Principal",
      email: "maria.gonzalez@universidad.edu",
      phone: "+58 412-123-4567",
    },
    {
      name: "Prof. Carlos Rodríguez",
      role: "Profesor Asistente",
      email: "carlos.rodriguez@universidad.edu",
      phone: "+58 414-987-6543",
    },
  ];

  const students = [
    {
      name: "Dr. María González",
    },
    {
      name: "Prof. Carlos Rodríguez",
    },
    {
      name: "Dr. Ana Martínez",
    },
  ];

  // Mock data for resources
  const resources = [
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
  ];

  // Mock data for draft deadlines
  const draftDeadlines = ["15/01/2024", "20/02/2024", "10/03/2024", "15/04/2024"];

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          background: "#f5f6fa",
          alignItems: "flex-start",
        }}
      >
        {/* Menú lateral fijo */}
        <Box
          sx={{
            width: 300,
            minWidth: 300,
            background: "#1976d2",
            boxShadow: 2,
            borderRadius: 2,
            m: 2,
            height: "calc(105vh - 32px)",
            position: "sticky",
            top: 16,
            zIndex: 10,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
          }}
        >
          <SubjectSideMenu
            open={true}
            onClose={() => {}}
            subject={{ nombre: `Materia #${id}`, descripcion: "Descripción de la materia" }}
            userType="estudiante"
            onOptionClick={handleMenuOptionClick}
            selectedKey={selectedMenuKey}
          />
        </Box>
        {/* Contenido principal */}
        <Box
          sx={{
            flex: 1,
            ml: { xs: 0, md: 2 },
            mt: 2,
            mb: 2,
            mr: 2,
            background: "#f8fafc",
            borderRadius: 2,
            boxShadow: 1,
            p: 3,
            minHeight: "calc(100vh - 32px)",
            overflow: "auto",
          }}
        >
          <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Card sx={{ boxShadow: 'none', border: 'none', background: 'transparent' }}>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={3}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <MDTypography variant="h4" color="white" textAlign="center">
                      Aula Virtual
                    </MDTypography>
                    <MDTypography variant="h6" color="white" textAlign="center">
                      Trabajo Especial de Grado - Informática
                    </MDTypography>
                  </MDBox>
                  {/* Renderizado condicional */}
                  {selectedMenuKey === "inicio" && (
                    <TabPanel value={tabValue} index={0}><InicioMateria /></TabPanel>
                  )}
                  {selectedMenuKey === "cronograma" && (
                    <TabPanel value={tabValue} index={1}><Cronograma /></TabPanel>
                  )}
                  {selectedMenuKey === "recursos" && (
                    <TabPanel value={tabValue} index={2}><Recursos /></TabPanel>
                  )}
                  {selectedMenuKey === "subir" && (
                    <TabPanel value={tabValue} index={3}><SubirContenido /> </TabPanel>
                  )}
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </Box>
      </Box>

      {/* Title Proposal Modal */}
      <Modal
        open={openTitleModal}
        onClose={handleCloseTitleModal}
        aria-labelledby="title-modal-title"
        aria-describedby="title-modal-description"
      >
        <Box sx={style}>
          <Typography id="title-modal-title" variant="h6" component="h2" mb={3}>
            Ingresar Propuestas de Título
          </Typography>

          <MDBox display="flex" flexDirection="column" gap={3}>
            {titleProposals.map((proposal, index) => (
              <TextField
                key={index}
                id={`title-proposal-${index + 1}`}
                label={`Propuesta de Título ${index + 1}`}
                variant="outlined"
                fullWidth
                value={proposal}
                onChange={(e) => handleTitleProposalChange(index, e.target.value)}
                multiline
                rows={2}
              />
            ))}

            <MDBox display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCloseTitleModal}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitTitleProposals}
                disabled={!titleProposals.some((proposal) => proposal.trim() !== "")}
                startIcon={<SendIcon />}
              >
                Enviar Propuestas
              </Button>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>

      {/* File Upload Modal */}
      <Modal
        open={openUploadModal}
        onClose={handleCloseUploadModal}
        aria-labelledby="upload-modal-title"
        aria-describedby="upload-modal-description"
      >
        <Box sx={style}>
          <Typography id="upload-modal-title" variant="h6" component="h2" mb={3}>
            Subir {currentUploadType}
          </Typography>

          <MDBox display="flex" flexDirection="column" gap={3}>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              startAdornment={
                <InputAdornment position="start">
                  <UploadIcon />
                </InputAdornment>
              }
            />

            {uploadFileName && (
              <MDBox>
                <MDTypography variant="body2" color="success.main">
                  Archivo seleccionado: {uploadFileName}
                </MDTypography>
              </MDBox>
            )}

            <MDBox display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCloseUploadModal}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitUpload}
                disabled={!uploadFile}
                startIcon={<SendIcon />}
              >
                Enviar Archivo
              </Button>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>

      {/* Modal para mostrar detalles del evento */}
      <Modal
        open={isEventModalOpen}
        onClose={handleCloseEventModal}
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
                <Button onClick={handleCloseEventModal} variant="contained">
                  Cerrar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <Footer />
    </DashboardLayout>
  );
}

export default CourseView;
