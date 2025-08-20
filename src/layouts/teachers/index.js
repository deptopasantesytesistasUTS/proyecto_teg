// @mui material components
import * as React from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Modal } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import PhoneInput from "react-phone-number-input";
import Alert from "@mui/material/Alert";
import "react-phone-number-input/style.css";
import { useState } from "react";
import * as XLSX from 'xlsx';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import teachersTableData from "./data/teachersTableData";
import { backendUrl } from "config";

function Teachers() {
  // Estado para la lista de docentes
  const [teachers, setTeachers] = React.useState([]);
  const { columns } = teachersTableData([]); // columnas sin carrera
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Estado para filtros
  const [sortBy, setSortBy] = React.useState("1");
  const [searchTerm, setSearchTerm] = React.useState("");

  // Estado para modal y formulario de agregar docente
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formData, setFormData] = React.useState({
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    id: "",
    email: "",
    telf: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // Obtener docentes del backend al montar
  React.useEffect(() => {
    fetchTeachers();
  }, []);

  const handleTelfChange = (value) => {
    setFormData({
      ...formData,
      telf: value,
    });
    console.log(formData);
  };

  const fetchTeachers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${backendUrl}/docentesAdmin`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setTeachers(data.profesores || []);
      } else {
        setError("Error al obtener docentes");
      }
    } catch (err) {
      setError("Error de conexión con el backend");
    } finally {
      setLoading(false);
    }
  };

  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    apellido1: "",
    cedula: "",
    nombre2: "",
    apellido2: "",
  });

  // Función para validar solo letras
  const validateLettersOnly = (value) => {
    const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    return lettersRegex.test(value);
  };

  const validateEmailStructure = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  // Función para validar solo números
  const validateNumbersOnly = (value) => {
    const numbersRegex = /^[0-9]*$/;
    return numbersRegex.test(value);
  };

  // Función para validar campos obligatorios
  const validateRequiredFields = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "El primer nombre es obligatorio";
    }

    if (!formData.firstLastName.trim()) {
      errors.firstLastName = "El primer apellido es obligatorio";
    }

    if (!formData.id.trim()) {
      errors.id = "La cédula es obligatoria";
    }

    if (!formData.email.trim()) {
      errors.email = "El Correo es obligatoria";
      if (formData.email && !validateEmailStructure(formData.email)) {
        error.email = "Correo Electronico Invalido";
      }
    }

    return errors;
  };

  // Filtrar y ordenar la lista
  const getFilteredAndSortedRows = () => {
    let filteredRows = [...teachers];
    // Filtro de búsqueda
    if (searchTerm.trim() !== "") {
      filteredRows = filteredRows.filter((teacher) => {
        console.log(teacher);
        const name = `${teacher.nombre}`.trim();
        const id = `${teacher.cedula}` || "";
        const email = teacher.correo || "";
        const searchLower = searchTerm.toLowerCase();
        return (
          name.toLowerCase().includes(searchLower) ||
          id.toLowerCase().includes(searchLower) ||
          email.toLowerCase().includes(searchLower)
        );
      });
    }
    // Ordenamiento
    if (sortBy !== "1") {
      filteredRows.sort((a, b) => {
        const nameA = `${a.nombre}`.trim();
        const nameB = `${b.nombre}`.trim();
        const idA = `${a.cedula}` || "";
        const idB = `${b.cedula}` || "";
        switch (sortBy) {
          case "2": // Nombre
            return nameA.localeCompare(nameB);
          case "3": // Cédula
            return idA.localeCompare(idB);
          default:
            return 0;
        }
      });
    }
    return filteredRows;
  };

  const filteredRows = getFilteredAndSortedRows();

  // Función para exportar a Excel
  const handleExportToExcel = () => {
    try {
      // Obtener los datos filtrados
      let filtered = [...filteredRows];
      
      // Crear workbook
      const wb = XLSX.utils.book_new();
      
      // Crear hoja con estructura: n | carrera | ci | nombre y apellido
      const wsTeachers = XLSX.utils.aoa_to_sheet([
        // Fila 1: Encabezados
        ['N°', 'Carrera', 'CI', 'Nombre y Apellido'],
        // Filas de datos
        ...filtered.map((teacher, index) => [
          index + 1, // N°
          teacher.carrera || '', // Carrera
          teacher.cedula || '', // CI
          teacher.nombre || '', // Nombre y Apellido
        ])
      ]);

      // Configurar ancho de columnas
      wsTeachers['!cols'] = [
        { wch: 8 },  // N°
        { wch: 25 }, // Carrera
        { wch: 15 }, // CI
        { wch: 40 }, // Nombre y Apellido
      ];

      // Aplicar estilos a los encabezados
      for (let col = 0; col <= 3; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
        if (wsTeachers[cellRef]) {
          wsTeachers[cellRef].s = {
            font: { bold: true },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "4472C4" } }, // Fondo azul
            font: { color: { rgb: "FFFFFF" }, bold: true } // Texto blanco y negrita
          };
        }
      }

      // Aplicar estilos a los datos
      for (let row = 1; row < filtered.length + 1; row++) {
        for (let col = 0; col <= 3; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (wsTeachers[cellRef]) {
            wsTeachers[cellRef].s = {
              alignment: { horizontal: "center", vertical: "center" },
              border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" }
              }
            };
          }
        }
      }

      // Agregar la hoja al workbook
      XLSX.utils.book_append_sheet(wb, wsTeachers, 'Listado_Docentes');

      // Generar nombre del archivo
      const fileName = `Listado_Docentes_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Descargar archivo
      XLSX.writeFile(wb, fileName);

      setSnackbar({
        open: true,
        message: `Archivo Excel generado exitosamente con ${filtered.length} docentes: ${fileName}`,
        severity: "success",
      });
    } catch (error) {
      console.error('Error al generar Excel:', error);
      setSnackbar({
        open: true,
        message: "Error al generar el archivo Excel",
        severity: "error",
      });
    }
  };

  // Modal: manejar cambios en el formulario
  const handleFormChange = (field, value) => {
    let error = "";

    if (
      field === "firstName" ||
      field === "secondName" ||
      field === "firstLastName" ||
      field === "secondLastName"
    ) {
      if (value && !validateLettersOnly(value)) {
        error = "Solo se permiten letras";
        return; // No actualizar el valor si no es válido
      }
    }

    console.log(field);
    console.log(field === "id");

    if (field === "id") {
      console.log(value && !validateNumbersOnly(value));
      console.log("value: " + value);
      console.log(!validateNumbersOnly(value));
      if (value && !validateNumbersOnly(value)) {
        error = "Solo se permiten números";
        return; // No actualizar el valor si no es válido
      }
    }

    if (field === "email") {
      if (value && !validateEmailStructure(value)) {
        error = "Correo Electronico Invalido";
      }
    }

    // Limpiar error si el valor es válido
    setValidationErrors((prev) => ({ ...prev, [field]: error }));
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Modal: agregar docente
  const handleAddTeacher = async () => {
    setLoading(true);
    setError("");
    try {
      const errors = validateRequiredFields();

      if (Object.keys(errors).length > 0) {
        setValidationErrors((prev) => ({ ...prev, ...errors }));
        setSnackbar({
          open: true,
          message: "Por favor, complete todos los campos obligatorios",
          severity: "error",
        });
        return;
      }
      const response = await fetch(`${backendUrl}/docentesAdmin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Recargar lista
        fetchTeachers();
        setOpen(false);
        setFormData({
          firstName: "",
          secondName: "",
          firstLastName: "",
          secondLastName: "",
          id: "",
          email: "",
          telf: "",
        });
      } else {
        setError("Error al agregar docente");
      }
    } catch (err) {
      setError("Error de conexión con el backend");
    } finally {
      setLoading(false);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // Eliminar la columna de carrera de la tabla
  const filteredColumns = columns.filter((col) => col.accessor !== "carrera");

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
                <MDTypography variant="h6" color="white">
                  Listado de Docentes
                </MDTypography>
              </MDBox>
              <br></br>
              <Grid container columns={4} spacing={3} px={2} py={1}>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="sort-select-label">Ordenar Por</InputLabel>
                    <Select
                      labelId="sort-select-label"
                      id="sort-select"
                      value={sortBy}
                      label="Ordenar Por"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="1">Sin ordenar</MenuItem>
                      <MenuItem value="2">Nombre</MenuItem>
                      <MenuItem value="3">Cedula</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <MDTypography variant="h6">Buscar al: </MDTypography>
                </Grid>
                <Grid item size={6} width={200}>
                  <TextField
                    id="search-field"
                    label="Docente"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nombre, cédula o email"
                  />
                </Grid>
                <Grid item></Grid>
                <Grid item>
                  <Stack spacing={2} direction="row">
                    <Button onClick={handleOpen} variant="contained">
                      Agregar Docente
                    </Button>
                    <Button 
                      variant="outlined" 
                      onClick={handleExportToExcel}
                      startIcon={<FileDownloadIcon />}
                      color="primary"
                    >
                      Listado Docentes 
                    </Button>

                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title2"
                      aria-describedby="modal-modal-description2"
                    >
                      <MDBox p={4} sx={style}>
                        <MDTypography id="modal-modal-title2" variant="h5" component="h2" mb={3}>
                          Agregar Nuevo Docente
                        </MDTypography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Primer Nombre"
                              variant="outlined"
                              size="medium"
                              value={formData.firstName}
                              onChange={(e) => handleFormChange("firstName", e.target.value)}
                              error={!!validationErrors.firstName}
                              helperText={validationErrors.firstName}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Segundo Nombre"
                              variant="outlined"
                              size="medium"
                              value={formData.secondName}
                              onChange={(e) => handleFormChange("secondName", e.target.value)}
                              error={!!validationErrors.secondName}
                              helperText={validationErrors.secondName}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Primer Apellido"
                              variant="outlined"
                              size="medium"
                              value={formData.firstLastName}
                              onChange={(e) => handleFormChange("firstLastName", e.target.value)}
                              error={!!validationErrors.firstLastName}
                              helperText={validationErrors.firstLastName}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Segundo Apellido"
                              variant="outlined"
                              size="medium"
                              value={formData.secondLastName}
                              onChange={(e) => handleFormChange("secondLastName", e.target.value)}
                              error={!!validationErrors.secondLastName}
                              helperText={validationErrors.secondLastName}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Cédula"
                              variant="outlined"
                              size="medium"
                              value={formData.id}
                              onChange={(e) => handleFormChange("id", e.target.value)}
                              error={!!validationErrors.id}
                              helperText={validationErrors.id}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Correo Electrónico"
                              variant="outlined"
                              size="medium"
                              value={formData.email}
                              onChange={(e) => handleFormChange("email", e.target.value)}
                              error={!!validationErrors.email}
                              helperText={validationErrors.email}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControl variant="standard" fullWidth>
                              <PhoneInput
                                className="hola MuiInputBase-root  MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1u5lk04-MuiInputBase-root-MuiOutlinedInput-root"
                                placeholder="Ingresar N° de Teléfono"
                                value={formData.telf}
                                onChange={handleTelfChange}
                                defaultCountry="VE"
                                numberInputProps={{
                                  className:
                                    "MuiInputBase-input MuiOutlinedInput-input css-5mmmz-MuiInputBase-input-MuiOutlinedInput-input",
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                          <Button variant="outlined" onClick={handleClose} sx={{ minWidth: 100 }}>
                            Cancelar
                          </Button>
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={handleAddTeacher}
                            sx={{ minWidth: 100 }}
                            disabled={loading}
                          >
                            Guardar
                          </Button>
                        </Box>
                      </MDBox>
                    </Modal>
                  </Stack>
                </Grid>
              </Grid>
              <MDBox pt={1}>
                <DataTable
                  table={{ columns: filteredColumns, rows: teachersTableData(filteredRows).rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      

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

export default Teachers;
