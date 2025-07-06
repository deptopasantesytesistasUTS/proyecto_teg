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
  const { columns, rows } = coursesTableData();

  // Tab state
  const [tabValue, setTabValue] = React.useState(0);

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

  // Mock data for participants
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
      {/* Header */}
      <MDBox pt={6} pb={3}>
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
                <MDTypography variant="h4" color="white" textAlign="center">
                  Aula Virtual
                </MDTypography>
                <MDTypography variant="h6" color="white" textAlign="center">
                  Trabajo Especial de Grado - Informática
                </MDTypography>
              </MDBox>

              <MDBox pt={3}>
                <AppBar position="static" color="default">
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                  >
                    <Tab label="Aula" icon={<AssignmentIcon />} iconPosition="start" />
                    <Tab label="Participantes" icon={<PeopleIcon />} iconPosition="start" />
                    <Tab label="Recursos" icon={<FolderIcon />} iconPosition="start" />
                  </Tabs>
                </AppBar>

                {/* Tab 1: Aula */}
                <TabPanel value={tabValue} index={0}>
                  <MDBox>
                    {/* Propuesta de Título Section */}
                    <Accordion defaultExpanded sx={{ mb: 3 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <MDBox display="flex" alignItems="center">
                          <DescriptionIcon sx={{ mr: 2 }} />
                          <MDTypography variant="h6">Propuesta de Título</MDTypography>
                        </MDBox>
                      </AccordionSummary>
                      <AccordionDetails>
                        <MDBox>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleOpenTitleModal}
                            startIcon={<SendIcon />}
                            sx={{ mb: 2 }}
                          >
                            Ingresar Propuestas de Título
                          </Button>

                          {/* Título Seleccionado y Estado de Aprobación */}
                          {(selectedTitle || isTitleApproved) && (
                            <Card sx={{ p: 2, bgcolor: "grey.50" }}>
                              <MDBox
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mb={2}
                              >
                                <MDTypography variant="h6" color="primary">
                                  Título del Proyecto
                                </MDTypography>
                                <Chip
                                  label={isTitleApproved ? "Aprobado" : "Pendiente"}
                                  color={isTitleApproved ? "success" : "warning"}
                                  variant="filled"
                                  size="small"
                                />
                              </MDBox>

                              {selectedTitle && !(isTitleApproved && approvedTitle) && (
                                <MDBox mb={1}>
                                  <MDTypography variant="body1">
                                    <strong>Título Seleccionado:</strong> {selectedTitle}
                                  </MDTypography>
                                </MDBox>
                              )}

                              {isTitleApproved && approvedTitle && (
                                <MDBox>
                                  <MDTypography variant="body1" color="success.main">
                                    <strong>Título Aprobado:</strong> {approvedTitle}
                                  </MDTypography>
                                </MDBox>
                              )}
                            </Card>
                          )}
                        </MDBox>
                      </AccordionDetails>
                    </Accordion>

                    {/* Entrega de Borradores Section */}
                    <Accordion defaultExpanded sx={{ mb: 3 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <MDBox display="flex" alignItems="center">
                          <UploadIcon sx={{ mr: 2 }} />
                          <MDTypography variant="h6">Entrega de Borradores</MDTypography>
                        </MDBox>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={2}>
                          {[
                            "Primer Borrador",
                            "Segundo Borrador",
                            "Tercer Borrador",
                            "Borrador Final",
                          ].map((type, index) => (
                            <Card key={index} sx={{ p: 2 }}>
                              <MDBox
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <MDBox>
                                  <MDTypography variant="h6">{type}</MDTypography>
                                  <MDTypography variant="body2" color="text.secondary">
                                    Fecha límite: {draftDeadlines[index]}
                                  </MDTypography>
                                </MDBox>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => handleOpenUploadModal(type)}
                                  startIcon={<UploadIcon />}
                                >
                                  Subir Archivo
                                </Button>
                              </MDBox>
                            </Card>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  </MDBox>
                </TabPanel>

                {/* Tab 2: Participantes */}
                <TabPanel value={tabValue} index={1}>
                  <MDBox>
                    {/* Profesores */}
                    <Card sx={{ p: 3, mb: 4 }}>
                      <MDTypography variant="h5" mb={3}>
                        <SchoolIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Profesores
                      </MDTypography>
                      <Box sx={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#f5f5f5" }}>
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  borderBottom: "2px solid #ddd",
                                }}
                              >
                                <MDTypography variant="h6">Nombre</MDTypography>
                              </th>

                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  borderBottom: "2px solid #ddd",
                                }}
                              >
                                <MDTypography variant="h6">Especialidad</MDTypography>
                              </th>
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  borderBottom: "2px solid #ddd",
                                }}
                              >
                                <MDTypography variant="h6">Email</MDTypography>
                              </th>
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  borderBottom: "2px solid #ddd",
                                }}
                              >
                                <MDTypography variant="h6">Acciones</MDTypography>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {teachers.map((teacher, index) => (
                              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "12px", textAlign: "left" }}>
                                  <MDBox display="flex" alignItems="center">
                                    <MDAvatar sx={{ mr: 2, width: 32, height: 32 }}>
                                      <PersonIcon />
                                    </MDAvatar>
                                    <MDTypography variant="body1" fontWeight="medium">
                                      {teacher.name}
                                    </MDTypography>
                                  </MDBox>
                                </td>

                                <td style={{ padding: "12px", textAlign: "left" }}>
                                  <MDTypography variant="body2">{teacher.specialty}</MDTypography>
                                </td>
                                <td style={{ padding: "12px", textAlign: "left" }}>
                                  <MDTypography variant="body2">{teacher.email}</MDTypography>
                                </td>
                                <td style={{ padding: "12px", textAlign: "left" }}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    href="/docentes/30443230"
                                    sx={{ minWidth: 100 }}
                                  >
                                    Ver Perfil
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Box>
                    </Card>

                    {/* Estudiantes */}
                    <Card sx={{ p: 3 }}>
                      <MDTypography variant="h5" mb={3}>
                        <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Estudiantes
                      </MDTypography>
                      <Box sx={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#f5f5f5" }}>
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  borderBottom: "2px solid #ddd",
                                }}
                              >
                                <MDTypography variant="h6">Nombre</MDTypography>
                              </th>
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  borderBottom: "2px solid #ddd",
                                }}
                              >
                                <MDTypography variant="h6">Cédula</MDTypography>
                              </th>
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  borderBottom: "2px solid #ddd",
                                }}
                              >
                                <MDTypography variant="h6">Email</MDTypography>
                              </th>
                              <th
                                style={{
                                  padding: "12px",
                                  textAlign: "left",
                                  borderBottom: "2px solid #ddd",
                                }}
                              >
                                <MDTypography variant="h6">Acciones</MDTypography>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student, index) => (
                              <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "12px", textAlign: "left" }}>
                                  <MDBox display="flex" alignItems="center">
                                    <MDAvatar sx={{ mr: 2, width: 32, height: 32 }}>
                                      <PersonIcon />
                                    </MDAvatar>
                                    <MDTypography variant="body1" fontWeight="medium">
                                      {student.name}
                                    </MDTypography>
                                  </MDBox>
                                </td>
                                <td style={{ padding: "12px", textAlign: "left" }}>
                                  <MDTypography variant="body2">{student.id}</MDTypography>
                                </td>
                                <td style={{ padding: "12px", textAlign: "left" }}>
                                  <MDTypography variant="body2">{student.email}</MDTypography>
                                </td>
                                <td style={{ padding: "12px", textAlign: "left" }}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    href="/estudiantes/30443230"
                                    sx={{ minWidth: 100 }}
                                  >
                                    Ver Perfil
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Box>
                    </Card>
                  </MDBox>
                </TabPanel>

                {/* Tab 3: Recursos */}
                <TabPanel value={tabValue} index={2}>
                  <MDBox>
                    <MDTypography variant="h5" mb={3}>
                      <FolderIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Recursos Disponibles
                    </MDTypography>
                    <Grid container spacing={3}>
                      {resources.map((resource, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card sx={{ p: 3, height: "100%" }}>
                            <MDBox display="flex" alignItems="center" mb={2}>
                              <DescriptionIcon sx={{ mr: 2, color: "primary.main" }} />
                              <MDBox>
                                <MDTypography variant="h6" fontWeight="medium">
                                  {resource.name}
                                </MDTypography>
                                <Chip
                                  label={resource.type}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </MDBox>
                            </MDBox>
                            <MDTypography variant="body2" color="text" mb={2}>
                              {resource.description}
                            </MDTypography>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<LinkIcon />}
                              fullWidth
                              href={resource.url}
                              target="_blank"
                            >
                              Descargar
                            </Button>
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

      <Footer />
    </DashboardLayout>
  );
}

export default CourseView;
