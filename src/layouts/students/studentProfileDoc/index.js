import * as React from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { getValidStudentId, wasCedulaMapped } from "utils/studentUtils";
import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Chip from "@mui/material/Chip";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SendIcon from "@mui/icons-material/Send";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import { Button, Card, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Overview page components
import Header from "layouts/students/studentProfile/components/Header";
import Header2 from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import ProtocoloGenerator from "../data/generateTitlesPDF";
import ControlTutoriasGenerator from "../data/generateTutoriasPDF";
import BusinessLetterGenerator from "../data/generateBusinessLetter";
import { backendUrl } from "config";

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

function Overview() {
  const { id } = useParams(); // Obtener el ID del estudiante de la URL
  console.log("🔍 StudentProfile - ID del estudiante de la URL:", id);

  // Para pruebas, si el ID no existe en la lista válida, usar la primera cédula válida
  const studentId = id;
  console.log("🔍 StudentProfile - ID del estudiante a buscar:", id);
  console.log("🔍 StudentProfile - ID original solicitado:", id);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const [open3, setOpen3] = React.useState(false);
  const handleOpen3 = () => setOpen3(true);
  const handleClose3 = () => setOpen3(false);
  const [open4, setOpen4] = React.useState(false);
  const handleOpen4 = () => setOpen4(true);
  const handleClose4 = () => setOpen4(false);

  // Communication modal state
  const [openCommunication, setOpenCommunication] = React.useState(false);
  const handleOpenCommunication = () => setOpenCommunication(true);
  const handleCloseCommunication = () => setOpenCommunication(false);
  const [communicationTitle, setCommunicationTitle] = React.useState("");
  const [communicationDescription, setCommunicationDescription] = React.useState("");

  // Tab state
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedTitle, setSelectedTitle] = React.useState("");

  // Project management tab state
  const [projectTabValue, setProjectTabValue] = React.useState(0);

  // Configuration state
  const [accessPage, setAccessPage] = React.useState(true);
  const [accessResults, setAccessResults] = React.useState(true);
  const [accessDeliveries, setAccessDeliveries] = React.useState(false);

  // Student data state
  const [studentData, setStudentData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const [newStudent, setNewStudent] = useState({
    nombre1: "",
    nombre2: "",
    apellido1: "",
    apellido2: "",
    telf: "",
    cedula: "",
    correo:"",
  });

  const handleAssignTitle = async(index) => {
    const response = await fetch(`${backendUrl}/estudiante/assign-Title`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cedula: studentData.estudiante.cedula,
        index: index,
        idMateria
      }),
    });

    const data = await response.json();

    if (response.ok) {
      loadStudentData()
      setSnackbar({
        open: true,
        message: "Cambio en acceso al usuario exitoso",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Fallo en Cambio en acceso al usuario",
        severity: "error",
      });
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProjectTabChange = (event, newValue) => {
    setProjectTabValue(newValue);
  };

  const handleSendCommunication = () => {
    if (communicationTitle.trim() && communicationDescription.trim()) {
      console.log("Enviando comunicado:", {
        title: communicationTitle,
        description: communicationDescription,
        date: new Date().toISOString().split("T")[0],
      });
      // Aquí se enviaría el comunicado al backend
      setCommunicationTitle("");
      setCommunicationDescription("");
      handleCloseCommunication();
    }
  };

  // Nuevos estados para manejar jurados
  const [jurados, setJurados] = React.useState([]);
  const [availableJudges, setAvailableJudges] = React.useState([]);
  const [selectedJudges, setSelectedJudges] = React.useState(["", "", ""]);
  const [isAssigningJudges, setIsAssigningJudges] = React.useState(false);

  // Función para cargar los jurados asignados y disponibles
  const loadJudgesData = async () => {
    try {
      // Importar la URL del backend
      const { backendUrl } = await import("config");

      const response = await fetch(`${backendUrl}/profesoresUnidades`);
      if (response.ok) {
        const data = await response.json();
        setAvailableJudges(data.profesores || []);
      } else {
        console.error("Error al cargar datos de jurados");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const loadAssignedJudgesData = async () => {
    try {
      // Importar la URL del backend
      const { backendUrl } = await import("config");
      const url = `${backendUrl}/jurados/${id}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log("API Response Jurados:", data);
        setJurados(data || []);
      } else {
        console.error("Error al cargar datos de jurados");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  // Cargar datos de jurados cuando cambie el ID del estudiante
  React.useEffect(() => {
    if (studentId) {
      loadAssignedJudgesData();
      loadJudgesData();
    }
  }, [studentId]);

  // Manejar cambio en los selects de jurados
  const handleJudgeSelect = (index, value) => {
    const newSelectedJudges = [...selectedJudges];
    newSelectedJudges[index] = value;
    setSelectedJudges(newSelectedJudges);
    console.log(value);
  };

  // Enviar los jurados seleccionados al backend
  const handleAssignJudges = async () => {
    try {
      const { backendUrl } = await import("config");
      const url = `${backendUrl}/admin/asignar-jurados`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          judges: selectedJudges.filter((judge) => judge !== ""),
        }),
      });

      if (response.ok) {
        await loadJudgesData(); // Recargar los datos
        setIsAssigningJudges(false); // Salir del modo edición
        setSelectedJudges(["", "", ""]); // Resetear los selects
        handleAssign;
      } else {
        console.error("Error al asignar jurados");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  // Función para cargar los datos del estudiante
  const loadStudentData = React.useCallback(async () => {
    if (!studentId) {
      setError("No se proporcionó ID de estudiante");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Importar la URL del backend
      const { backendUrl } = await import("config");
      const url = `${backendUrl}/estudiantePerfil/${id}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("🔍 StudentProfile - Datos de todos los estudiantes:", data);
        //originalWord.charAt(0).toUpperCase() + originalWord.slice(1)

        if (data) {
          setStudentData({
            estudiante: {
              cedula: data.estudiante.cedula,
              nombre1:
                data.estudiante.nombre1.charAt(0).toUpperCase() +
                  data.estudiante?.nombre1.slice(1) || " ",
              nombre2:
                data.estudiante.nombre2.charAt(0).toUpperCase() +
                  data.estudiante?.nombre2.slice(1) || " ",
              apellido1:
                data.estudiante.apellido1.charAt(0).toUpperCase() +
                  data.estudiante?.apellido1.slice(1) || " ",
              apellido2:
                data.estudiante.apellido2.charAt(0).toUpperCase() +
                  data.estudiante?.apellido2.slice(1) || "",
              telf: data.estudiante.telf || "",
              Carreras: {
                nombre: data.estudiante.Carreras.nombre || "",
              },
              userId: data.estudiante.Users.userId,
              correo: data.estudiante.Users.correo,
              estado: data.estudiante.Users.status,
            },
            matricula: data.matricula,
          });
          if (data.estudiante.Users.status === "activo") setAccessPage(true);
          else setAccessPage(false);

        } else {
          console.error("🔍 StudentProfile - Estudiante no encontrado con cédula:", studentId);
          if (wasCedulaMapped(id, studentId)) {
            setError(
              `Estudiante con cédula ${id} no encontrado. Mostrando perfil del estudiante ${studentId} como alternativa.`
            );
          } else {
            setError(`Estudiante con cédula ${studentId} no encontrado`);
          }
        }
      } else {
        const errorText = await response.text();
        console.error("🔍 StudentProfile - Error al cargar datos del estudiante:", response.status);
        console.error("🔍 StudentProfile - Respuesta de error:", errorText);
        setError(`No se pudo cargar los datos del estudiante (${response.status})`);
      }
    } catch (error) {
      console.error("🔍 StudentProfile - Error en la petición:", error);
      setError("Error de conexión al cargar los datos del estudiante");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  // Cargar datos del estudiante cuando cambie el ID
  React.useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);


  // Mock data for communications
  const communications = [
    {
      id: 1,
      title: "Recordatorio: Entrega del Primer Borrador",
      content:
        "Se recuerda que la fecha límite para la entrega del primer borrador es el próximo viernes.",
      date: "2024-01-10",
      priority: "high",
    },
    {
      id: 2,
      title: "Reunión con Jueces Asignados",
      content: "Se programará una reunión para discutir el progreso del proyecto.",
      date: "2024-01-08",
      priority: "medium",
    },
    {
      id: 3,
      title: "Actualización del Sistema",
      content: "El sistema ha sido actualizado con nuevas funcionalidades.",
      date: "2024-01-05",
      priority: "low",
    },
  ];

  const [ProfileImageURL, setProfileImageURL] = React.useState("");

  const [ProfileImageJudge1URL, setProfileImageJudge1URL] = React.useState("");

  const [ProfileImageJudge2URL, setProfileImageJudge2URL] = React.useState("");

  const [ProfileImageJudge3URL, setProfileImageJudge3URL] = React.useState("");

  const [enlacesEntregados, setEnlacesEntregados] = useState([]); // { nombreEntrega: enlace }

  const [entregas, setEntregas] = useState([
    { nombre: "1", fechaLimite: "" },
    { nombre: "2", fechaLimite: "" },
    { nombre: "3", fechaLimite: "" },
    { nombre: "4", fechaLimite: "" },
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [categoria, setCategoria] = useState(false);
  const [idMateria, setIdMateria] = useState(0);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleGetCurrentSemester = async () => {
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];
    const response = await fetch(`${backendUrl}/actLapso/${currentDate}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();

      console.log("estudiante:", studentData?.matricula[0]);

      const cat = studentData?.matricula.some((mat) => {
        const categoria = mat?.Secciones?.Materias?.categoria;
        console.log("Materia", mat?.Secciones?.Materias?.idMateria);
        if (categoria !== "Tutorias") setIdMateria(mat?.Secciones?.Materias?.idMateria);
        return categoria === "Trabajo_Especial_de_Grado";
      });

      setCategoria(cat);

      console.log("Categoria:", cat);
      console.log("Categoria:", categoria);
      console.log("Categoria:", categoria);
      console.log("Categoria:", categoria);

      if (!cat) {
        setEntregas([
          { nombre: "Protocolo de Investigación 1", fechaLimite: data.semester.titleDeliveryDate },
          { nombre: "Protocolo de Investigación 2", fechaLimite: data.semester.titleDeliveryDate },
          { nombre: "Protocolo de Investigación 3", fechaLimite: data.semester.titleDeliveryDate },
          { nombre: "Capitulo 1", fechaLimite: data.semester.inv2Borrador1 },
          { nombre: "Carta Empresarial", fechaLimite: data.semester.cartaDate },
          { nombre: "Capitulo 2", fechaLimite: data.semester.inv2Borrador2 },
          { nombre: "Capitulo 3", fechaLimite: data.semester.inv2Borrador3 },
          { nombre: "Instrumentos de Investigaccion", fechaLimite: data.semester.inv2Borrador4 },
        ]);
      } else if (cat) {
        setEntregas([
          { nombre: "Entrega Instrumento 1", fechaLimite: data.semester.fechaEntInst },
          { nombre: "Entrega Instrumento 2", fechaLimite: data.semester.fechaEntInst },
          { nombre: "Entrega de Propuesta", fechaLimite: data.semester.firstDraftDate },
          {
            nombre: "Informe Completo",
            fechaLimite: data.semester.secondDraftDate,
          },
          {
            nombre: "Tomo Completo (Correciones Predefensa)",
            fechaLimite: data.semester.thirdDraftDate,
          },
          { nombre: "Entrega de Diapositivas", fechaLimite: data.semester.finalDraftDate },
        ]);
      }
    }
  };

  const handleGetLinks = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/estudianteAdm/archivos/${studentData.estudiante.cedula}/${idMateria}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();

      console.log("API Response Enlaces:", data);
      console.log(response.ok);
      if (response.ok) {
        setEnlacesEntregados(data);
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Error en la conexion para archivos",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetCurrentSemester();
  }, [studentData]);

  useEffect(() => {
    handleGetLinks();
  }, [idMateria]);

  const formatoFecha = (fechaLimite) => {
    const fecha = new Date(fechaLimite);
    return fecha.toLocaleString("es-VE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    });
  };


  const [validationErrors, setValidationErrors] = useState({
    nombre1: "",
    apellido1: "",
    cedula: "",
    nombre2: "",
    apellido2: "",
  });

  const validateLettersOnly = (value) => {
    const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    return lettersRegex.test(value);
  };

  const validateEmailStructure = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  // Función para validar solo números
  const validateNumbersOnly = (value) => {
    const numbersRegex = /^[0-9]*$/;
    return numbersRegex.test(value);
  };


  return (
    <DashboardLayout>
      <MDBox mb={2} />

      {/* Verificación de estado de carga y error */}
      {loading && (
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <MDTypography variant="h6" color="text">
            Cargando perfil del estudiante...
          </MDTypography>
        </MDBox>
      )}

      {error && (
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <MDTypography variant="h6" color="error">
            Error: {error}
          </MDTypography>
        </MDBox>
      )}

      {!loading && !error && studentData && (
        <>
          <Header studentData={studentData} tabValue={tabValue} onTabChange={handleTabChange}>
            <MDBox mt={5} mb={3}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6} xl={4}>
                  <Card>
                    <MDTypography variant="h5"> Datos de Carrera: </MDTypography>
                    <MDTypography>
                      Materia Actual:{" "}
                      {studentData?.matricula?.map((mat) => {
                        return mat.Secciones.Materias.categoria.replace("_", " ") + " ";
                      })}
                    </MDTypography>
                    <MDTypography>Estado: Cursando</MDTypography>
                    <MDTypography>Acceso al Sistema: {studentData.estudiante.estado}</MDTypography>
                  </Card>
                  <br></br>
                  <Card>
                    <MDTypography variant="h5"> Datos de Contacto: </MDTypography>
                    <MDTypography>Correo: {studentData.estudiante.correo}</MDTypography>
                    <MDTypography>Teléfono: {studentData.estudiante.telf}</MDTypography>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
                  <Grid item size={4}>
                    <Stack mt={2} px={5} spacing={3}>
                     
                    </Stack>
                  </Grid>
                </Grid>
                <Grid item xs={12} xl={4}>
                  {/* TabPanel Content - Only 2 tabs */}

                  <TabPanel value={tabValue} index={0}>
                    <Card>
                      <MDBox p={3}>
                        <MDTypography variant="h5" mb={3}>
                          Comunicados
                        </MDTypography>
                        <List>
                          {communications.map((comm) => (
                            <ListItem key={comm.id} alignItems="flex-start">
                              <ListItemAvatar>
                                <MDAvatar>
                                  <NotificationsIcon />
                                </MDAvatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <MDBox display="flex" alignItems="center" gap={1}>
                                    <MDTypography variant="h6">{comm.title}</MDTypography>
                                    <Chip
                                      label={
                                        comm.priority === "high"
                                          ? "Alta"
                                          : comm.priority === "medium"
                                          ? "Media"
                                          : "Baja"
                                      }
                                      color={
                                        comm.priority === "high"
                                          ? "error"
                                          : comm.priority === "medium"
                                          ? "warning"
                                          : "success"
                                      }
                                      size="small"
                                    />
                                  </MDBox>
                                }
                                secondary={
                                  <MDBox>
                                    <MDTypography variant="body2" color="text">
                                      {comm.content}
                                    </MDTypography>
                                    <MDTypography variant="caption" color="text">
                                      {comm.date}
                                    </MDTypography>
                                  </MDBox>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                        <MDBox mt={3}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SendIcon />}
                            fullWidth
                            onClick={handleOpenCommunication}
                          >
                            Enviar Comunicado
                          </Button>
                        </MDBox>
                      </MDBox>
                    </Card>
                  </TabPanel>
                </Grid>
              </Grid>
            </MDBox>
          </Header>

          {/* Separate Project Management Section */}
          <MDBox mt={6} mb={3}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Card>
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
                    <MDTypography variant="h6" color="white">
                      Gestión del Proyecto de Grado
                    </MDTypography>
                  </MDBox>

                  <MDBox pt={3}>
                    <AppBar position="static" color="default">
                      <Tabs
                        value={projectTabValue}
                        onChange={handleProjectTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                      >
                        <Tab
                          label="Entregas del Proyecto"
                          icon={<PersonIcon />}
                          iconPosition="start"
                        />
                        <Tab
                          label="Jueces Asignados"
                          icon={<DescriptionIcon />}
                          iconPosition="start"
                        />
                      </Tabs>
                    </AppBar>

                    {/* Project Judges Tab - Modificado */}
                    <TabPanel value={projectTabValue} index={1}>
                      <MDBox>
                        <MDBox
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={3}
                        >
                          <MDTypography variant="h5">Jueces Asignados al Proyecto</MDTypography>
                          {jurados.length === 0 && (
                            <></>
                          )}
                        </MDBox>

                        {isAssigningJudges ? (
                          <></>
                        ) : jurados.length > 0 ? (
                          <>
                            <Grid container spacing={3}>
                              {jurados.map((judge, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                  <Card sx={{ p: 3, height: "100%" }}>
                                    <MDBox display="flex" alignItems="center" mb={2}>
                                      <MDAvatar
                                        src={team1}
                                        alt={judge.nombre}
                                        size="lg"
                                        shadow="md"
                                        sx={{ mr: 2 }}
                                      />
                                      <MDBox>
                                        <MDTypography variant="h6" fontWeight="medium">
                                          {judge.nombre}
                                        </MDTypography>
                                        <MDTypography
                                          variant="button"
                                          color="info"
                                          fontWeight="medium"
                                        >
                                          {judge.rol || "Juez"}
                                        </MDTypography>
                                      </MDBox>
                                    </MDBox>
                                    <MDBox>
                                      <MDTypography variant="body2" color="text" mb={1}>
                                        {/*<strong>Especialidad:</strong> {judge.especialidad}*/}
                                      </MDTypography>
                                      <MDTypography variant="body2" color="text" mb={1}>
                                        <strong>Email:</strong> {judge.email}
                                      </MDTypography>
                                      <MDTypography variant="body2" color="text">
                                        <strong>Teléfono:</strong> {judge.telf || "No disponible"}
                                      </MDTypography>
                                    </MDBox>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </>
                        ) : (
                          <Card sx={{ p: 3, textAlign: "center" }}>
                            <MDTypography variant="body1" color="text">
                              No se han asignado jurados para este proyecto.
                            </MDTypography>
                          </Card>
                        )}
                      </MDBox>
                    </TabPanel>

                    <TabPanel value={projectTabValue} index={0}>
                      <MDBox>
                        <MDTypography variant="h5" mb={3}>
                          Entregas del Proyecto
                        </MDTypography>

                        {categoria ? (
                          <></>
                        ) : (
                          <>
                            {/* Title Selection - Modificado para usar datos reales */}
                            {studentData?.matricula[0]?.tituloElegido ? (
                              <MDBox mb={4}>
                                <Card sx={{ p: 3, bgcolor: "success.light" }}>
                                  <MDTypography variant="h6" color="success.dark" mb={1}>
                                    Título ya seleccionado:
                                  </MDTypography>
                                  <MDTypography variant="body1" fontWeight="medium">
                                    {
                                      studentData?.matricula[0]?.[
                                        `titulo${studentData?.matricula[0]?.tituloElegido}`
                                      ]
                                    }
                                  </MDTypography>
                                </Card>
                              </MDBox>
                            ) : (
                              <></>
                            )}
                          </>
                        )}

                        {/* Draft Cards */}
                        <Grid container spacing={3}>
                          {entregas.map((draft, index) => {
                            const objetoEnlace = enlacesEntregados.find(
                              (enlace) => enlace[draft.nombre]
                            );
                            const entregado = objetoEnlace ? objetoEnlace[draft.nombre] : undefined;
                            return (
                              <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{ p: 3, height: "100%", textAlign: "center" }}>
                                  <MDBox>
                                    <MDTypography variant="h6" fontWeight="medium" mb={2}>
                                      {draft.nombre}
                                    </MDTypography>
                                    <MDBox
                                      display="flex"
                                      justifyContent="center"
                                      alignItems="center"
                                      mb={2}
                                    >
                                      <MDBox
                                        width="60px"
                                        height="60px"
                                        borderRadius="50%"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        bgColor={!entregado ? "error" : "success"}
                                        color="white"
                                        fontSize="1.5rem"
                                        fontWeight="bold"
                                      >
                                        {!entregado ? 0 : 100}%
                                      </MDBox>
                                    </MDBox>
                                    <MDTypography variant="body2" color="text" mb={1}>
                                      <strong>
                                        Estado: {!entregado ? "Pendiente" : "Entregado"}
                                      </strong>
                                    </MDTypography>
                                    <MDTypography variant="body2" color="text" mb={2}>
                                      <strong>Fecha Limite:</strong>{" "}
                                      {formatoFecha(draft.fechaLimite)}
                                    </MDTypography>
                                    <Button
                                      variant="contained"
                                      href={entregado}
                                      fullWidth
                                      disabled={!entregado}
                                    >
                                      {!entregado ? "Pendiente" : "Ver Entrega"}
                                    </Button>
                                  </MDBox>
                                </Card>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </MDBox>
                    </TabPanel>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>

          {/* Communication Modal */}
          <Modal
            open={openCommunication}
            onClose={handleCloseCommunication}
            aria-labelledby="communication-modal-title"
            aria-describedby="communication-modal-description"
          >
            <Box sx={style}>
              <Typography id="communication-modal-title" variant="h6" component="h2" mb={3}>
                Enviar Nuevo Comunicado
              </Typography>

              <MDBox display="flex" flexDirection="column" gap={3}>
                <TextField
                  id="communication-title"
                  label="Título del Comunicado"
                  variant="outlined"
                  fullWidth
                  value={communicationTitle}
                  onChange={(e) => setCommunicationTitle(e.target.value)}
                  required
                />

                <TextField
                  id="communication-description"
                  label="Descripción del Comunicado"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={communicationDescription}
                  onChange={(e) => setCommunicationDescription(e.target.value)}
                  required
                />

                <MDBox display="flex" gap={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={handleCloseCommunication}>
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendCommunication}
                    disabled={!communicationTitle.trim() || !communicationDescription.trim()}
                    startIcon={<SendIcon />}
                  >
                    Enviar
                  </Button>
                </MDBox>
              </MDBox>
            </Box>
          </Modal>
        </>
      )}

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
