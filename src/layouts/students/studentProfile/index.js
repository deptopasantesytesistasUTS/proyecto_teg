import * as React from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

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

  // Mock data for project titles
  const projectTitles = [
    "Sistema de Gestión de Biblioteca Universitaria",
    "Aplicación Móvil para Control de Asistencia",
    "Plataforma de E-learning con IA",
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
      <Header tabValue={tabValue} onTabChange={handleTabChange}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <Card>
                <MDTypography variant="h5"> Datos de Carrera: </MDTypography>
                <MDTypography>Materia Actual: Trabajo Especial de Grado (TEG)</MDTypography>
                <MDTypography>Estado: Cursando</MDTypography>
                <MDTypography>Acceso al Sistema: Activo</MDTypography>
              </Card>
              <br></br>
              <Card>
                <MDTypography variant="h5"> Datos de Contacto: </MDTypography>
                <MDTypography>Correo: luiscl1804@gmail.com</MDTypography>
                <MDTypography>Teléfono: 0412-0688647</MDTypography>
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
                      <TextField id="outlined-basic" label="Segundo Nombre" variant="outlined" />
                      <TextField id="outlined-basic" label="Primer Apellido" variant="outlined" />
                      <TextField id="outlined-basic" label="Segundo Apellido" variant="outlined" />
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
                        Si prosigue la contraseña del estudiante sera reseteada, la nueva contraseña
                        le llega al estudiante por correo
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

                {/* Project Judges Tab */}
                <TabPanel value={projectTabValue} index={0}>
                  <MDBox>
                    <MDTypography variant="h5" mb={3}>
                      Jueces Asignados al Proyecto
                    </MDTypography>
                    <Grid container spacing={3}>
                      {assignedJudges.map((judge, index) => (
                        <Grid item xs={12} md={4} key={index}>
                          <Card sx={{ p: 3, height: "100%" }}>
                            <MDBox display="flex" alignItems="center" mb={2}>
                              <MDAvatar
                                src={team1}
                                alt={judge.name}
                                size="lg"
                                shadow="md"
                                sx={{ mr: 2 }}
                              />
                              <MDBox>
                                <MDTypography variant="h6" fontWeight="medium">
                                  {judge.name}
                                </MDTypography>
                                <MDTypography variant="button" color="info" fontWeight="medium">
                                  {judge.role}
                                </MDTypography>
                              </MDBox>
                            </MDBox>
                            <MDBox>
                              <MDTypography variant="body2" color="text" mb={1}>
                                <strong>Especialidad:</strong> {judge.specialty}
                              </MDTypography>
                              <MDTypography variant="body2" color="text">
                                <strong>Email:</strong> {judge.email}
                              </MDTypography>
                            </MDBox>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </MDBox>
                </TabPanel>

                {/* Project Drafts Tab */}
                <TabPanel value={projectTabValue} index={1}>
                  <MDBox>
                    <MDTypography variant="h5" mb={3}>
                      Borradores del Proyecto
                    </MDTypography>

                    {/* Title Selection */}
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
                            >
                              <MenuItem value="">
                                <em>Seleccione un título del proyecto</em>
                              </MenuItem>
                              {projectTitles.map((title, index) => (
                                <MenuItem key={index} value={title}>
                                  {title}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                              if (selectedTitle) {
                                console.log("Título seleccionado:", selectedTitle);
                              }
                            }}
                          >
                            Seleccionar Título
                          </Button>
                        </Grid>
                      </Grid>

                      {/* Selected Title Display */}
                      {selectedTitle && (
                        <MDBox mt={2}>
                          <Card sx={{ p: 2, bgcolor: "grey.50" }}>
                            <MDTypography variant="h6" color="primary" mb={1}>
                              Título Seleccionado:
                            </MDTypography>
                            <MDTypography variant="body1">{selectedTitle}</MDTypography>
                          </Card>
                        </MDBox>
                      )}
                    </MDBox>

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
                              <Button variant="contained" fullWidth disabled={draft.progress === 0}>
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

      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
