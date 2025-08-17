import * as React from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { getValidStudentId, wasCedulaMapped } from "utils/studentUtils";

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

function Overview() {
  const { id } = useParams(); // Obtener el ID del estudiante de la URL
  console.log("🔍 StudentProfile - ID del estudiante de la URL:", id);

  // Para pruebas, si el ID no existe en la lista válida, usar la primera cédula válida
  const studentId = getValidStudentId(id);
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
      const url = `${backendUrl}/jurados/${studentId}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setJurados(data.assignedJudges || []);
        setAvailableJudges(data.availableJudges || []);
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
      loadJudgesData();
    }
  }, [studentId]);

  // Manejar cambio en los selects de jurados
  const handleJudgeSelect = (index, value) => {
    const newSelectedJudges = [...selectedJudges];
    newSelectedJudges[index] = value;
    setSelectedJudges(newSelectedJudges);
  };

  // Enviar los jurados seleccionados al backend
  const handleAssignJudges = async () => {
    try {
      const { backendUrl } = await import("config");
      const url = `${backendUrl}/asignar-jurados`;

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

      console.log("🔍 StudentProfile - Intentando cargar datos del estudiante");
      console.log("🔍 StudentProfile - ID del estudiante:", studentId);
      console.log("🔍 StudentProfile - URL de la petición:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      console.log("🔍 StudentProfile - Status de la respuesta:", response.status);

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
                  data.estudiante.nombre1.slice(1) || "",
              nombre2:
                data.estudiante.nombre2.charAt(0).toUpperCase() +
                  data.estudiante.nombre2.slice(1) || "",
              apellido1:
                data.estudiante.apellido1.charAt(0).toUpperCase() +
                  data.estudiante.apellido1.slice(1) || "",
              apellido2:
                data.estudiante.apellido2.charAt(0).toUpperCase() +
                  data.estudiante.apellido2.slice(1) || "",
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

  // Mock data for judges
  const assignedJudges = [
    {
      name: "Dr. María González",
      role: "Juez",
      email: "maria.gonzalez@universidad.edu",
      specialty: "Inteligencia Artificial",
    },
    {
      name: "Prof. Carlos Rodríguez",
      role: "Juez",
      email: "carlos.rodriguez@universidad.edu",
      specialty: "Desarrollo de Software",
    },
    {
      name: "Ing. Ana Martínez",
      role: "Juez",
      email: "ana.martinez@universidad.edu",
      specialty: "Bases de Datos",
    },
  ];

  // Mock data for drafts
  const drafts = [
    {
      title: "Primer Borrador",
      status: "Completado",
      date: "15/01/2024",
      progress: 100,
      color: "success",
    },
    {
      title: "Segundo Borrador",
      status: "En Revisión",
      date: "20/02/2024",
      progress: 75,
      color: "warning",
    },
    {
      title: "Tercer Borrador",
      status: "En Progreso",
      date: "10/03/2024",
      progress: 50,
      color: "info",
    },
    {
      title: "Borrador Final",
      status: "Pendiente",
      date: "Pendiente",
      progress: 0,
      color: "error",
    },
  ];

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
                      {studentData.matricula.map((mat) => {
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
                            Introduzca los Datos de Identificacion del Estudiante:
                          </Typography>
                          <TextField id="outlined-basic" label="Primer Nombre" variant="outlined" />
                          <TextField
                            id="outlined-basic"
                            label="Segundo Nombre"
                            variant="outlined"
                          />
                          <TextField
                            id="outlined-basic"
                            label="Primer Apellido"
                            variant="outlined"
                          />
                          <TextField
                            id="outlined-basic"
                            label="Segundo Apellido"
                            variant="outlined"
                          />
                          <TextField
                            id="outlined-basic"
                            type="number"
                            label="Cedula"
                            variant="outlined"
                          />
                          <Button color="success" onClick={handleClose2}>
                            Aceptar
                          </Button>
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
                          <TextField id="outlined-basic" label="Telefono" variant="outlined" />
                          <Button color="success" onClick={handleClose3}>
                            Aceptar
                          </Button>
                        </Box>
                      </Modal>

                      <ProtocoloGenerator></ProtocoloGenerator>
                      <ControlTutoriasGenerator></ControlTutoriasGenerator>
                      <BusinessLetterGenerator
                        studentId={studentData?.estudiante.cedula}
                        studentName={`${studentData?.estudiante.nombre1} ${studentData?.estudiante.nombre2} ${studentData?.estudiante.apellido1} ${studentData?.estudiante.apellido2}`}
                        career={`${studentData.estudiante.Carreras.nombre}`}
                        
                      ></BusinessLetterGenerator>

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
                            id="outlined-basic"
                            label="Correo Electrónico"
                            variant="outlined"
                          />
                          <Button color="success" onClick={handleClose}>
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
                            Si prosigue la contraseña del estudiante sera reseteada, la nueva
                            contraseña le llega al estudiante por correo
                          </Typography>

                          <Button color="error" onClick={handleClose4}>
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
                                onChange={(e) => setAccessPage(e.target.checked)}
                                color="primary"
                              />
                            }
                            label="Acceso a la Página"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={accessResults}
                                onChange={(e) => setAccessResults(e.target.checked)}
                                color="primary"
                              />
                            }
                            label="Acceso a Resultados"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={accessDeliveries}
                                onChange={(e) => setAccessDeliveries(e.target.checked)}
                                color="primary"
                              />
                            }
                            label="Acceso a Entregas"
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
                        <Tab label="Jueces Asignados" icon={<PersonIcon />} iconPosition="start" />
                        <Tab
                          label="Borradores del Proyecto"
                          icon={<DescriptionIcon />}
                          iconPosition="start"
                        />
                      </Tabs>
                    </AppBar>

                    {/* Project Judges Tab - Modificado */}
                    <TabPanel value={projectTabValue} index={0}>
                      <MDBox>
                        <MDBox
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={3}
                        >
                          <MDTypography variant="h5">Jueces Asignados al Proyecto</MDTypography>
                          {jurados.length === 0 && (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => setIsAssigningJudges(true)}
                            >
                              Asignar Jurados
                            </Button>
                          )}
                        </MDBox>

                        {isAssigningJudges ? (
                          <Card sx={{ p: 3 }}>
                            <MDTypography variant="h6" mb={2}>
                              Asignar Jurados al Proyecto
                            </MDTypography>

                            <Grid container spacing={2}>
                              {[0, 1, 2].map((index) => (
                                <Grid item xs={12} md={4} key={index}>
                                  <FormControl fullWidth variant="outlined">
                                    <InputLabel>Jurado {index + 1}</InputLabel>
                                    <Select
                                      value={selectedJudges[index]}
                                      onChange={(e) => handleJudgeSelect(index, e.target.value)}
                                      label={`Jurado ${index + 1}`}
                                    >
                                      <MenuItem value="">
                                        <em>Seleccionar...</em>
                                      </MenuItem>
                                      {availableJudges.map((judge) => (
                                        <MenuItem
                                          key={judge.id}
                                          value={judge.id}
                                          disabled={selectedJudges.includes(judge.id)}
                                        >
                                          {judge.nombre} ({judge.especialidad})
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                              ))}
                            </Grid>

                            <MDBox mt={3} display="flex" justifyContent="flex-end" gap={2}>
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setIsAssigningJudges(false);
                                  setSelectedJudges(["", "", ""]);
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAssignJudges}
                                disabled={selectedJudges.filter((j) => j !== "").length < 3}
                              >
                                Guardar Asignación
                              </Button>
                            </MDBox>
                          </Card>
                        ) : jurados.length > 0 ? (
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
                                      <strong>Especialidad:</strong> {judge.especialidad}
                                    </MDTypography>
                                    <MDTypography variant="body2" color="text" mb={1}>
                                      <strong>Email:</strong> {judge.email}
                                    </MDTypography>
                                    <MDTypography variant="body2" color="text">
                                      <strong>Teléfono:</strong> {judge.telefono || "No disponible"}
                                    </MDTypography>
                                  </MDBox>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <Card sx={{ p: 3, textAlign: "center" }}>
                            <MDTypography variant="body1" color="text">
                              No se han asignado jurados para este proyecto.
                            </MDTypography>
                          </Card>
                        )}
                      </MDBox>
                    </TabPanel>

                    <TabPanel value={projectTabValue} index={1}>
                      <MDBox>
                        <MDTypography variant="h5" mb={3}>
                          Borradores del Proyecto
                        </MDTypography>

                        {/* Title Selection - Modificado para usar datos reales */}
                        {studentData?.matricula?.tituloElegido ? (
                          <MDBox mb={4}>
                            <Card sx={{ p: 3, bgcolor: "success.light" }}>
                              <MDTypography variant="h6" color="success.dark" mb={1}>
                                Título ya seleccionado:
                              </MDTypography>
                              <MDTypography variant="body1" fontWeight="medium">
                                {
                                  studentData.matricula[
                                    `titulo${studentData.matricula.tituloElegido}`
                                  ]
                                }
                              </MDTypography>
                              <MDTypography variant="caption" color="text">
                                (No se puede cambiar el título una vez seleccionado)
                              </MDTypography>
                            </Card>
                          </MDBox>
                        ) : (
                          <MDBox mb={4}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} md={8}>
                                <FormControl variant="standard" fullWidth>
                                  <InputLabel id="title-select-label">
                                    Seleccionar Título del Proyecto
                                  </InputLabel>
                                  <Select
                                    labelId="title-select-label"
                                    id="title-select"
                                    value={selectedTitle}
                                    label="Seleccionar Título del Proyecto"
                                    onChange={(e) => setSelectedTitle(e.target.value)}
                                    disabled={!studentData?.matricula}
                                  >
                                    <MenuItem value="">
                                      <em>Seleccione un título del proyecto</em>
                                    </MenuItem>
                                    {[1, 2, 3].map((num) => {
                                      const titulo = studentData?.matricula?.[`titulo${num}`];
                                      return titulo ? (
                                        <MenuItem key={num} value={titulo}>
                                          {titulo}
                                        </MenuItem>
                                      ) : null;
                                    })}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  disabled={!selectedTitle}
                                  onClick={() => {
                                    if (selectedTitle) {
                                      // Aquí deberías hacer la llamada al backend para guardar el título seleccionado
                                      console.log("Título seleccionado:", selectedTitle);
                                      // Ejemplo de cómo determinar qué título se seleccionó
                                      const tituloIndex = [1, 2, 3].find(
                                        (num) =>
                                          studentData.matricula[`titulo${num}`] === selectedTitle
                                      );
                                      console.log("Índice del título seleccionado:", tituloIndex);

                                      // Lógica para actualizar el título elegido en el backend
                                      // await api.actualizarTituloElegido(studentData.estudiante.cedula, tituloIndex);

                                      // Actualizar el estado local (solo como ejemplo, deberías actualizar con la respuesta del backend)
                                      setStudentData((prev) => ({
                                        ...prev,
                                        matricula: {
                                          ...prev.matricula,
                                          tituloElegido: tituloIndex,
                                        },
                                      }));
                                    }
                                  }}
                                >
                                  Seleccionar Título
                                </Button>
                              </Grid>
                            </Grid>

                            {/* Mostrar títulos disponibles */}
                            <MDBox mt={3}>
                              <MDTypography variant="h6" mb={1}>
                                Títulos disponibles:
                              </MDTypography>
                              <List>
                                {[1, 2, 3].map((num) => {
                                  const titulo = studentData?.matricula?.[`titulo${num}`];
                                  return titulo ? (
                                    <ListItem key={num}>
                                      <ListItemText
                                        primary={`Título ${num}:`}
                                        secondary={titulo}
                                        secondaryTypographyProps={{
                                          style: { fontWeight: "medium" },
                                        }}
                                      />
                                    </ListItem>
                                  ) : null;
                                })}
                              </List>
                            </MDBox>
                          </MDBox>
                        )}

                        {/* Draft Cards */}
                        <Grid container spacing={3}>
                          {drafts.map((draft, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                              <Card sx={{ p: 3, height: "100%", textAlign: "center" }}>
                                <MDBox>
                                  <MDTypography variant="h6" fontWeight="medium" mb={2}>
                                    {draft.title}
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
                                      bgColor={draft.color}
                                      color="white"
                                      fontSize="1.5rem"
                                      fontWeight="bold"
                                    >
                                      {draft.progress}%
                                    </MDBox>
                                  </MDBox>
                                  <MDTypography variant="body2" color="text" mb={1}>
                                    <strong>Estado:</strong> {draft.status}
                                  </MDTypography>
                                  <MDTypography variant="body2" color="text" mb={2}>
                                    <strong>Fecha:</strong> {draft.date}
                                  </MDTypography>
                                  <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={draft.progress === 0}
                                  >
                                    {draft.progress === 0 ? "Pendiente" : "Ver Borrador"}
                                  </Button>
                                </MDBox>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </MDBox>
                    </TabPanel>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>

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
