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
  const { id, idMateria } = useParams();
  const materiaId = id || idMateria;
  const [materia, setMateria] = React.useState(null);
  const [loadingMateria, setLoadingMateria] = React.useState(true);
  const [errorMateria, setErrorMateria] = React.useState(null);
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

  React.useEffect(() => {
    async function fetchMateria(materiaId) {
      setLoadingMateria(true);
      setErrorMateria(null);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || "https://proyecto-teg-bakend.onrender.com/api"}/materias-aulavirtual/${materiaId}`);
        if (!res.ok) throw new Error("No se pudo obtener la materia");
        const data = await res.json();
        setMateria(data);
      } catch (err) {
        setErrorMateria(err.message);
      } finally {
        setLoadingMateria(false);
      }
    }
    if (materiaId) fetchMateria(materiaId);
  }, [materiaId]);

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
          {console.log("🔍 CourseViewStudents - userType que se pasa:", "estudiante")}
          {console.log("🔍 CourseViewStudents - materia:", materia)}
          {console.log(
            "🔍 CourseViewStudents - subject que se pasa:",
            materia
              ? {
                  nombre: `${materia.categoria}${
                    materia.Carreras?.nombre ? " - " + materia.Carreras.nombre : ""
                  }`,
                  descripcion: `ID: ${materia.idMateria}`,
                }
              : { nombre: `Materia #${materiaId}`, descripcion: "" }
          )}
          <SubjectSideMenu
            open={true}
            onClose={() => {}}
            subject={
              materia
                ? {
                    nombre: `${materia.categoria}${
                      materia.Carreras?.nombre ? " - " + materia.Carreras.nombre : ""
                    }`,
                    descripcion: `ID: ${materia.idMateria}`,
                  }
                : { nombre: `Materia #${materiaId}`, descripcion: "" }
            }
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
                <Card sx={{ boxShadow: "none", border: "none", background: "transparent" }}>
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
                      {loadingMateria
                        ? "Cargando..."
                        : errorMateria
                        ? "Error al cargar materia"
                        : materia?.categoria
                        ? `${materia.categoria} - ${materia.idMateria}`
                        : "Materia"}
                    </MDTypography>
                    <MDTypography variant="h6" color="white" textAlign="center">
                      {loadingMateria
                        ? ""
                        : errorMateria
                        ? errorMateria
                        : materia?.Carreras?.nombre || ""}
                    </MDTypography>
                  </MDBox>
                  {/* Renderizado condicional */}
                  {selectedMenuKey === "inicio" && (
                    <TabPanel value={tabValue} index={0}>
                      <InicioMateria />
                    </TabPanel>
                  )}
                  {selectedMenuKey === "cronograma" && (
                    <TabPanel value={tabValue} index={1}>
                      <Cronograma />
                    </TabPanel>
                  )}
                  {selectedMenuKey === "recursos" && (
                    <TabPanel value={tabValue} index={2}>
                      <Recursos />
                    </TabPanel>
                  )}
                  {selectedMenuKey === "subir" && (
                    <TabPanel value={tabValue} index={3}>
                      <SubirContenido idMateria={materiaId} />{" "}
                    </TabPanel>
                  )}
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </Box>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}

export default CourseView;
