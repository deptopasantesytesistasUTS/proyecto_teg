/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// @mui icons
import Icon from "@mui/material/Icon";

import { backendUrl } from "config";
import { Button } from "@mui/material";

function SemesterConfig() {
  const [currentSemester, setCurrentSemester] = useState(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [cronogramaB, setCronogramaB] = useState(false)

  // Form states for new semester
  const [newSemester, setNewSemester] = useState({
    id: "",
    startDate: "",
    endDate: "",
    titleDeliveryDate: "",
    firstDraftDate: "",
    secondDraftDate: "",
    thirdDraftDate: "",
    finalDraftDate: "",
    cartaDate: "",
    inv2Borrador1: "",
    inv2Borrador2: "",
    inv2Borrador3: "",
    inv2Borrador4: "",
    inv2BorradorFinal: "",
    tutInicio: "",
    tutFinal: "",
    urlCronograma: "",
  });

  // Form states for editing semester
  const [editSemester, setEditSemester] = useState({
    id: "",
    startDate: "",
    endDate: "",
    titleDeliveryDate: "",
    firstDraftDate: "",
    secondDraftDate: "",
    thirdDraftDate: "",
    finalDraftDate: "",
    cartaDate: "",
    inv2Borrador1: "",
    inv2Borrador2: "",
    inv2Borrador3: "",
    inv2Borrador4: "",
    inv2BorradorFinal: "",
    tutInicio: "",
    tutFinal: "",
    urlCronograma: "",
  });

  

  // Validation states
  const [errors, setErrors] = useState({});

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const validateLinkStructure = (value) => {
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleEnlaceChange = (formType,nombreEntrega, enlace) => {
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

    handleFormChange(formType, nombreEntrega, enlace);
  };

  // Validate dates
  const validateDates = (semesterData, isEdit = false, originalData = null) => {
    const newErrors = {};
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];

    // If editing, only validate dates that have changed
    if (isEdit && originalData) {
      Object.keys(semesterData).forEach((key) => {
        // Skip validation for dates that haven't changed
        if (semesterData[key] === originalData[key]) {
          return;
        }
        
        // Only validate if the date has a value and has changed
        if (semesterData[key] && semesterData[key] !== originalData[key]) {
          if (semesterData[key] < currentDate) {
            newErrors[key] = "No se puede seleccionar una fecha que ya pasó";
          }
        }
      });

      // Check if start date is before end date (only if either has changed)
      if (
        semesterData.startDate !== originalData.startDate ||
        semesterData.endDate !== originalData.endDate
      ) {
        if (
          semesterData.startDate &&
          semesterData.endDate &&
          semesterData.startDate >= semesterData.endDate
        ) {
          newErrors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio";
        }
      }

      // Check if title delivery is within semester dates (only if relevant dates changed)
      if (
        semesterData.titleDeliveryDate !== originalData.titleDeliveryDate ||
        semesterData.startDate !== originalData.startDate ||
        semesterData.endDate !== originalData.endDate
      ) {
        if (semesterData.startDate && semesterData.endDate && semesterData.titleDeliveryDate) {
          if (
            semesterData.titleDeliveryDate < semesterData.startDate ||
            semesterData.titleDeliveryDate > semesterData.endDate
          ) {
            newErrors.titleDeliveryDate =
              "La fecha de entrega de títulos debe estar dentro del lapso académico";
          }
        }
      }

      // Check if draft dates are in logical order (only if any draft date changed)
      const draftDateFields = [
        'firstDraftDate', 'secondDraftDate', 'thirdDraftDate', 'finalDraftDate',
        'inv2Borrador1', 'inv2Borrador2', 'inv2Borrador3', 'inv2Borrador4', 'inv2BorradorFinal',
      ];
      
      const hasDraftDateChanged = draftDateFields.some(field => 
        semesterData[field] !== originalData[field]
      );

      if (hasDraftDateChanged) {
        // Validate Trabajo de Grado draft dates
        const tgDraftDates = [
          semesterData.firstDraftDate,
          semesterData.secondDraftDate,
          semesterData.thirdDraftDate,
          semesterData.finalDraftDate,
        ].filter((date) => date);

        for (let i = 0; i < tgDraftDates.length - 1; i++) {
          if (tgDraftDates[i] >= tgDraftDates[i + 1]) {
            const nextDateField = Object.keys(semesterData).find((key) => 
              semesterData[key] === tgDraftDates[i + 1]
            );
            if (nextDateField) {
              newErrors[nextDateField] = "Las fechas de borradores deben estar en orden cronológico";
            }
            break;
          }
        }

        // Validate Investigación 2 draft dates
        const inv2DraftDates = [
          semesterData.inv2Borrador1,
          semesterData.inv2Borrador2,
          semesterData.inv2Borrador3,
          semesterData.inv2Borrador4,
          semesterData.inv2BorradorFinal,
        ].filter((date) => date);

        for (let i = 0; i < inv2DraftDates.length - 1; i++) {
          if (inv2DraftDates[i] >= inv2DraftDates[i + 1]) {
            const nextDateField = Object.keys(semesterData).find((key) => 
              semesterData[key] === inv2DraftDates[i + 1]
            );
            if (nextDateField) {
              newErrors[nextDateField] = "Las fechas de borradores de Investigación 2 deben estar en orden cronológico";
            }
            break;
          }
        }

        // Validate Tutorías report dates
        const tutReportDates = [
          semesterData.tutInicio,
          semesterData.tutFinal,
        ].filter((date) => date);

        for (let i = 0; i < tutReportDates.length - 1; i++) {
          if (tutReportDates[i] >= tutReportDates[i + 1]) {
            const nextDateField = Object.keys(semesterData).find((key) => 
              semesterData[key] === tutReportDates[i + 1]
            );
            if (nextDateField) {
              newErrors[nextDateField] = "Las fechas de informes de tutorías deben estar en orden cronológico";
            }
            break;
          }
        }
      }
    } else {
      // For new semester creation, validate all dates
    Object.keys(semesterData).forEach((key) => {
      if (semesterData[key] && semesterData[key] < currentDate) {
        newErrors[key] = "No se puede seleccionar una fecha que ya pasó";
      }
    });

    // Check if start date is before end date
    if (
      semesterData.startDate &&
      semesterData.endDate &&
      semesterData.startDate >= semesterData.endDate
    ) {
      newErrors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio";
    }

    // Check if title delivery is within semester dates
    if (semesterData.startDate && semesterData.endDate && semesterData.titleDeliveryDate) {
      if (
        semesterData.titleDeliveryDate < semesterData.startDate ||
        semesterData.titleDeliveryDate > semesterData.endDate
      ) {
        newErrors.titleDeliveryDate =
          "La fecha de entrega de títulos debe estar dentro del lapso académico";
      }
    }

    // Check if draft dates are in logical order
    const draftDates = [
      semesterData.firstDraftDate,
      semesterData.secondDraftDate,
      semesterData.thirdDraftDate,
      semesterData.finalDraftDate,
    ].filter((date) => date);

    for (let i = 0; i < draftDates.length - 1; i++) {
      if (draftDates[i] >= draftDates[i + 1]) {
        newErrors[
          `${Object.keys(semesterData).find((key) => semesterData[key] === draftDates[i + 1])}`
        ] = "Las fechas de borradores deben estar en orden cronológico";
        break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form changes
  const handleFormChange = (formType, field, value) => {
    if (formType === "new") {
      setNewSemester((prev) => ({ ...prev, [field]: value }));
    } else {
      setEditSemester((prev) => ({ ...prev, [field]: value }));
    }
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
        fechaEntInst: data.semester.fechaEntInst,
      });
      setCronogramaB(true);
    }
  };

  // Ejecutar al montar el componente para obtener el semestre actual
  useEffect(() => {
    handleGetCurrentSemester();
  }, []);

  // Create new semester
  const handleCreateSemester = async () => {
    if (validateDates(newSemester, false)) {
      const response = await fetch(`${backendUrl}/newLapse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newSemester }),
      });

      const data = await response.json();

      if (response.ok) {
        handleGetCurrentSemester();
        setOpenNewDialog(false);
        setNewSemester({
          startDate: "",
          endDate: "",
          titleDeliveryDate: "",
          firstDraftDate: "",
          secondDraftDate: "",
          thirdDraftDate: "",
          finalDraftDate: "",
          cartaDate: "",
          inv2Borrador1: "",
          inv2Borrador2: "",
          inv2Borrador3: "",
          inv2Borrador4: "",
          inv2BorradorFinal: "",
          tutInicio: "",
          tutFinal: "",
          urlCronograma: "",
        });
        setSnackbar({
          open: true,
          message: "Lapso académico creado exitosamente",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Fallo en la creacion del semestre",
          severity: "error",
        });
      }
    }
  };

  // Update semester
  const handleUpdateSemester = async () => {
    if (validateDates(editSemester, true, currentSemester)) {
      const response = await fetch(`${backendUrl}/editLapse`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editSemester }),
      });

      if (response.ok) {
        handleGetCurrentSemester();
        setOpenEditDialog(false);
        setSnackbar({
          open: true,
          message: "Lapso académico actualizado exitosamente",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Fallo en la actualizacion del Lapso Académico",
          severity: "error",
        });
      }
    }
  };

  // Open edit dialog
  const handleEditSemester = () => {
    setEditSemester({
      id: currentSemester.id,
      startDate: currentSemester.startDate,
      endDate: currentSemester.endDate,
      titleDeliveryDate: currentSemester.titleDeliveryDate,
      firstDraftDate: currentSemester.firstDraftDate,
      secondDraftDate: currentSemester.secondDraftDate,
      thirdDraftDate: currentSemester.thirdDraftDate,
      finalDraftDate: currentSemester.finalDraftDate,
      cartaDate: currentSemester.cartaDate,
      inv2Borrador1: currentSemester.inv2Borrador1,
      inv2Borrador2: currentSemester.inv2Borrador2,
      inv2Borrador3: currentSemester.inv2Borrador3,
      inv2Borrador4: currentSemester.inv2Borrador4,
      inv2BorradorFinal: currentSemester.inv2BorradorFinal,
      tutInicio: currentSemester.tutInicio,
      tutFinal: currentSemester.tutFinal,
    });
    setOpenEditDialog(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No definida";
    // Extraer solo la parte de la fecha y parsear como local
    const [year, month, day] = dateString.split("T")[0].split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if date is editable (not in the past)
  const isDateEditable = (dateString) => {
    if (!dateString) return true;
    const date = new Date(dateString);
    const today = new Date();
    return date > today;
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <MDTypography variant="h4" fontWeight="medium">
                Configuración del Lapso Académico
              </MDTypography>
              <Button
                variant="outlined"
                disabled={!cronogramaB}
                href={currentSemester?.urlCronograma}
              >
                {" "}
                Ver Cronograma
              </Button>
              <MDButton
                variant="gradient"
                color="info"
                onClick={() => setOpenNewDialog(true)}
                startIcon={<Icon>add</Icon>}
              >
                Nuevo Lapso
              </MDButton>
            </MDBox>
          </Grid>

          {/* Current Semester Information */}
          <Grid item xs={12}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h5" fontWeight="medium" mb={3}>
                  Lapso Académico Actual {currentSemester?.id}
                </MDTypography>

                {currentSemester ? (
                  <Grid container spacing={3}>
                    {/* Fechas Generales */}
                    <Grid item xs={12}>
                      <MDTypography variant="h6" fontWeight="bold" color="info" mb={1}>
                        Fechas Generales
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Fecha de Inicio:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.startDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Fecha de Fin:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.endDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    {/* Trabajo de Grado */}
                    <Grid item xs={12}>
                      <MDTypography variant="h6" fontWeight="bold" color="info" mb={1}>
                        Fechas de Trabajo de Grado
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Entrega de Intrumentos:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.fechaEntInst)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Entrega de Propuesta:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.firstDraftDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Informe Completo:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.secondDraftDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Tomo Completo (Correciones de Predefensa):
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.thirdDraftDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Entrega de Diapositivas
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.finalDraftDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>

                    {/* Investigación 2 */}
                    <Grid item xs={12}>
                      <MDTypography variant="h6" fontWeight="bold" color="info" mb={1}>
                        Fechas de Investigación 2
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Entrega de Protocolos de Investigacion:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.titleDeliveryDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Capitulo 1:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.inv2Borrador1)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Entrega de Carta Empresarial:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.cartaDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Capitulo 2:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.inv2Borrador2)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Capitulo 3:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.inv2Borrador3)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Entrega de Instrumentos:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.inv2Borrador4)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    {/* Tutorías */}
                    <Grid item xs={12}>
                      <MDTypography variant="h6" fontWeight="bold" color="info" mb={1}>
                        Fechas de Tutorías
                      </MDTypography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Fecha Inicio:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.tutInicio)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Fecha Final:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.tutFinal)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12}>
                      <MDBox display="flex" gap={2} mt={2}>
                        <MDButton
                          variant="gradient"
                          color="info"
                          onClick={handleEditSemester}
                          startIcon={<Icon>edit</Icon>}
                        >
                          Editar Lapso
                        </MDButton>
                      </MDBox>
                    </Grid>
                  </Grid>
                ) : (
                  <MDBox textAlign="center" py={4}>
                    <MDTypography variant="body1" color="text" mb={2}>
                      No hay un lapso académico configurado actualmente.
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      Crea un nuevo lapso académico para comenzar.
                    </MDTypography>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* New Semester Dialog */}
      <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Crear Nuevo Lapso Académico</DialogTitle>
        <DialogContent>
          <DialogContentText mb={3}>
            Complete los campos para crear un nuevo lapso académico. No se pueden seleccionar fechas
            que ya pasaron.
          </DialogContentText>
          <Grid container spacing={2}>
            {/* Campo para el ID del semestre */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID del Lapso (último dígito)"
                type="number"
                inputProps={{ min: 0, max: 9, maxLength: 1 }}
                value={newSemester.id ? newSemester.id.slice(4) : ""}
                onChange={(e) => {
                  const year = new Date().getFullYear().toString();
                  let digit = e.target.value.replace(/[^0-9]/g, "");
                  if (digit.length > 1) digit = digit[0];
                  handleFormChange("new", "id", year + digit);
                }}
                helperText="Ingrese un solo dígito para el número de lapso. El ID será: año + dígito. Ej: 20251"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Inicio"
                type="date"
                value={newSemester.startDate}
                onChange={(e) => handleFormChange("new", "startDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.startDate}
                helperText={errors.startDate}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Fin"
                type="date"
                value={newSemester.endDate}
                onChange={(e) => handleFormChange("new", "endDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.endDate}
                helperText={errors.endDate}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Enlace de Cronograma"
                value={newSemester.urlCronograma}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleEnlaceChange("new", "urlCronograma", e.target.value)}
                placeholder="https://..."
                error={!!errors.urlCronograma}
                helperText={errors.urlCronograma}
                margin="normal"
              />
            </Grid>
            {/* Trabajo de Grado */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="bold" color="info" mb={1}>
                Fechas de Trabajo de Grado
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega de Intrumentos"
                type="date"
                value={newSemester.fechaEntInst}
                onChange={(e) => handleFormChange("new", "fechaEntInst", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.fechaEntInst}
                helperText={errors.fechaEntInst}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega de Propuestas"
                type="date"
                value={newSemester.firstDraftDate}
                onChange={(e) => handleFormChange("new", "firstDraftDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.firstDraftDate}
                helperText={errors.firstDraftDate}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega Informe Completo"
                type="date"
                value={newSemester.secondDraftDate}
                onChange={(e) => handleFormChange("new", "secondDraftDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.secondDraftDate}
                helperText={errors.secondDraftDate}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega Tomo Completo (Correciones Predefensa)"
                type="date"
                value={newSemester.thirdDraftDate}
                onChange={(e) => handleFormChange("new", "thirdDraftDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.thirdDraftDate}
                helperText={errors.thirdDraftDate}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega de Diapositivas"
                type="date"
                value={newSemester.finalDraftDate}
                onChange={(e) => handleFormChange("new", "finalDraftDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.finalDraftDate}
                helperText={errors.finalDraftDate}
                margin="normal"
              />
            </Grid>
            {/* Investigación 2 */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="bold" color="info" mb={1}>
                Fechas de Investigación 2
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega de Protocolos de Investigacion"
                type="date"
                value={newSemester.titleDeliveryDate}
                onChange={(e) => handleFormChange("new", "titleDeliveryDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.titleDeliveryDate}
                helperText={errors.titleDeliveryDate}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capitulo 1"
                type="date"
                value={newSemester.inv2Borrador1}
                onChange={(e) => handleFormChange("new", "inv2Borrador1", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.inv2Borrador1}
                helperText={errors.inv2Borrador1}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega de Carta Empresarial"
                type="date"
                value={newSemester.cartaDate}
                onChange={(e) => handleFormChange("new", "cartaDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.cartaDate}
                helperText={errors.cartaDate}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capitulo 2"
                type="date"
                value={newSemester.inv2Borrador2}
                onChange={(e) => handleFormChange("new", "inv2Borrador2", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.inv2Borrador2}
                helperText={errors.inv2Borrador2}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capitulo 3"
                type="date"
                value={newSemester.inv2Borrador3}
                onChange={(e) => handleFormChange("new", "inv2Borrador3", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.inv2Borrador3}
                helperText={errors.inv2Borrador3}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Instrumentos de Investigacion"
                type="date"
                value={newSemester.inv2Borrador4}
                onChange={(e) => handleFormChange("new", "inv2Borrador4", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.inv2Borrador4}
                helperText={errors.inv2Borrador4}
                margin="normal"
              />
            </Grid>
            {/* Tutorías */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="bold" color="info" mb={1}>
                Fechas de Tutorías
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Inicio (Tutorías)"
                type="date"
                value={newSemester.tutInicio}
                onChange={(e) => handleFormChange("new", "tutInicio", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.tutInicio}
                helperText={errors.tutInicio}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fin (Tutorías)"
                type="date"
                value={newSemester.tutFinal}
                onChange={(e) => handleFormChange("new", "tutFinal", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.tutFinal}
                helperText={errors.tutFinal}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpenNewDialog(false)} color="secondary">
            Cancelar
          </MDButton>
          <MDButton onClick={handleCreateSemester} variant="gradient" color="info">
            Crear Lapso
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Edit Semester Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar Lapso Académico</DialogTitle>
        <DialogContent>
          <DialogContentText mb={3}>
            Modifique los campos que desee actualizar. No se pueden seleccionar fechas que ya
            pasaron.
          </DialogContentText>
          <Grid container spacing={3}>
            {/* Trabajo de Grado */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="bold" color="info" mb={1}>
                Fechas de Trabajo de Grado
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Inicio"
                type="date"
                value={editSemester.startDate}
                onChange={(e) => handleFormChange("edit", "startDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: isDateEditable(currentSemester?.startDate)
                    ? getCurrentDate()
                    : currentSemester?.startDate,
                }}
                error={!!errors.startDate}
                helperText={errors.startDate}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.startDate)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Fin"
                type="date"
                value={editSemester.endDate}
                onChange={(e) => handleFormChange("edit", "endDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: isDateEditable(currentSemester?.endDate)
                    ? getCurrentDate()
                    : currentSemester?.endDate,
                }}
                error={!!errors.endDate}
                helperText={errors.endDate}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.endDate)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Enlace de Cronograma"
                value={newSemester.urlCronograma}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleEnlaceChange("edit", "urlCronograma", e.target.value)}
                placeholder="https://..."
                error={!!errors.urlCronograma}
                helperText={errors.urlCronograma}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega de Intrumentos"
                type="date"
                value={editSemester.fechaEntInst}
                onChange={(e) => handleFormChange("new", "fechaEntInst", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: isDateEditable(currentSemester?.fechaEntInst)
                    ? getCurrentDate()
                    : currentSemester?.fechaEntInst,
                }}
                error={!!errors.fechaEntInst}
                helperText={errors.fechaEntInst}
                disabled={!isDateEditable(currentSemester?.fechaEntInst)}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega de Propuesta"
                type="date"
                value={editSemester.firstDraftDate}
                onChange={(e) => handleFormChange("edit", "firstDraftDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: isDateEditable(currentSemester?.firstDraftDate)
                    ? getCurrentDate()
                    : currentSemester?.firstDraftDate,
                }}
                error={!!errors.firstDraftDate}
                helperText={errors.firstDraftDate}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.firstDraftDate)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega Informe Completo"
                type="date"
                value={editSemester.secondDraftDate}
                onChange={(e) => handleFormChange("edit", "secondDraftDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: isDateEditable(currentSemester?.secondDraftDate)
                    ? getCurrentDate()
                    : currentSemester?.secondDraftDate,
                }}
                error={!!errors.secondDraftDate}
                helperText={errors.secondDraftDate}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.secondDraftDate)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega Tomo Completo (Correciones Predefensa)"
                type="date"
                value={editSemester.thirdDraftDate}
                onChange={(e) => handleFormChange("edit", "thirdDraftDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: isDateEditable(currentSemester?.thirdDraftDate)
                    ? getCurrentDate()
                    : currentSemester?.thirdDraftDate,
                }}
                error={!!errors.thirdDraftDate}
                helperText={errors.thirdDraftDate}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.thirdDraftDate)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega de Diapositivas"
                type="date"
                value={editSemester.finalDraftDate}
                onChange={(e) => handleFormChange("edit", "finalDraftDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: isDateEditable(currentSemester?.finalDraftDate)
                    ? getCurrentDate()
                    : currentSemester?.finalDraftDate,
                }}
                error={!!errors.finalDraftDate}
                helperText={errors.finalDraftDate}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.finalDraftDate)}
              />
            </Grid>
            {/* Investigación 2 */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="bold" color="info" mb={1}>
                Fechas de Investigación 2
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega de Protocolos de Investigación"
                type="date"
                value={editSemester.titleDeliveryDate}
                onChange={(e) => handleFormChange("edit", "titleDeliveryDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: isDateEditable(currentSemester?.titleDeliveryDate)
                    ? getCurrentDate()
                    : currentSemester?.titleDeliveryDate,
                }}
                error={!!errors.titleDeliveryDate}
                helperText={errors.titleDeliveryDate}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.titleDeliveryDate)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capitulo 1"
                type="date"
                value={editSemester.inv2Borrador1}
                onChange={(e) => handleFormChange("edit", "inv2Borrador1", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.inv2Borrador1}
                helperText={errors.inv2Borrador1}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.inv2Borrador1)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega de Carta Empresarial"
                type="date"
                value={editSemester.cartaDate}
                onChange={(e) => handleFormChange("edit", "cartaDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.cartaDate}
                helperText={errors.cartaDate}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.cartaDate)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capitulo 2"
                type="date"
                value={editSemester.inv2Borrador2}
                onChange={(e) => handleFormChange("edit", "inv2Borrador2", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.inv2Borrador2}
                helperText={errors.inv2Borrador2}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.inv2Borrador2)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Capitulo 3"
                type="date"
                value={editSemester.inv2Borrador3}
                onChange={(e) => handleFormChange("edit", "inv2Borrador3", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.inv2Borrador3}
                helperText={errors.inv2Borrador3}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.inv2Borrador3)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Entrega Instrumentos de Investigaccion"
                type="date"
                value={editSemester.inv2Borrador4}
                onChange={(e) => handleFormChange("edit", "inv2Borrador4", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.inv2Borrador4}
                helperText={errors.inv2Borrador4}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.inv2Borrador4)}
              />
            </Grid>
            {/* Tutorías */}
            <Grid item xs={12}>
              <MDTypography variant="h6" fontWeight="bold" color="info" mb={1}>
                Fechas de Tutorías
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label=" Inicio (Tutorías)"
                type="date"
                value={editSemester.tutInicio}
                onChange={(e) => handleFormChange("edit", "tutInicio", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.tutInicio}
                helperText={errors.tutInicio}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.tutInicio)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fin (Tutorías)"
                type="date"
                value={editSemester.tutFinal}
                onChange={(e) => handleFormChange("edit", "tutFinal", e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getCurrentDate() }}
                error={!!errors.tutFinal}
                helperText={errors.tutFinal}
                margin="normal"
                disabled={!isDateEditable(currentSemester?.tutFinal)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={() => setOpenEditDialog(false)} color="secondary">
            Cancelar
          </MDButton>
          <MDButton onClick={handleUpdateSemester} variant="gradient" color="info">
            Actualizar Lapso
          </MDButton>
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

      <Footer />
    </DashboardLayout>
  );
}

export default SemesterConfig;
