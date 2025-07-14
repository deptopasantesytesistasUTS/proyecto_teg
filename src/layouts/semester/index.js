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

function SemesterConfig() {
  const [currentSemester, setCurrentSemester] = useState(null);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
  });

  // Validation states
  const [errors, setErrors] = useState({});

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Validate dates
  const validateDates = (semesterData) => {
    const newErrors = {};
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];

    // Check if any date is in the past
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
    const response = await fetch(`http://localhost:3003/api/actLapso/${currentDate}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      console.log(data.semester);
      setCurrentSemester({
        id: data.semester.id,
        startDate: data.semester.startDate,
        endDate: data.semester.endDate,
        titleDeliveryDate: data.semester.titleDeliveryDate,
        firstDraftDate: data.semester.firstDraftDate,
        secondDraftDate: data.semester.secondDraftDate,
        thirdDraftDate: data.semester.thirdDraftDate,
        finalDraftDate: data.semester.finalDraftDate,
      });
    }
  };

  // Ejecutar al montar el componente para obtener el semestre actual
  useEffect(() => {
    handleGetCurrentSemester();
    // eslint-disable-next-line
  }, []);

  // Create new semester
  const handleCreateSemester = async () => {
    if (validateDates(newSemester)) {
      const response = await fetch("http://localhost:3003/api/newLapse", {
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
    if (validateDates(editSemester)) {
      const response = await fetch("http://localhost:3003/api/editLapse", {
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
    });
    setOpenEditDialog(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No definida";
    const date = new Date(dateString);
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
                  Lapso Académico Actual
                </MDTypography>

                {currentSemester ? (
                  <Grid container spacing={3}>
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
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Entrega de Títulos:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.titleDeliveryDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Primer Borrador:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.firstDraftDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Segundo Borrador:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.secondDraftDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Tercer Borrador:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.thirdDraftDate)}
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDTypography variant="button" fontWeight="bold" color="text">
                          Borrador Final:
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {formatDate(currentSemester.finalDraftDate)}
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
                label="Entrega de Títulos"
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
                label="Primer Borrador"
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
                label="Segundo Borrador"
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
                label="Tercer Borrador"
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
                label="Borrador Final"
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
          <Grid container spacing={2}>
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
                label="Entrega de Títulos"
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
                label="Primer Borrador"
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
                label="Segundo Borrador"
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
                label="Tercer Borrador"
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
                label="Borrador Final"
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
