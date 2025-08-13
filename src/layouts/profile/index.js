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
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});


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

  const [passwordData, setPasswordData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = React.useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Estados para la imagen de perfil
  const [profileImage, setProfileImage] = React.useState(null);
  const [ProfileImageURL, setProfileImageURL] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState(null);
  const [imageError, setImageError] = React.useState("");

  // Manejar cambio de imagen
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setImageError("No se seleccionó ningún archivo");
      return;
    }

    // Validar tipo de archivo
    if (!file.type.match("image.*")) {
      setImageError("Por favor selecciona un archivo de imagen (JPEG, PNG)");
      return;
    }

    // Validar tamaño (2MB máximo)
    if (file.size > 2 * 1024 * 1024) {
      setImageError("La imagen no debe exceder los 2MB");
      return;
    }

    // Crear previsualización
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Validar dimensiones
        if (img.width !== 80 || img.height !== 80) {
          setImageError("La imagen debe ser exactamente de 80x80 píxeles");
          return;
        }

        setImageError("");
        setImagePreview(e.target.result);
        setProfileImage(file);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  async function getProfileImageUrl(userId) {
    try {
      const response = await fetch(`${backendUrl}/user/profileImage/${userId}`);

      if (response.ok) {
        // Para uso en componentes o como background
        console.log(`${backendUrl}/user/profileImage/${userId}?t=${Date.now()}`)
        return `${backendUrl}/user/profileImage/${userId}?t=${Date.now()}`;
      }
      return "/default-profile.webp";
    } catch (error) {
      console.error("Error al obtener imagen:", error);
      return "/default-profile.webp";
    }
  }

  // Subir imagen al servidor
  const uploadProfileImage = async () => {
    if (!profileImage || imageError) {
      setSnackbar({
        open: true,
        message: "Por favor corrige los errores antes de subir",
        severity: "error",
      });
      return;
    }

    try {
      let user = null;
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          user = JSON.parse(userStr);
        }
      } catch (e) {
        user = null;
      }
      const userId = user.userId; // You might need to adjust this based on your auth system
      const formData = new FormData();
      formData.append("profileImage", profileImage);
      formData.append("userId", userId);
      console.log("form")
      console.log(formData)

      const response = await fetch(`${backendUrl}/user/profileImage`, {
        method: "PUT",
        body: formData,
        // No incluir Content-Type, el navegador lo establecerá con el boundary correcto
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Imagen de perfil actualizada exitosamente",
          severity: "success",
        });
        // Actualizar la vista con la nueva imagen
        fetchUserData();
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || "Error al subir la imagen",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error de conexión al subir la imagen",
        severity: "error",
      });
    }
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Al menos 8 caracteres");
    if (!/[A-Z]/.test(password)) errors.push("Al menos una mayúscula");
    if (!/[a-z]/.test(password)) errors.push("Al menos una minúscula");
    if (!/[0-9]/.test(password)) errors.push("Al menos un número");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("Al menos un carácter especial");
    return errors;
  };

  // Manejar cambios en los campos de contraseña
  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validaciones en tiempo real
    if (field === "newPassword") {
      const errors = validatePassword(value);
      setPasswordErrors((prev) => ({
        ...prev,
        new: errors.length > 0 ? errors.join(", ") : "",
      }));
    } else if (field === "confirmPassword" && value !== passwordData.newPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirm: "Las contraseñas no coinciden",
      }));
    } else if (field === "confirmPassword") {
      setPasswordErrors((prev) => ({
        ...prev,
        confirm: "",
      }));
    }
  };

  // Validar antes de enviar
  const validateBeforeSubmit = () => {
    let valid = true;
    const newErrors = { current: "", new: "", confirm: "" };

    if (!passwordData.currentPassword) {
      newErrors.current = "La contraseña actual es requerida";
      valid = false;
    }

    const newPassErrors = validatePassword(passwordData.newPassword);
    if (newPassErrors.length > 0) {
      newErrors.new = newPassErrors.join(", ");
      valid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirm = "Las contraseñas no coinciden";
      valid = false;
    }

    setPasswordErrors(newErrors);
    return valid;
  };

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

  // Tab state
  const [tabValue, setTabValue] = React.useState(0);
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
      console.log(user.userId);
      const userId = user.userId; // You might need to adjust this based on your auth system

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

        const url = await getProfileImageUrl(userId);
        setProfileImageURL(url)
        

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

  const handleResetPassword = async () => {
    if (!validateBeforeSubmit()) return;

    try {
      let user = null;
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          user = JSON.parse(userStr);
        }
      } catch (e) {
        user = null;
      }
      const userId = user.userId; // You might need to adjust this based on your auth system

      const response = await fetch(`${backendUrl}/user/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Contraseña cambiada exitosamente",
          severity: "success",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        handleClose4();
      } else {
        setSnackbar({
          open: true,
          message: data.message || "Error al cambiar la contraseña",
          severity: "error",
        });
        // Manejar error específico de contraseña incorrecta
        if (data.error === "Invalid current password") {
          setPasswordErrors((prev) => ({
            ...prev,
            current: "Contraseña actual incorrecta",
          }));
        }
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
          <MDTypography variant="h6" color="error">
            {error}
          </MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Mock data for communications
  return (
    <DashboardLayout>
      <MDBox mb={2} />
      <Header
        tabValue={tabValue}
        onTabChange={handleTabChange}
        userData={userData}
        imagePreview={imagePreview}
        imageError={imageError}
        profileImage={ProfileImageURL}
      >
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
                  <Button onClick={handleOpen4} variant="contained">
                    Cambiar Constraseña
                  </Button>

                  <Modal
                    open={open4}
                    onClose={handleClose4}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box p={3} sx={{ ...style, width: 500 }}>
                      <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                        Cambiar Contraseña
                      </Typography>

                      <TextField
                        fullWidth
                        margin="normal"
                        label="Contraseña Actual"
                        type="password"
                        variant="outlined"
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        error={!!passwordErrors.current}
                        helperText={passwordErrors.current}
                      />

                      <TextField
                        fullWidth
                        margin="normal"
                        label="Nueva Contraseña"
                        type="password"
                        variant="outlined"
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        error={!!passwordErrors.new}
                        helperText={
                          passwordErrors.new ||
                          "Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial"
                        }
                      />

                      <TextField
                        fullWidth
                        margin="normal"
                        label="Confirmar Nueva Contraseña"
                        type="password"
                        variant="outlined"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        error={!!passwordErrors.confirm}
                        helperText={passwordErrors.confirm}
                      />

                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                        <Button variant="outlined" onClick={handleClose4}>
                          Cancelar
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleResetPassword}
                          disabled={
                            !passwordData.currentPassword ||
                            !passwordData.newPassword ||
                            !passwordData.confirmPassword ||
                            !!passwordErrors.new ||
                            !!passwordErrors.confirm
                          }
                        >
                          Cambiar Contraseña
                        </Button>
                      </Box>
                    </Box>
                  </Modal>

                  <Box>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                      sx={{ mb: 2 }}
                    >
                      Seleccionar Foto
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>

                    {imagePreview && (
                      <Button
                        variant="contained"
                        onClick={uploadProfileImage}
                        disabled={!!imageError}
                        fullWidth
                      >
                        Guardar Foto
                      </Button>
                    )}

                    {imagePreview && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          setImagePreview(null);
                          setProfileImage(null);
                          setImageError("");
                        }}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </Box>
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