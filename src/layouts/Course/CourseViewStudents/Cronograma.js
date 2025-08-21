import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
  useMediaQuery,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useEffect } from "react";
import { backendUrl } from "config";
import PropTypes from "prop-types";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Declaración de VisuallyHiddenInput fuera de la función y con sintaxis válida
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function Cronograma({categoria, idMateria}) {
  const [archivo, setArchivo] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [archivoSubido, setArchivoSubido] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [descripcionSubida, setDescripcionSubida] = useState("");
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const [entregas, setEntregas] = useState([
      { nombre: "1", fechaLimite: "" },
      { nombre: "2", fechaLimite: "" },
      { nombre: "3", fechaLimite: "" },
      { nombre: "4", fechaLimite: "" },
    ]);

    

    const handleCloseSnackbar = () => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    };


  const handleGetLinks = async () => {
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
        console.log(user.userId);
        const userId = user.userId; // You might need to adjust this based on your auth system
        const response = await fetch(`${backendUrl}/estudiante/archivos/${userId}/${idMateria}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        console.log(response);
        const data = await response.json();
  
        console.log("API Response Enlaces:", data);
        console.log("jajajajajajjaja");
        console.log(response.ok);
        if (response.ok) {
          setEnlacesEntregados(data);
          const objetoEnlace = data?.find((enlace) => enlace["Carga Academica"]);
          setArchivoCargaSubido(objetoEnlace ? objetoEnlace["Carga Academica"] : undefined);
          // Si la respuesta es un array directamente
          console.log(enlacesEntregados);
          console.log(archivoCarga)
        }
      } catch (error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Error en la conexion para archivos",
          severity: "error",
        });
      } finally {
      }
    };

  const [pdfUrl, setpdfUrl] = useState("")

  // Estado para archivo de carga académica
  const [archivoCarga, setArchivoCarga] = React.useState(null);
  const [archivoCargaSubido, setArchivoCargaSubido] = React.useState(null);
  const [subiendoCarga, setSubiendoCarga] = React.useState(false);

    const [confirmDialog, setConfirmDialog] = useState({
      open: false,
      title: "",
      content: "",
      onConfirm: () => {},
    });

    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
    });


  // Define la fecha límite para carga académica
  const fechaLimiteCarga = "2026-06-05T23:59";
  const formatoFecha = (fechaLimite) => {
    const fecha = new Date(fechaLimite);
    return fecha.toLocaleString("es-VE", { dateStyle: "medium", timeStyle: "short" , timeZone:"UTC"});
  };
  const vencidaCarga = new Date(fechaLimiteCarga) < new Date();

  const handleGetCurrentSemester = async () => {
      const today = new Date();
      const currentDate = today.toISOString().split("T")[0];
      const response = await fetch(`${backendUrl}/actLapso/${currentDate}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        const data = await response.json();
  
        console.log(categoria)
  
         if (categoria === "investigacion_II") {
           setEntregas([
             {
               descripcion: "Protocolo de Investigación 1",
               fechaLimite: data.semester.titleDeliveryDate,
             },
             {
               descripcion: "Protocolo de Investigación 2",
               fechaLimite: data.semester.titleDeliveryDate,
             },
             {
               descripcion: "Protocolo de Investigación 3",
               fechaLimite: data.semester.titleDeliveryDate,
             },
             { descripcion: "Capitulo 1", fechaLimite: data.semester.inv2Borrador1 },
             { descripcion: "Carta Empresarial", fechaLimite: data.semester.cartaDate },
             { descripcion: "Capitulo 2", fechaLimite: data.semester.inv2Borrador2 },
             { descripcion: "Capitulo 3", fechaLimite: data.semester.inv2Borrador3 },
             {
               descripcion: "Instrumentos de Investigaccion",
               fechaLimite: data.semester.inv2Borrador4,
             },
             
           ]);
           setpdfUrl(data.semester.urlCronograma2);
         } else if (categoria === "Trabajo_Especial_de_Grado") {
           setEntregas([
             { descripcion: "Entrega Instrumento 1", fechaLimite: data.semester.fechaEntInst },
             { descripcion: "Entrega Instrumento 2", fechaLimite: data.semester.fechaEntInst },
             { descripcion: "Entrega de Propuesta", fechaLimite: data.semester.firstDraftDate },
             {
               descripcion: "Informe Completo",
               fechaLimite: data.semester.secondDraftDate,
             },
             {
               descripcion: "Tomo Completo (Correciones Predefensa)",
               fechaLimite: data.semester.thirdDraftDate,
             },
             { descripcion: "Entrega de Diapositivas", fechaLimite: data.semester.finalDraftDate },
             
           ]);
           setpdfUrl(data.semester.urlCronograma);
         } else {
           setEntregas([
             { descripcion: "Fecha Inicio", fechaLimite: data.semester.tutInicio },
             { descripcion: "Fecha Clase Semana 1", fechaLimite: "2025-08-24T00:00:00.000Z" },
             { descripcion: "Fecha Clase Semana 2", fechaLimite: "2025-09-31T08:00:00.000Z" },
             { descripcion: "Fecha Clase Semana 3", fechaLimite: "2025-09-07T08:00:00.000Z" },
             { descripcion: "Fecha Clase Semana 4", fechaLimite: "2025-09-14T08:00:00.000Z" },
             { descripcion: "Fecha Clase Semana 5", fechaLimite: "2025-09-21T08:00:00.000Z" },
             { descripcion: "Fecha Clase Semana 6", fechaLimite: "2025-09-28T08:00:00.000Z" },
             { descripcion: "Fecha Clase Semana 7", fechaLimite: "2025-10-04T08:00:00.000Z" },
             { descripcion: "Fecha Clase Semana 8", fechaLimite: "2025-10-11T08:00:00.000Z" },
             { descripcion: "Fecha Fin", fechaLimite: "2025-10-15T00:00:00.000Z" },
           ]);
         }
        
      }
    };

    useEffect(() => {
        handleGetCurrentSemester();
        handleGetLinks();
      }, []);


    const validateLinkStructure = (value) => {
      try {
        new URL(value);
        return true;
      } catch (e) {
        return false;
      }
    };
  
    const [errors, setErrors] = useState({});
  
    const handleEnlaceChange = (nombreEntrega, enlace) => {
      let error = "";
      let errorBool = false;
  
      if (enlace && !validateLinkStructure(enlace)) {
        error = "Enlace Invalido";
        errorBool = true;
      } else {
        errorBool = false;
      }
  
      if (errorBool) {
        setSnackbar({
          open: true,
          message: error,
          severity: "error",
        });
      }
  
      setErrors((prev) => ({ ...prev, [nombreEntrega]: error }));
  
      handleFormChange(nombreEntrega, enlace);
    };
  
    const handleFormChange = (field, value) => {
        setEnlacesIngresados((prev) => ({ ...prev, [field]: value }));
  
    };

    const [enlacesEntregados, setEnlacesEntregados] = useState({}); // { nombreEntrega: enlace }
      const [enlacesIngresados, setEnlacesIngresados] = useState({}); // { nombreEntrega: string }


    const handleSubmitEnlaces = (enlace,nombre) => {
      if (!validateLinkStructure(enlace)) {
              setSnackbar({
                open: true,
                message: "Todos los campos deben estar completos",
                severity: "error",
              });
              return;
            }
      
            setConfirmDialog({
              open: true,
              title: "Confirmar envío de propuestas",
              content:
                "¿Está seguro que desea enviar este enlace",
              onConfirm: async () => {
                setConfirmDialog((prev) => ({ ...prev, open: false }));
                setSubiendo(true)
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
                  console.log(user.userId);
                  const userId = user.userId; // You might need to adjust this based on your auth system
                  const response = await fetch(`${backendUrl}/estudiante/archivos`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      nombre: nombre,
                      enlace: enlacesIngresados[nombre],
                      user: userId,
                      idMateria: idMateria,
                    }),
                  });
                  console.log(response);
                  const data = await response.json();
      
                  console.log("API Response:", data);
                  console.log(response.ok);
                  if (response.ok) {
                    // Si la respuesta es un array directamente
                    setSnackbar({
                      open: true,
                      message: "Archivos subidos",
                      severity: "success",
                    });
                  }
                } catch (error) {
                  console.error(error);
                  setSnackbar({
                    open: true,
                    message: "Error al enviar los enlaces",
                    severity: "error",
                  });
                } finally {
                  setSubiendo(false);
                }
              },
            });
    }

  return (
    <Box
      maxWidth={1200}
      mx="auto"
      py={{ xs: 2, md: 4 }}
      px={{ xs: 1, md: 2 }}
      sx={{
        background: "#fff",
        borderRadius: { xs: 0, md: 4 },
        boxShadow: { xs: "none", md: "0 4px 24px 0 rgba(31, 38, 135, 0.08)" },
        minHeight: 400,
      }}
    >
      <Paper>
        <Stack
          direction={isMdUp ? "row" : "column"}
          spacing={4}
          alignItems={isMdUp ? "stretch" : "center"}
          justifyContent="center"
          sx={{ width: "100%" }}
        >
          {/* Stack vertical para subir y descargar cronograma */}
          <Stack direction="column" spacing={3} sx={{ minWidth: 340, flex: 1 }}>
            {/* Caja: Subir carga académica */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                minWidth: 100,
                bgcolor: vencidaCarga && !archivoCargaSubido ? "#fff3f3" : "background.paper",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                mb={2}
                sx={{ color: "rgb(25, 118, 210)" }}
                align="center"
              >
                Subir carga académica
              </Typography>
              <Typography variant="body2" sx={{ color: "rgb(25, 118, 210)" }} mb={1}>
                Fecha límite: {formatoFecha(fechaLimiteCarga)}
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <TextField
                  label="Enlace de entrega"
                  value={enlacesIngresados["Carga Academica"] || ""}
                  onChange={(e) => handleEnlaceChange("Carga Academica", e.target.value)}
                  placeholder="https://..."
                  size="small"
                  sx={{ flex: 1 }}
                  disabled={vencidaCarga || subiendoCarga}
                  error={!!errors["Carga Academica"]}
                  helperText={errors["Carga Academica"]}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() =>
                    handleSubmitEnlaces(enlacesIngresados["Carga Academica"], "Carga Academica")
                  }
                  disabled={
                    !(
                      enlacesIngresados["Carga Academica"] &&
                      enlacesIngresados["Carga Academica"].startsWith("http")
                    ) ||
                    vencidaCarga ||
                    subiendoCarga
                  }
                >
                  {subiendoCarga ? "Subiendo..." : "Subir"}
                </Button>
              </Box>
              {archivoCargaSubido && (
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Button variant="outlined" href={archivoCargaSubido}>
                    {" "}
                    Ver Archivo
                  </Button>
                  <Typography variant="caption" color="success.main">
                    Entregado
                  </Typography>
                </Box>
              )}
            </Paper>
            {/* Caja: Descargar cronograma (PDF) */}
            <Paper
              sx={{
                p: 3,
                mt: 10,
                minWidth: 180,
                maxWidth: 260,
                boxShadow: "none",
                bgcolor: "background.paper",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                mb={2}
                sx={{ color: "rgb(25, 118, 210)" }}
                align="center"
              >
                Descargar cronograma
              </Typography>
              <Button
                component="a"
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 1, width: "100%", height: "150%" }}
              >
                (PDF)
              </Button>
            </Paper>
          </Stack>

          {/* Entregas y fechas */}
          <Paper
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              boxShadow: "0 2px 12px 0 rgba(25, 118, 210, 0.08)",
              minWidth: 340,
              width: "100%",
              maxWidth: 500,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: { xs: 320, md: 420 },
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              mb={2}
              sx={{ color: "rgb(25, 118, 210)" }}
              align="center"
            >
              Entregas y Fechas
            </Typography>
            <Divider
              sx={{ my: 2, bgcolor: "primary.main", height: 3, borderRadius: 2, width: "80%" }}
            />
            <List
              sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 1, width: "100%" }}
            >
              {entregas.map((e, idx) => (
                <ListItem key={idx} divider={idx < entregas.length - 1} sx={{ py: 2 }}>
                  <ListItemText
                    primary={
                      <b style={{ color: "rgb(25, 118, 210)" }}>
                        {" "}
                        Fecha límite: {formatoFecha(e.fechaLimite)}
                      </b>
                    }
                    secondary={e.descripcion}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: 18 }}
                    secondaryTypographyProps={{ color: "text.secondary", fontSize: 16 }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Stack>
      </Paper>
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

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}>
            Cancelar
          </Button>
          <Button onClick={confirmDialog.onConfirm} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

Cronograma.propTypes = {
  idMateria: PropTypes.any,
  categoria: PropTypes.any
};

export default Cronograma; 