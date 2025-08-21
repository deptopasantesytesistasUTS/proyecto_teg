import * as React from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
import SubjectSideMenu from "components/SubjectSideMenu";
import PhoneInput from "react-phone-number-input";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import "react-phone-number-input/style.css";

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
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import { Button, Card, Stack, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
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

// Overview page components
import Header from "./components/Header";

// Data

// Images
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import informatica from "assets/images/informatica.png";
import { backendUrl } from "config";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
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

function TeacherProfile() {
  const { id } = useParams();
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
  const navigate = useNavigate();

  // Communication modal state
  const [openCommunication, setOpenCommunication] = React.useState(false);
  const handleOpenCommunication = () => setOpenCommunication(true);
  const handleCloseCommunication = () => setOpenCommunication(false);
  const [communicationTitle, setCommunicationTitle] = React.useState("");
  const [communicationDescription, setCommunicationDescription] = React.useState("");

  // Tab state
  const [tabValue, setTabValue] = React.useState(0);

  // Configuration state
  const [accessPage, setAccessPage] = React.useState(true);
  const [accessResults, setAccessResults] = React.useState(true);
  const [accessDeliveries, setAccessDeliveries] = React.useState(false);
  const [misClases, setMisClases] = useState([]);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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

  // Mock data for communications
  const communications = [
    {
      id: 1,
      title: "Recordatorio: Revisión de Proyectos",
      content:
        "Se recuerda que la fecha límite para la revisión de proyectos es el próximo viernes.",
      date: "2024-01-10",
      priority: "high",
    },
    {
      id: 2,
      title: "Reunión de Coordinación",
      content: "Se programará una reunión para discutir el progreso de los proyectos.",
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

  const [teacherData, setTeacherData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [newTeacher, setNewTeacher] = useState({
    nombre1: "",
    nombre2: "",
    apellido1: "",
    apellido2: "",
    telf: "",
    cedula: "",
    correo: "",
  });

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;

    // Validaciones en tiempo real
    let error = "";

    if (name === "nombre1" || name === "nombre2" || name === "apellido1" || name === "apellido2") {
      if (value && !validateLettersOnly(value)) {
        error = "Solo se permiten letras";
        return; // No actualizar el valor si no es válido
      }
    }

    if (name === "cedula") {
      if (value && !validateNumbersOnly(value)) {
        error = "Solo se permiten números";
        return; // No actualizar el valor si no es válido
      }
    }

    if (name === "correo") {
      if (value && !validateEmailStructure(value)) {
        error = "Correo Electronico invalido";
      }
    }

    // Limpiar error si el valor es válido
    setValidationErrors((prev) => ({ ...prev, [name]: error }));

    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditTeacher = async () => {
    const response = await fetch(`${backendUrl}/docente/changeInfo`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cedula: teacherData.docente.cedula,
        docente: newTeacher,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setNewTeacher({
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        telf: "",
        cedula: "",
        correo: "",
      });
      setValidationErrors({
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        telf: "",
        cedula: "",
        correo: "",
      });
      loadStudentData();
      setSnackbar({
        open: true,
        message: "Información editada exitosamente",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Fallo en la cambiar los datos del estudiante",
        severity: "error",
      });
    }
    handleClose2();
  };

  const loadStudentData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Importar la URL del backend
      const { backendUrl } = await import("config");
      const url = `${backendUrl}/docentePerfil/${id}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("🔍 StudentProfile - Datos de todos los estudiantes:", data);
        //originalWord.charAt(0).toUpperCase() + originalWord.slice(1)

        if (data) {
          setTeacherData({
            docente: {
              cedula: data.docente.cedula,
              nombre1:
                data.docente.nombre1.charAt(0).toUpperCase() + data.docente?.nombre1.slice(1) ||
                " ",
              nombre2:
                data.docente.nombre2.charAt(0).toUpperCase() + data.docente?.nombre2.slice(1) ||
                " ",
              apellido1:
                data.docente.apellido1.charAt(0).toUpperCase() + data.docente?.apellido1.slice(1) ||
                " ",
              apellido2:
                data.docente.apellido2.charAt(0).toUpperCase() + data.docente?.apellido2.slice(1) ||
                "",
              telf: data.docente.telf || "",
              userId: data.docente.Users.userId,
              correo: data.docente.Users.correo,
              estado: data.docente.Users.status,
            },
          });
          if (data.estudiante.Users.status === "activo") setAccessPage(true);
          else setAccessPage(false);
        } else {
          console.error("🔍 StudentProfile - Estudiante no encontrado con cédula:", id);
          if (wasCedulaMapped(id, id)) {
            setError(
              `Estudiante con cédula ${id} no encontrado. Mostrando perfil del estudiante ${id} como alternativa.`
            );
          } else {
            setError(`Estudiante con cédula ${id} no encontrado`);
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
  }, [id]);

  React.useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);

  const handleChangeTelf = async () => {
    const response = await fetch(`${backendUrl}/docente/changeTelf`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cedula: teacherData.docente.cedula,
        telf: newTeacher.telf,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setNewTeacher({
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        telf: "",
        cedula: "",
        correo: "",
      });
      setValidationErrors({
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        telf: "",
        cedula: "",
        correo: "",
      });
      loadStudentData();
      setSnackbar({
        open: true,
        message: "Información editada exitosamente",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Fallo en la cambiar el telefono del docente",
        severity: "error",
      });
    }
    handleClose3();
  };

  const handleChangeCorreo = async () => {
    const response = await fetch(`${backendUrl}/docente/changeCorreo`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cedula: teacherData.docente.cedula,
        correo: newTeacher.correo,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setNewTeacher({
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        telf: "",
        cedula: "",
        correo: "",
      });
      setValidationErrors({
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        telf: "",
        cedula: "",
        correo: "",
      });
      loadStudentData();
      setSnackbar({
        open: true,
        message: "Información editada exitosamente",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Fallo en la cambiar el correo del docente",
        severity: "error",
      });
    }
    handleClose();
  };

  const handleRestorePassword = async () => {
    const response = await fetch(`${backendUrl}/docente/restorePassword`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cedula: teacherData.docente.cedula,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setSnackbar({
        open: true,
        message: "Contraseña Restaurada exitosamente",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Fallo en la cambiar la contraseña del docente",
        severity: "error",
      });
    }
    handleClose4();
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

  const handleTelfChange = (value) => {
    setNewTeacher({
      ...newTeacher,
      telf: value,
    });
  };

  const handleSetAccess = async (value) => {
    const response = await fetch(`${backendUrl}/docente/setAccess`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cedula: teacherData.docente.cedula,
        acceso: value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      loadStudentData();
      setAccessPage(!accessPage);
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
  };

  useEffect(() => {
    if (teacherData?.docente.userId) {
      fetch(`${backendUrl}/materias-dashboard?userId=${teacherData?.docente.userId}&role=2`)
        .then((res) => res.json())
        .then((data) => {
          setMisClases(data);
        })
        .catch((err) => {
          setMisClases([]);
        });
      // Petición para obtener la cédula si es docente
    }
  }, [teacherData]);

  return (
    <DashboardLayout>
      <MDBox mb={2} />
      <Header teacherData={teacherData} tabValue={tabValue} onTabChange={handleTabChange}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <Card>
                <MDTypography variant="h5"> Datos de Contacto: </MDTypography>
                <MDTypography>Correo: {teacherData?.docente.correo}</MDTypography>
                <MDTypography>Teléfono: {teacherData?.docente.telf}</MDTypography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Grid item size={4}>
                <Stack mt={2} px={5} spacing={3}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpen2(true), console.log(open2);
                    }}
                  >
                    Cambiar Datos de Identificación
                  </Button>

                  <Modal
                    open={open2}
                    onClose={handleClose2}
                    aria-labelledby="modal-modal-title2"
                    aria-describedby="modal-modal-description2"
                  >
                    <Box p={3} sx={style}>
                      <Typography id="modal-modal-title2" variant="h6" component="h2">
                        Introduzca los Datos Personales a Cambiar
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Primer Nombre"
                            name="nombre1"
                            value={newTeacher.nombre1}
                            onChange={handleNewStudentChange}
                            fullWidth
                            error={!!validationErrors.nombre1}
                            helperText={validationErrors.nombre1}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Segundo Nombre"
                            name="nombre2"
                            value={newTeacher.nombre2}
                            onChange={handleNewStudentChange}
                            fullWidth
                            error={!!validationErrors.nombre2}
                            helperText={validationErrors.nombre2}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Primer Apellido"
                            name="apellido1"
                            value={newTeacher.apellido1}
                            onChange={handleNewStudentChange}
                            fullWidth
                            error={!!validationErrors.apellido1}
                            helperText={validationErrors.apellido1}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Segundo Apellido"
                            name="apellido2"
                            value={newTeacher.apellido2}
                            onChange={handleNewStudentChange}
                            fullWidth
                            error={!!validationErrors.apellido2}
                            helperText={validationErrors.apellido2}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            label="Cédula"
                            name="cedula"
                            value={newTeacher.cedula}
                            onChange={handleNewStudentChange}
                            fullWidth
                            error={!!validationErrors.cedula}
                            helperText={validationErrors.cedula}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Button variant="contained" onClick={() => handleEditTeacher()}>
                            Aceptar
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Modal>

                  <Button onClick={handleOpen3} variant="contained">
                    Cambiar Número de Teléfono
                  </Button>

                  <Modal
                    open={open3}
                    onClose={handleClose3}
                    aria-labelledby="modal-modal-title2"
                    aria-describedby="modal-modal-description2"
                  >
                    <Box p={3} sx={style}>
                      <Typography id="modal-modal-title2" variant="h6" component="h2">
                        Introduzca el Número de Teléfono:
                      </Typography>
                      <FormControl variant="standard" fullWidth>
                        <PhoneInput
                          className="hola MuiInputBase-root  MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1u5lk04-MuiInputBase-root-MuiOutlinedInput-root"
                          placeholder="Ingresar N° de Teléfono"
                          value={newTeacher.telf}
                          onChange={handleTelfChange}
                          defaultCountry="VE"
                          numberInputProps={{
                            className:
                              "MuiInputBase-input MuiOutlinedInput-input css-5mmmz-MuiInputBase-input-MuiOutlinedInput-input",
                          }}
                        />
                      </FormControl>
                      <Button color="success" onClick={() => handleChangeTelf()}>
                        Aceptar
                      </Button>
                    </Box>
                  </Modal>

                  <Button variant="contained" onClick={handleOpen}>
                    Cambiar Correo Electrónico
                  </Button>

                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box p={3} sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Introduzca el Nuevo Correo:
                      </Typography>

                      <TextField
                        label="Correo"
                        name="correo"
                        value={newTeacher.correo}
                        onChange={handleNewStudentChange}
                        fullWidth
                        error={!!validationErrors.correo}
                        helperText={validationErrors.correo}
                      />
                      <Button color="success" onClick={handleChangeCorreo}>
                        Aceptar
                      </Button>
                    </Box>
                  </Modal>

                  <Button onClick={handleOpen4} variant="contained">
                    Restaurar Constraseña
                  </Button>

                  <Modal
                    open={open4}
                    onClose={handleClose4}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box p={3} sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Si prosigue la contraseña del estudiante sera reseteada, la nueva contraseña
                        le llega al estudiante por correo
                      </Typography>

                      <Button color="error" onClick={handleRestorePassword}>
                        Aceptar
                      </Button>
                    </Box>
                  </Modal>
                </Stack>
              </Grid>
            </Grid>
            <Grid item xs={12} xl={4}>
              {/* TabPanel Content - Only 2 tabs */}
              <TabPanel value={tabValue} index={0}>
                <Card>
                  <MDBox p={3}>
                    <MDTypography variant="h5" mb={3}>
                      Configuraciones de Acceso
                    </MDTypography>
                    <Stack spacing={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={accessPage}
                            onChange={(e) => handleSetAccess(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Acceso a la Página"
                      />
                    </Stack>
                  </MDBox>
                </Card>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
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
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Materias
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Actualmente el docente imparte:
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox pt={4}>
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
                Array.from(
                  new Map(misClases.map((clase) => [clase.idMateria, clase])).values()
                ).map((clase, index) => (
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
      </Header>

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
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Footer />
    </DashboardLayout>
  );
}

export default TeacherProfile;
