import React, { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FolderIcon from "@mui/icons-material/Folder";
import DownloadIcon from "@mui/icons-material/Download";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CartaAprMetGenerator from "layouts/students/data/generateCartaAceMet";
import CartaAprAcaGenerator from "layouts/students/data/generateCartaAcademico";
import CartaAprAseGenerator from "layouts/students/data/generateCartaAsesor";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { backendUrl } from "config";
import PropTypes from "prop-types";


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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};


function Recursos({carrera}) {

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
     const [loading, setLoading] = React.useState(true);
      const [error, setError] = React.useState(null);

    const [data, setData] = useState({
      nombre: "",
      id: "",
      phone: "",
      email: "",
      role: "",
      titulo: "",
      tutorNombre: "",
      tutorCedula: "",
      fecha: "",
    });

    const [validationErrors, setValidationErrors] = useState({
        
      });

      const validateLettersOnly = (value) => {
        const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
        return lettersRegex.test(value);
      };

      // Función para validar solo números
      const validateNumbersOnly = (value) => {
        const numbersRegex = /^[0-9]*$/;
        return numbersRegex.test(value);
      };


    const handleDataChange = (e) => {
      const { name, value } = e.target;

      // Validaciones en tiempo real
      let error = "";

      if (
        name === "tutorNombre"
      ) {
        if (value && !validateLettersOnly(value)) {
          error = "Solo se permiten letras";
          return; // No actualizar el valor si no es válido
        }
      }

      if (name === "tutorCedula") {
        if (value && !validateNumbersOnly(value)) {
          error = "Solo se permiten números";
          return; // No actualizar el valor si no es válido
        }
      }

      // Limpiar error si el valor es válido
      setValidationErrors((prev) => ({ ...prev, [name]: error }));

      setData((prev) => ({ ...prev, [name]: value }));
    };

    React.useEffect(() => {
        fetchUserData();
        console.log(data)
      }, []);


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
            const data2 = await response.json();
            setData({
              ...data,
              nombre:
                data2.firstName +
                  " " +
                  data2.secondName +
                  " " +
                  data2.firstLastName +
                  " " +
                  data2.secondLastName || "",
              id: data2.id || "",
              phone: data2.phone || "",
              email: data2.email || "",
              role: data2.role || "",
              titulo: "",
              tutorNombre: "",
              tutorCedula: "",
              fecha: "",
            });
            
    
          } else {
            setError("Error al cargar los datos del usuario");
            // Set default data for development
            setData({
              firstName: "",
              secondName: "",
              firstLastName: "",
              secondLastName: "",
              id: "",
              email: "",
              phone: "",
              titulo: "",
              tutorNombre: "",
              tutorCedula: "",
              fecha: "",
            });
          }
    
        } catch (err) {
          setError("Error de conexión");
          console.error("Error fetching user data:", err);
          // Set default data for development
          setData({
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

  return (
    <Card sx={{ p: 3, boxShadow: "none", borderRadius: 3, minHeight: 320, background: "#f8fafc" }}>
      <MDTypography
        variant="h5"
        mb={2}
        display="flex"
        alignItems="center"
        fontWeight="bold"
        color="primary.main"
      >
        <FolderIcon sx={{ mr: 1 }} /> Recursos
      </MDTypography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={4} key={"Carta de Aprobacion (Tutor Metodológico)"}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              background: "#f8fafc",
              boxShadow: "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PictureAsPdfIcon sx={{ fontSize: 36, color: "#1976d2", mr: 1 }} />
              <MDTypography fontWeight="bold" fontSize={17} sx={{ flex: 1 }}>
                Carta de Aprobacion (Tutor Metodológico)
              </MDTypography>
              <Chip
                label={"PDF"}
                size="small"
                sx={{
                  ml: 1,
                  bgcolor: "#1976d2",
                  color: "white",
                  fontWeight: 700,
                }}
              />
            </Box>
            <MDTypography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
              Carta de Aprobacion de Tutor Metodologico
            </MDTypography>
            <Button
              size="small"
              variant="contained"
              sx={{ borderRadius: 2, fontWeight: 500, alignSelf: "flex-end", mt: "auto" }}
              onClick={() => {
                setOpen2(true), console.log(open2);
              }}
            >
              Descargar
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
                      label="Titulo del Proyecto"
                      name="titulo"
                      value={data.titulo}
                      onChange={handleDataChange}
                      fullWidth
                      error={!!validationErrors.titulo}
                      helperText={validationErrors.titulo}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Fecha de Aprobacion del Consejo"
                      name="fecha"
                      value={data.fecha}
                      onChange={handleDataChange}
                      fullWidth
                      error={!!validationErrors.fecha}
                      helperText={validationErrors.fecha}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Nombre del Tutor"
                      name="tutorNombre"
                      value={data.tutorNombre}
                      onChange={handleDataChange}
                      fullWidth
                      error={!!validationErrors.tutorNombre}
                      helperText={validationErrors.tutorNombre}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Cedula del Tutor"
                      name="tutorCedula"
                      value={data.tutorCedula}
                      onChange={handleDataChange}
                      fullWidth
                      error={!!validationErrors.tutorCedula}
                      helperText={validationErrors.tutorCedula}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CartaAprMetGenerator
                      data={{
                        nombre: data.nombre,
                        cedula: data.id,
                        carrera: carrera,
                        titulo: data.titulo,
                        tutorCedula: data.tutorCedula,
                        fecha: data.fecha,
                        tutorNombre: data.tutorNombre,
                      }}
                    ></CartaAprMetGenerator>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} key={"Carta de Aprobacion (Tutor Acedémico)"}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              background: "#f8fafc",
              boxShadow: "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PictureAsPdfIcon sx={{ fontSize: 36, color: "#1976d2", mr: 1 }} />
              <MDTypography fontWeight="bold" fontSize={17} sx={{ flex: 1 }}>
                Carta de Aprobacion (Tutor Acedémico)
              </MDTypography>
              <Chip
                label={"PDF"}
                size="small"
                sx={{
                  ml: 1,
                  bgcolor: "#1976d2",
                  color: "white",
                  fontWeight: 700,
                }}
              />
            </Box>
            <MDTypography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
              Carta de Aprobacion de Tutor Academico
            </MDTypography>
            <Button
              size="small"
              variant="contained"
              sx={{ borderRadius: 2, fontWeight: 500, alignSelf: "flex-end", mt: "auto" }}
              onClick={() => {
                setOpen(true), console.log(open);
              }}
            >
              Descargar
            </Button>

            <Modal
              open={open}
              onClose={handleClose}
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
                      label="Titulo del Proyecto"
                      name="titulo"
                      value={data.titulo}
                      onChange={handleDataChange}
                      fullWidth
                      error={!!validationErrors.titulo}
                      helperText={validationErrors.titulo}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Fecha de Aprobacion del Consejo"
                      name="fecha"
                      value={data.fecha}
                      onChange={handleDataChange}
                      fullWidth
                      error={!!validationErrors.fecha}
                      helperText={validationErrors.fecha}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Nombre del Tutor"
                      name="tutorNombre"
                      value={data.tutorNombre}
                      onChange={handleDataChange}
                      fullWidth
                      error={!!validationErrors.tutorNombre}
                      helperText={validationErrors.tutorNombre}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Cedula del Tutor"
                      name="tutorCedula"
                      value={data.tutorCedula}
                      onChange={handleDataChange}
                      fullWidth
                      error={!!validationErrors.tutorCedula}
                      helperText={validationErrors.tutorCedula}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CartaAprAcaGenerator
                      data={{
                        nombre: data.nombre,
                        cedula: data.id,
                        carrera: carrera,
                        titulo: data.titulo,
                        tutorCedula: data.tutorCedula,
                        fecha: data.fecha,
                        tutorNombre: data.tutorNombre,
                      }}
                    ></CartaAprAcaGenerator>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4} key={"Carta de Aprobacion (Asesor de Contenidos)"}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              background: "#f8fafc",
              boxShadow: "none",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PictureAsPdfIcon sx={{ fontSize: 36, color: "#1976d2", mr: 1 }} />
              <MDTypography fontWeight="bold" fontSize={17} sx={{ flex: 1 }}>
                Carta de Aprobacion (Asesor de Contenidos)
              </MDTypography>
              <Chip
                label={"PDF"}
                size="small"
                sx={{
                  ml: 1,
                  bgcolor: "#1976d2",
                  color: "white",
                  fontWeight: 700,
                }}
              />
            </Box>
            <MDTypography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
              Carta de Aprobacion (Asesor de Contenidos)
            </MDTypography>
            <Button
              size="small"
              variant="contained"
              sx={{ borderRadius: 2, fontWeight: 500, alignSelf: "flex-end", mt: "auto" }}
              onClick={() => {
                setOpen3(true), console.log(open3);
              }}
            >
              Descargar
            </Button>

            <Modal
              open={open3}
              onClose={handleClose3}
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
                      label="Titulo del Proyecto"
                      name="titulo"
                      value={data.titulo}
                      onChange={handleDataChange}
                      fullWidth
                      error={!!validationErrors.titulo}
                      helperText={validationErrors.titulo}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Fecha de Aprobacion del Consejo"
                      name="fecha"
                      value={data.fecha}
                      onChange={handleDataChange}
                      fullWidth
                      error={!!validationErrors.fecha}
                      helperText={validationErrors.fecha}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Nombre del Tutor"
                      name="tutorNombre"
                      value={data.tutorNombre}
                      onChange={handleDataChange}
                      fullWidth
                      error={!!validationErrors.tutorNombre}
                      helperText={validationErrors.tutorNombre}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Cedula del Tutor"
                      name="tutorCedula"
                      value={data.tutorCedula}
                      onChange={handleDataChange}
                      fullWidth
                      error={!!validationErrors.tutorCedula}
                      helperText={validationErrors.tutorCedula}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CartaAprAseGenerator
                      data={{
                        nombre: data.nombre,
                        cedula: data.id,
                        carrera: carrera,
                        titulo: data.titulo,
                        tutorCedula: data.tutorCedula,
                        fecha: data.fecha,
                        tutorNombre: data.tutorNombre,
                      }}
                    ></CartaAprAseGenerator>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Paper>
        </Grid>
        {resources.map((r) => (
          <Grid item xs={12} sm={6} md={4} key={r.name}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                background: "#f8fafc",
                boxShadow: "none",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                {r.type === "PDF" ? (
                  <PictureAsPdfIcon sx={{ fontSize: 36, color: "#1976d2", mr: 1 }} />
                ) : (
                  <FolderIcon sx={{ fontSize: 36, color: "primary.main", mr: 1 }} />
                )}
                <MDTypography fontWeight="bold" fontSize={17} sx={{ flex: 1 }}>
                  {r.name}
                </MDTypography>
                <Chip
                  label={r.type}
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor:
                      r.type === "PDF"
                        ? "#1976d2"
                        : r.type === "XLS"
                        ? "#43a047"
                        : r.type === "DOC"
                        ? "#ff9800"
                        : "primary.light",
                    color: "white",
                    fontWeight: 700,
                  }}
                />
              </Box>
              <MDTypography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
                {r.description}
              </MDTypography>
              <Button
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<DownloadIcon />}
                size="small"
                variant="contained"
                sx={{ borderRadius: 2, fontWeight: 500, alignSelf: "flex-end", mt: "auto" }}
              >
                Descargar
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}

Recursos.propTypes = {
  carrera: PropTypes.sting
};

export default Recursos; 