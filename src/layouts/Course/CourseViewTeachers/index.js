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
import Checkbox from "@mui/material/Checkbox";

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
import AnnouncementIcon from "@mui/icons-material/Announcement";
import EventNoteIcon from "@mui/icons-material/EventNote";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import SubjectSideMenu from "components/SubjectSideMenu";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

// Data
import coursesTableData from "layouts/Course/data/coursesTableData";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CourseViewAnuncios from "./CourseViewAnuncios";
import CourseViewCronogramas from "./CourseViewCronogramas";
import CourseViewEntregas from "./CourseViewEntregas";
import CourseViewInfo from "./CourseViewInfo";
import ParticipantesList from "./ParticipantesList";
import RecursosList from "./RecursosList";
import EstadisticasEntregas from "./EstadisticasEntregas";

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
  const location = useLocation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const menuOptions = [
    {
      key: "info",
      text: "Información ",
      icon: <InfoIcon />,
      tab: 0,
    },
    {
      key: "anuncios",
      text: "Crear anuncios",
      icon: <AnnouncementIcon />,
      tab: 1,
    },
    {
      key: "cronogramas",
      text: "Cronogramas",
      icon: <EventNoteIcon />,
      tab: 2,
    },
    // Eliminar la opción de entregas
    // {
    //   key: "entregas",
    //   text: "Subir y ver cronograma de entregas",
    //   icon: <AssignmentIcon />,
    //   tab: 3,
    // },
    {
      key: "participantes",
      text: "Participantes",
      icon: <PeopleIcon />,
      tab: 3,
    },
    {
      key: "recursos",
      text: "Recursos",
      icon: <FolderIcon />,
      tab: 4,
    },
    {
      key: "estadisticas",
      text: "Control Entregas",
      icon: <EventIcon />,
      tab: 5,
    },
  ];
  const handleMenuOptionClick = (key) => {
    const found = menuOptions.find((opt) => opt.key === key);
    if (found) setTabValue(found.tab);
  };
  const selectedMenuKey = menuOptions.find((opt) => opt.tab === tabValue)?.key;

  // Redirección automática al Aula Virtual si la ruta es exactamente /materia/:id
  React.useEffect(() => {
    if (location.pathname === `/materia/${id}`) {
      navigate(`/materia/${id}/info`, { replace: true });
    }
  }, [location.pathname, id, navigate]);

  // Estados y funciones para los subcomponentes
  // Anuncios
  const [openTitleModal, setOpenTitleModal] = useState(false);
  const [titleProposals, setTitleProposals] = useState(["", "", ""]);
  const handleTitleProposalChange = (index, value) => {
    const newProposals = [...titleProposals];
    newProposals[index] = value;
    setTitleProposals(newProposals);
  };
  const handleOpenTitleModal = () => setOpenTitleModal(true);
  const handleCloseTitleModal = () => setOpenTitleModal(false);
  const handleSubmitTitleProposals = () => {
    if (titleProposals.some((proposal) => proposal.trim() !== "")) {
      setOpenTitleModal(false);
    }
  };

  // Cronogramas
  const [classes, setClasses] = useState([]);
  const [newClassDate, setNewClassDate] = useState("");
  const [newClassTime, setNewClassTime] = useState("");
  const [newClassDescription, setNewClassDescription] = useState("");
  const handleAddClass = () => {
    if (newClassDate && newClassTime && newClassDescription) {
      const newClass = {
        id: Date.now(),
        date: newClassDate,
        time: newClassTime,
        description: newClassDescription,
      };
      setClasses([...classes, newClass]);
      setNewClassDate("");
      setNewClassTime("");
      setNewClassDescription("");
    }
  };
  const handleEditClass = (classToEdit) => {};
  const handleDeleteClass = (classId) => {
    setClasses(classes.filter((cls) => cls.id !== classId));
  };

  // Entregas
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const handleOpenUploadModal = (type) => {
    setCurrentUploadType(type);
    setOpenUploadModal(true);
  };
  const handleCloseUploadModal = () => {
    setOpenUploadModal(false);
    setUploadFile(null);
    setUploadFileName("");
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
      setOpenUploadModal(false);
    }
  };

  // Datos de ejemplo para los nuevos componentes (idénticos a CourseViewInfo)
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
  const estadisticasEntregas = [
    { label: "Entrega de Título", value: 85 },
    { label: "Entrega de Borrador 1", value: 72 },
    { label: "Entrega de Borrador 2", value: 68 },
    { label: "Entrega de Borrador 3", value: 45 },
    { label: "Entrega de Borrador Final", value: 32 },
  ];

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
            userType="docente"
            onOptionClick={handleMenuOptionClick}
            selectedKey={selectedMenuKey}
            options={menuOptions}
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
                <Card
                  sx={{ boxShadow: 'none', border: 'none', background: 'transparent' }}
                >
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
                      BIENVENIDOS
                    </MDTypography>
                  </MDBox>
                  {selectedMenuKey === "info" && <CourseViewInfo />}
                  {selectedMenuKey === "anuncios" && (
                    <CourseViewAnuncios
                      titleProposals={titleProposals}
                      handleTitleProposalChange={handleTitleProposalChange}
                      handleOpenTitleModal={handleOpenTitleModal}
                      openTitleModal={openTitleModal}
                      handleCloseTitleModal={handleCloseTitleModal}
                      handleSubmitTitleProposals={handleSubmitTitleProposals}
                    />
                  )}
                  {selectedMenuKey === "cronogramas" && (
                    <CourseViewCronogramas
                      newClassDate={newClassDate}
                      setNewClassDate={setNewClassDate}
                      newClassTime={newClassTime}
                      setNewClassTime={setNewClassTime}
                      newClassDescription={newClassDescription}
                      setNewClassDescription={setNewClassDescription}
                      handleAddClass={handleAddClass}
                      classes={classes}
                      handleEditClass={handleEditClass}
                      handleDeleteClass={handleDeleteClass}
                      // Props para entregas
                      currentUploadType={currentUploadType}
                      handleOpenUploadModal={handleOpenUploadModal}
                      uploadFileName={uploadFileName}
                      setUploadFileName={setUploadFileName}
                      handleOpenUploadModalButton={() => handleOpenUploadModal(currentUploadType)}
                      openUploadModal={openUploadModal}
                      handleCloseUploadModal={handleCloseUploadModal}
                      handleFileUpload={handleFileUpload}
                      handleSubmitUpload={handleSubmitUpload}
                      uploadFile={uploadFile}
                    />
                  )}
                  {selectedMenuKey === "participantes" && (
                    <ParticipantesList teachers={teachers} students={students} />
                  )}
                  {selectedMenuKey === "recursos" && (
                    <RecursosList resources={resources} onAddResource={handleAddResource} />
                  )}
                  {selectedMenuKey === "estadisticas" && (
                    <EstadisticasEntregas estadisticas={estadisticasEntregas} />
                  )}
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </Box>
      </Box>
    </DashboardLayout>
  );
}

export default CourseView;
