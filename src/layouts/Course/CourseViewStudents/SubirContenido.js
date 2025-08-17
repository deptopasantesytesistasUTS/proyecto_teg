import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  Paper,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { backendUrl } from "config";
import ProtocoloGenerator from "layouts/students/data/generateTitlesPDF";

// Fechas límite de entregas de borradores




// Mock function to simulate backend calls
const mockBackend = {
  getSelectedTitle: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return null if no title selected yet
        resolve(null);
        // To test with a selected title, use:
        // resolve("Plataforma de Tutorías Online");
      }, 500);
    });
  },
  submitTitleProposals: async (proposals) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Proposals submitted:", proposals);
        resolve({ success: true });
      }, 1000);
    });
  },
  getProposalUrl: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return null if no URL submitted yet
        resolve(null);
        // To test with a submitted URL, use:
        // resolve("https://example.com/proposal-document.pdf");
      }, 500);
    });
  },
  submitProposalUrl: async (url) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("URL submitted:", url);
        resolve({ success: true });
      }, 1000);
    });
  },
};


 

function SubirContenido({ idMateria, categoria }) {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState({});
  const [currentSemester, setCurrentSemester] = useState(null);
  const [entregas, setEntregas] = useState([
    { nombre: "1", fechaLimite: "" },
    { nombre: "2", fechaLimite: "" },
    { nombre: "3", fechaLimite: "" },
    { nombre: "4", fechaLimite: "" },
  ]);

    const fetchUserData = async () => {
      try {
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
  
        const response = await fetch(`${backendUrl}/estudiante/profile/${userId}/${idMateria}`, {
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
      }
    };


    useEffect(() => {
        fetchUserData();
      }, []);

  const handleGetCurrentSemester = async () => {
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];
    const response = await fetch(`${backendUrl}/actLapso/${currentDate}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
     
      setCurrentSemester({
        id: data.semester.id,
        startDate: data.semester.startDate,
        endDate: data.semester.endDate,
        titleDeliveryDate: data.semester.titleDeliveryDate,
        firstDraftDate: data.semester.firstDraftDate,
        secondDraftDate: data.semester.secondDraftDate,
        thirdDraftDate: data.semester.thirdDraftDate,
        finalDraftDate: data.semester.finalDraftDate,
        cartaDate: data.semester.cartaDate,
        inv2Borrador1: data.semester.inv2Borrador1,
        inv2Borrador2: data.semester.inv2Borrador2,
        inv2Borrador3: data.semester.inv2Borrador3,
        inv2Borrador4: data.semester.inv2Borrador4,
        inv2BorradorFinal: data.semester.inv2BorradorFinal,
        tutInicio: data.semester.tutInicio,
        tutFinal: data.semester.tutFinal,
        urlCronograma: data.semester.urlCronograma,
      });

      console.log(categoria)

       if (categoria === "investigacion_II") {
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
       }
       else if (categoria === "Trabajo_Especial_de_Grado") {
         setEntregas([
           { nombre: "Entrega Instrumento 1", fechaLimite: data.semester.titleDeliveryDate },
           { nombre: "Entrega Instrumento 2", fechaLimite: data.semester.titleDeliveryDate },
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

  useEffect(() => {
    handleGetCurrentSemester();
  }, []);

  // State for title proposals
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [proposalsSubmitted, setProposalsSubmitted] = useState(false);
  const [proposalUrl, setProposalUrl] = useState(null);

  // State for new proposals form
  const [proposals, setProposals] = useState([
    {
      title: "",
      researchLine: "",
      purpose: "",
      placeName: "",
      placeAddress: "",
      placePhone: "",
      placeMobile: "",
    },
    {
      title: "",
      researchLine: "",
      purpose: "",
      placeName: "",
      placeAddress: "",
      placePhone: "",
      placeMobile: "",
    },
    {
      title: "",
      researchLine: "",
      purpose: "",
      placeName: "",
      placeAddress: "",
      placePhone: "",
      placeMobile: "",
    },
  ]);

  // Estado para enlaces subidos por entrega
  const [enlacesEntregados, setEnlacesEntregados] = useState({}); // { nombreEntrega: enlace }
  const [enlacesIngresados, setEnlacesIngresados] = useState({}); // { nombreEntrega: string }
  const [enlacesValidos, setEnlacesValidos] = useState({}); // { nombreEntrega: string }
  const [subiendo, setSubiendo] = useState({}); // { nombreEntrega: boolean }

  const now = new Date();
  const isVencida = (fechaLimite) => new Date(fechaLimite) < now;
  const formatoFecha = (fechaLimite) => {
    const fecha = new Date(fechaLimite);
    return fecha.toLocaleString("es-VE", { dateStyle: "medium", timeStyle: "short" });
  };

  // State for URL submission
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");

  // UI state
  const [loading, setLoading] = useState({
    selectedTitle: true,
    proposalUrl: true,
    submitting: false,
    submittingUrl: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    content: "",
    onConfirm: () => {},
  });

  // Load data from backend on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get selected title
        const title = await mockBackend.getSelectedTitle();
        setSelectedTitle(title);

        handleGetProposals();

        // Check if proposals were already submitted (if no title selected but proposals exist)
        setProposalsSubmitted(title === null && proposals.some((p) => p.title !== ""));

        // Get proposal URL
        const url = await mockBackend.getProposalUrl();
        setProposalUrl(url);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error al cargar los datos",
          severity: "error",
        });
      } finally {
        setLoading((prev) => ({ ...prev, selectedTitle: false, proposalUrl: false }));
      }
    };

    loadData();
  }, []);

  // Handlers for proposal form
  const handleProposalChange = (index, field, value) => {
    const newProposals = [...proposals];
    newProposals[index][field] = value;
    setProposals(newProposals);
  };

  const validateProposals = () => {
    return proposals.every(
      (p) => p.title.trim() !== "" && p.researchLine.trim() !== "" && p.purpose.trim() !== ""
    );
  };

  const handleGetProposals = async () => {
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
      const response = await fetch(`${backendUrl}/estudiante/titulos/${userId}/${idMateria}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      console.log(response)
      const data = await response.json();

      console.log("API Response:", data);
      console.log(response.ok);
      if (response.ok) {
        setProposalsSubmitted(data)
        // Si la respuesta es un array directamente
        setSnackbar({
          open: true,
          message: "Titulos Recibidos",
          severity: "success",
        });
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Error al enviar las propuestas",
        severity: "error",
        
      });
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  }

  const handleSubmitProposals = () => {
    if (!validateProposals()) {
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
        "¿Está seguro que desea enviar estas propuestas? Una vez enviadas no podrán ser modificadas.",
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, open: false }));
        setLoading((prev) => ({ ...prev, submitting: true }));

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
          const response = await fetch(`${backendUrl}/estudiante/titulos`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              info: proposals,
              user: userId,
              idMateria: idMateria,
            }),
          });
          console.log(response)
          const data = await response.json();

          console.log("API Response:", data);
          console.log(response.ok);
          if (response.ok) {
            // Si la respuesta es un array directamente
            setSnackbar({
              open: true,
              message: "Titulos Recibidos",
              severity: "success",
            });
          }
        } catch (error) {
          console.error(error);
          setSnackbar({
            open: true,
            message: "Error al enviar las propuestas",
            severity: "error",
            
          });
        } finally {
          setLoading((prev) => ({ ...prev, submitting: false }));
        }
      },
    });
  };


    const handleSubmitEnlaces = () => {
      if (!validateProposals()) {
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
          "¿Está seguro que desea enviar estas propuestas? Una vez enviadas no podrán ser modificadas.",
        onConfirm: async () => {
          setConfirmDialog((prev) => ({ ...prev, open: false }));
          setLoading((prev) => ({ ...prev, submitting: true }));

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
            const response = await fetch(`${backendUrl}/estudiante/titulos`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                info: enlacesIngresados,
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
            setLoading((prev) => ({ ...prev, submitting: false }));
          }
        },
      });
    };

  // Handlers for URL submission
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setUrlInput(url);

    if (url && !validateUrl(url)) {
      setUrlError("URL inválida");
    } else {
      setUrlError("");
    }
  };

  const handleSubmitUrl = async () => {
    if (urlError || !urlInput) {
      setSnackbar({
        open: true,
        message: "Por favor ingrese una URL válida",
        severity: "error",
      });
      return;
    }

    setLoading((prev) => ({ ...prev, submittingUrl: true }));

    try {
      await mockBackend.submitProposalUrl(urlInput);
      setProposalUrl(urlInput);
      setUrlInput("");
      setSnackbar({
        open: true,
        message: "URL enviada correctamente",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al enviar la URL",
        severity: "error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, submittingUrl: false }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
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

      {/* Title Proposals Section */}
      {
        categoria !== "Trabajo_Especial_de_Grado" ? (
          <Paper sx={{ flex: 1, p: 3, borderRadius: 3, boxShadow: 3, minWidth: 320 }}>
            <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: "rgb(25, 118, 210)" }}>
              Propuestas de Título
            </Typography>

            {loading.selectedTitle ? (
              <Typography>Cargando...</Typography>
            ) : selectedTitle ? (
              <>
                <Typography variant="subtitle1" mb={2}>
                  Título seleccionado:
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontWeight={600}>{selectedTitle}</Typography>
                  <Chip label="Aceptado" color="success" size="small" />
                </Box>
              </>
            ) : proposalsSubmitted ? (
              <>
                <Typography variant="subtitle1" mb={2}>
                  Ya has enviado tus 3 propuestas de título. Espera la selección.
                </Typography>
                <Stack mt={2} px={5} spacing={3}>
                  <ProtocoloGenerator
                    studentData={{
                      nombre1: userData.nombre1,
                      nombre2: userData.nombre2,
                      apellido1: userData.apellido1,
                      apellido2: userData.apellido2,
                      cedula: userData.cedula,
                      telf: userData.telf,
                      correo: userData.correo,
                      docente: userData.docente,
                      carrera: userData.carrera,
                      lapso: userData.lapso,
                    }}
                    numero={1}
                    titleInfo={proposalsSubmitted[0]}
                  ></ProtocoloGenerator>
                  <ProtocoloGenerator
                    studentData={{
                      nombre1: userData.nombre1,
                      nombre2: userData.nombre2,
                      apellido1: userData.apellido1,
                      apellido2: userData.apellido2,
                      cedula: userData.cedula,
                      telf: userData.telf,
                      correo: userData.correo,
                      docente: userData.docente,
                      carrera: userData.carrera,
                      lapso: userData.lapso,
                    }}
                    numero={2}
                    titleInfo={proposalsSubmitted[1]}
                  ></ProtocoloGenerator>
                  <ProtocoloGenerator
                    studentData={{
                      nombre1: userData.nombre1,
                      nombre2: userData.nombre2,
                      apellido1: userData.apellido1,
                      apellido2: userData.apellido2,
                      cedula: userData.cedula,
                      telf: userData.telf,
                      correo: userData.correo,
                      docente: userData.docente,
                      carrera: userData.carrera,
                      lapso: userData.lapso,
                    }}
                    numero={3}
                    titleInfo={proposalsSubmitted[2]}
                  ></ProtocoloGenerator>
                </Stack>

                {/* URL Submission Section */}
                <Divider sx={{ my: 2 }} />

                {proposalUrl ? (
                  <Box mb={2}>
                    <Typography variant="body1" mb={1}>
                      Documento actual:
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <a href={proposalUrl} target="_blank" rel="noopener noreferrer">
                        {proposalUrl}
                      </a>
                    </Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => setProposalUrl(null)}
                    >
                      Cambiar documento
                    </Button>
                  </Box>
                ) : (
                  /*(
              <Box>
                <TextField
                  label="URL del documento"
                  value={urlInput}
                  onChange={handleUrlChange}
                  placeholder="https://drive.google.com/..."
                  fullWidth
                  margin="normal"
                  error={!!urlError}
                  helperText={urlError}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitUrl}
                  disabled={!!urlError || !urlInput || loading.submittingUrl}
                >
                  {loading.submittingUrl ? "Enviando..." : "Enviar Documento"}
                </Button>
              </Box>
            )*/ <></>
                )}
              </>
            ) : (
              <>
                <Typography variant="subtitle1" mb={3}>
                  Ingresa 3 propuestas de título con su respectiva línea de investigación y
                  propósito.
                </Typography>

                <Stack spacing={3}>
                  {proposals.map((proposal, index) => (
                    <Paper key={index} elevation={2} sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle2"
                        mb={2}
                        fontWeight={600}
                        sx={{ color: "rgb(25, 118, 210)" }}
                      >
                        Propuesta {index + 1}
                      </Typography>

                      <TextField
                        label="Título tentativo"
                        value={proposal.title}
                        onChange={(e) => handleProposalChange(index, "title", e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                      />

                      <TextField
                        label="Línea de investigación"
                        value={proposal.researchLine}
                        onChange={(e) =>
                          handleProposalChange(index, "researchLine", e.target.value)
                        }
                        fullWidth
                        margin="normal"
                        required
                      />

                      <TextField
                        label="Propósito de la investigación"
                        value={proposal.purpose}
                        onChange={(e) => handleProposalChange(index, "purpose", e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        required
                      />

                      <TextField
                        label="Lugar"
                        value={proposal.placeName}
                        onChange={(e) => handleProposalChange(index, "placeName", e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                      />

                      <TextField
                        label="DIreccion del lugar"
                        value={proposal.placeAddress}
                        onChange={(e) =>
                          handleProposalChange(index, "placeAddress", e.target.value)
                        }
                        fullWidth
                        margin="normal"
                        required
                      />

                      <TextField
                        label="Telefono:"
                        value={proposal.placePhone}
                        onChange={(e) => handleProposalChange(index, "placePhone", e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                      />

                      <TextField
                        label="Telefono Movil"
                        value={proposal.placeMobile}
                        onChange={(e) => handleProposalChange(index, "placeMobile", e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                      />
                    </Paper>
                  ))}
                </Stack>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitProposals}
                  disabled={!validateProposals() || loading.submitting}
                  sx={{ mt: 3 }}
                >
                  {loading.submitting ? "Enviando..." : "Enviar Propuestas"}
                </Button>
              </>
            )}
          </Paper>
        ) : null // O puedes usar <></>
      }

      {/* Sección Borradores tipo Google Classroom */}

      <Paper sx={{ flex: 1, p: 3, borderRadius: 3, boxShadow: 3, minWidth: 340 }}>
        <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: "rgb(25, 118, 210)" }}>
          Entregas de Borradores
        </Typography>
        <List>
          {entregas.map((entrega, idx) => {
            const vencida = isVencida(entrega.fechaLimite);
            const entregado = enlacesEntregados[entrega.nombre];
            return (
              <ListItem
                key={entrega.nombre}
                alignItems="flex-start"
                sx={{
                  flexDirection: "column",
                  alignItems: "stretch",
                  mb: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  p: 2,
                  bgcolor: vencida && !entregado ? "#fff3f3" : "background.paper",
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography fontWeight={600} sx={{ color: "rgb(25, 118, 210)" }}>
                    {entrega.nombre}
                  </Typography>
                  <Chip
                    label={
                      vencida ? (entregado ? "Entregado fuera de tiempo" : "Vencida") : "A tiempo"
                    }
                    color={vencida ? (entregado ? "warning" : "error") : "success"}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: "rgb(25, 118, 210)" }} mb={1}>
                  Fecha límite: {formatoFecha(entrega.fechaLimite)}
                </Typography>
                {entregado ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip label="Enlace entregado" color="info" size="small" />
                    <a
                      href={enlacesEntregados[entrega.nombre]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ wordBreak: "break-all" }}
                    >
                      {enlacesEntregados[entrega.nombre]}
                    </a>
                    <Typography variant="caption" color={vencida ? "error.main" : "success.main"}>
                      {vencida ? "Entregado fuera de tiempo" : "Entregado a tiempo"}
                    </Typography>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center" gap={2}>
                    <TextField
                      label="Enlace de entrega"
                      value={enlacesIngresados[entrega.nombre] || ""}
                      onChange={(e) => handleEnlaceChange(entrega.nombre, e.target.value)}
                      placeholder="https://..."
                      size="small"
                      sx={{ flex: 1 }}
                      disabled={vencida || subiendo[entrega.nombre]}
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleSubmitEnlaces}
                      disabled={
                        !(
                          enlacesIngresados[entrega.nombre] &&
                          enlacesIngresados[entrega.nombre].startsWith("http")
                        ) ||
                        vencida ||
                        subiendo[entrega.nombre]
                      }
                    >
                      {subiendo[entrega.nombre] ? "Subiendo..." : "Subir"}
                    </Button>
                  </Box>
                )}
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}

SubirContenido.propTypes = {
  idMateria: PropTypes.any,
  categoria: PropTypes.any
};

export default SubirContenido;
