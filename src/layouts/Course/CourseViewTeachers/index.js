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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
import { useAuth } from "context/AuthContext";

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
import CourseViewAsistencias from "./CourseViewAsistencias";

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
  const { id, idMateria } = useParams();
  const materiaId = id || idMateria;
  const location = useLocation();
  const navigate = useNavigate();
  
  // Eliminamos el array menuOptions fijo para que use la detección automática
  const [tabValue, setTabValue] = useState(0);
  
  const handleMenuOptionClick = (key) => {
    // Mapeo de keys a tabs para mantener la funcionalidad
    const keyToTabMap = {
      "informacion": 0,
      "anuncios": 1,
      "cronograma": 2,
      "participantes": 3,
      "recursos": 4,
      "control_entrega": 5,
      "asistencia": 6
    };
    
    const tab = keyToTabMap[key];
    if (tab !== undefined) {
      setTabValue(tab);
    }
  };
  
  // Función para obtener la key seleccionada basada en el tab
  const getSelectedMenuKey = () => {
    const tabToKeyMap = {
      0: "informacion",
      1: "anuncios", 
      2: "cronograma",
      3: "participantes",
      4: "recursos",
      5: "control_entrega",
      6: "asistencia"
    };
    return tabToKeyMap[tabValue] || "informacion";
  };

  // Redirección automática al Aula Virtual si la ruta es exactamente /materia/:id
  React.useEffect(() => {
    if (location.pathname === `/materia/${materiaId}`) {
      navigate(`/materia/${materiaId}/info`, { replace: true });
    }
  }, [location.pathname, materiaId, navigate]);

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

  const [materia, setMateria] = React.useState(null);
  const [loadingMateria, setLoadingMateria] = React.useState(true);
  const [errorMateria, setErrorMateria] = React.useState(null);
  const [selectedSeccion, setSelectedSeccion] = useState(null);
  const [participantes, setParticipantes] = useState({ docente: null, estudiantes: [] });
  const [loadingParticipantes, setLoadingParticipantes] = useState(false);
  const [errorParticipantes, setErrorParticipantes] = useState(null);
  const { user } = useAuth();
  const [estudiantesPorDocente, setEstudiantesPorDocente] = useState([]);
  const [loadingEstudiantesDocente, setLoadingEstudiantesDocente] = useState(false);
  const [errorEstudiantesDocente, setErrorEstudiantesDocente] = useState(null);

  React.useEffect(() => {
    async function fetchMateria() {
      setLoadingMateria(true);
      setErrorMateria(null);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "https://proyecto-teg-bakend.onrender.com/api"}/materias-aulavirtual/${materiaId}`);
        if (!res.ok) throw new Error("No se pudo obtener la materia. Verifica la conexión con el backend.");
        const data = await res.json();
        setMateria(data);
      } catch (err) {
        setErrorMateria(err.message + ' (¿Está el backend corriendo y la URL es correcta?)');
      } finally {
        setLoadingMateria(false);
      }
    }
    if (materiaId) fetchMateria();
  }, [materiaId]);

  // Cuando cambia la materia o la sección seleccionada, actualizar la sección seleccionada por defecto
  React.useEffect(() => {
    if (materia && materia.Secciones && materia.Secciones.length > 0) {
      setSelectedSeccion(materia.Secciones[0].idSeccion);
    }
  }, [materia]);

  // Fetch participantes cuando cambia la sección seleccionada o la pestaña de participantes
  React.useEffect(() => {
    if (getSelectedMenuKey() === "participantes" && selectedSeccion) {
      setLoadingParticipantes(true);
      setErrorParticipantes(null);
              fetch(`${process.env.REACT_APP_API_URL || "https://proyecto-teg-bakend.onrender.com/api"}/secciones/${selectedSeccion}/participantes`)
        .then(res => {
          if (!res.ok) throw new Error("No se pudo obtener los participantes. Verifica la conexión con el backend.");
          return res.json();
        })
        .then(data => setParticipantes(data))
        .catch(err => setErrorParticipantes(err.message + ' (¿Está el backend corriendo y la URL es correcta?)'))
        .finally(() => setLoadingParticipantes(false));
    }
  }, [getSelectedMenuKey(), selectedSeccion]);

  // Fetch estudiantes por docente cuando se selecciona la pestaña de participantes
  React.useEffect(() => {
    if (getSelectedMenuKey() === "participantes" && user && user.cedula) {
      setLoadingEstudiantesDocente(true);
      setErrorEstudiantesDocente(null);
              fetch(`${process.env.REACT_APP_API_URL || "https://proyecto-teg-bakend.onrender.com/api"}/estudiantes-por-docente/${user.cedula}`)
        .then(res => {
          if (!res.ok) throw new Error("No se pudo obtener los estudiantes por docente.");
          return res.json();
        })
        .then(data => setEstudiantesPorDocente(data))
        .catch(err => setErrorEstudiantesDocente(err.message))
        .finally(() => setLoadingEstudiantesDocente(false));
    }
  }, [getSelectedMenuKey(), user]);

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
            subject={
              materia
                ? {
                    nombre: materia.categoria,
                    descripcion: materia.carrera ? materia.carrera : `ID: ${materia.idMateria}`,
                  }
                : { nombre: `Materia #${materiaId}`, descripcion: "" }
            }
            userType="docente"
            onOptionClick={handleMenuOptionClick}
            selectedKey={getSelectedMenuKey()}
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
                  {getSelectedMenuKey() === "informacion" && <CourseViewInfo />}
                  {getSelectedMenuKey() === "anuncios" && (
                    <CourseViewAnuncios
                      titleProposals={titleProposals}
                      handleTitleProposalChange={handleTitleProposalChange}
                      handleOpenTitleModal={handleOpenTitleModal}
                      openTitleModal={openTitleModal}
                      handleCloseTitleModal={handleCloseTitleModal}
                      handleSubmitTitleProposals={handleSubmitTitleProposals}
                    />
                  )}
                  {getSelectedMenuKey() === "cronograma" && (
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
                  {getSelectedMenuKey() === "participantes" && materia && materia.Secciones && materia.Secciones.length > 1 && (
                    <Box mb={2}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="seccion-label">Sección</InputLabel>
                        <Select
                          labelId="seccion-label"
                          value={selectedSeccion || ''}
                          label="Sección"
                          onChange={e => setSelectedSeccion(e.target.value)}
                        >
                          {materia.Secciones.map(sec => (
                            <MenuItem key={sec.idSeccion} value={sec.idSeccion}>
                              {sec.seccion_letra ? `Sección ${sec.seccion_letra}` : `Sección ${sec.idSeccion}`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                  {getSelectedMenuKey() === "participantes" && (
                    loadingParticipantes ? <MDTypography>Cargando participantes...</MDTypography> :
                    errorParticipantes ? <MDTypography color="error">{errorParticipantes}</MDTypography> :
                    <>
                      <ParticipantesList
                        teachers={participantes.docente ? [participantes.docente] : []}
                        students={participantes.estudiantes || []}
                      />
                      {/* Mostrar estudiantes por docente debajo de la lista por sección */}
                      {user && user.cedula && (
                        loadingEstudiantesDocente ? <MDTypography>Cargando estudiantes por docente...</MDTypography> :
                        errorEstudiantesDocente ? <MDTypography color="error">{errorEstudiantesDocente}</MDTypography> :
                        estudiantesPorDocente.length > 0 && (
                          <Box mt={4}>
                            <MDTypography variant="h6" color="primary" mb={2}>Todos los estudiantes inscritos en tus clases</MDTypography>
                            <ParticipantesList
                              teachers={[]}
                              students={estudiantesPorDocente.map(e => ({
                                name: e.estudiante.nombre,
                                id: e.estudiante.cedula,
                                email: e.estudiante.email
                              }))}
                            />
                          </Box>
                        )
                      )}
                    </>
                  )}
                  {getSelectedMenuKey() === "recursos" && (
                    <RecursosList resources={resources} onAddResource={handleAddResource} />
                  )}
                  {getSelectedMenuKey() === "control_entrega" && (
                    <EstadisticasEntregas 
                      estadisticas={estadisticasEntregas} 
                      totalEstudiantes={students.length}
                    />
                  )}
                  {getSelectedMenuKey() === "asistencia" && (
                    <CourseViewAsistencias students={students} materia={materia} />
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
