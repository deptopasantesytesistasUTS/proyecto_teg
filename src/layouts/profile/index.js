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
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

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
import { Button, Card, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";

// Overview page components
import Header from "./components/Header";

// Config
import { backendUrl } from "config";


// Data

// Images
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import informatica from "assets/images/informatica.png";

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

function Profile() {
  // User data state
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Form states for editing
  const [editFormData, setEditFormData] = React.useState({
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    id: "",
    phone: "",
    email: "",
  });

  // Modal states
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

  // Configuration state
  const [accessPage, setAccessPage] = React.useState(true);
  const [accessResults, setAccessResults] = React.useState(true);
  const [accessDeliveries, setAccessDeliveries] = React.useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });

  // Fetch user data from backend
  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Get user ID from localStorage or context
      let user = null;
try {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    user = JSON.parse(userStr);
  }
} catch (e) {
  user = null;
}
      console.log(user.userId)
      const userId = user.userId // You might need to adjust this based on your auth system
      
      const response = await fetch(`${backendUrl}/user/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setEditFormData({
          firstName: data.firstName || "",
          secondName: data.secondName || "",
          firstLastName: data.firstLastName || "",
          secondLastName: data.secondLastName || "",
          id: data.id || "",
          phone: data.phone || "",
          email: data.email || "",
          role: data.role || "",
        });
      } else {
        setError("Error al cargar los datos del usuario");
        // Set default data for development
        setUserData({
          firstName: "",
          secondName: "",
          firstLastName: "",
          secondLastName: "",
          id: "",
          email: "",
          phone: "",
          role: "Docente",
        });
      }
    } catch (err) {
      setError("Error de conexión");
      console.error("Error fetching user data:", err);
      // Set default data for development
      setUserData({
        firstName: "Error",
        secondName: "",
        firstLastName: "Error",
        secondLastName: "",
        id: "Error",
        email: "Error",
        phone: "Error",
        role: "Error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update user data
  const updateUserData = async (updateData) => {
    try {
      const userId = localStorage.getItem("userId") || "default";
      
      const response = await fetch(`${backendUrl}/user/profile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Datos actualizados exitosamente",
          severity: "success",
        });
        // Refresh user data
        fetchUserData();
        return true;
      } else {
        setSnackbar({
          open: true,
          message: "Error al actualizar los datos",
          severity: "error",
        });
        return false;
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error de conexión",
        severity: "error",
      });
      return false;
    }
  };

  // Handle form changes
  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleUpdatePhone = async () => {
    const success = await updateUserData({
      phone: editFormData.phone,
    });
    if (success) handleClose3();
  };

  const handleUpdateEmail = async () => {
    const success = await updateUserData({
      email: editFormData.email,
    });
    if (success) handleClose();
  };

  const handleResetPassword = async () => {
    try {
      const userId = localStorage.getItem("userId") || "default";
      
      const response = await fetch(`${backendUrl}/user/reset-password/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Contraseña reseteada.",
          severity: "success",
        });
        handleClose4();
      } else {
        setSnackbar({
          open: true,
          message: "Error al cambiar la contraseña",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error de conexión",
        severity: "error",
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch user data on component mount
  React.useEffect(() => {
    fetchUserData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <MDTypography variant="h6">Cargando datos del perfil...</MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error && !userData) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <MDTypography variant="h6" color="error">{error}</MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Mock data for communications
  return (
    <DashboardLayout>
      <MDBox mb={2} />
      <Header tabValue={tabValue} onTabChange={handleTabChange} userData={userData}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <Card>
                <MDTypography variant="h5"> Datos de Contacto: </MDTypography>
                <MDTypography>Correo: {userData?.email || "No especificado"}</MDTypography>
                <MDTypography>Teléfono: {userData?.phone || "No especificado"}</MDTypography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Grid item size={4}>
                <Stack mt={2} px={5} spacing={3}>
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
                      <TextField 
                        fullWidth
                        margin="normal"
                        label="Telefono" 
                        variant="outlined"
                        value={editFormData.phone}
                        onChange={(e) => handleFormChange("phone", e.target.value)}
                      />
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                        <Button variant="outlined" onClick={handleClose3}>
                          Cancelar
                        </Button>
                        <Button color="success" onClick={handleUpdatePhone}>
                          Aceptar
                        </Button>
                      </Box>
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
                        fullWidth
                        margin="normal"
                        label="Correo Electrónico"
                        variant="outlined"
                        value={editFormData.email}
                        onChange={(e) => handleFormChange("email", e.target.value)}
                      />
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                        <Button variant="outlined" onClick={handleClose}>
                          Cancelar
                        </Button>
                        <Button color="success" onClick={handleUpdateEmail}>
                          Aceptar
                        </Button>
                      </Box>
                    </Box>
                  </Modal>

                  <Button onClick={handleOpen4} variant="contained">
                    Cambiar Constraseña
                  </Button>

                  <Modal
                    open={open4}
                    onClose={handleClose4}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box p={3} sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Indique la nueva contraseña:
                      </Typography>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Contraseña"
                        variant="outlined"
                        value={editFormData.password}
                        onChange={(e) => handleFormChange("password", e.target.value)}
                      />

                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                        <Button variant="outlined" onClick={handleClose4}>
                          Cancelar
                        </Button>
                        <Button color="error" onClick={handleResetPassword}>
                          Aceptar
                        </Button>
                      </Box>
                    </Box>
                  </Modal>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </Header>

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

export default Profile;