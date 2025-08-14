// @mui material components
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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getValidStudentId, wasCedulaMapped } from "utils/studentUtils";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText  from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import studentsTableData from "layouts/students/data/studentsTableData";
import { backendUrl } from "config";

function Students() {
  const navigate = useNavigate();

  // Función helper para navegar al perfil del estudiante
  const handleViewStudent = (cedula) => {
    navigate(`/estudiantes/${cedula}`);
  };

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [careers, setCareers] = useState([]);
  const [sections, setSections] = useState([]);
  const [sectionsTutor, setSectionsTutor] = useState([]);
  const [section, setSection] = useState(false);
  const [sectionTutor, setSectionTutor] = useState(false);
  const [students, setStudents] = useState([]);
  const [columns, setColumns] = useState(
    studentsTableData(students, handleViewStudent).columns
  );
  const [rows, setRows] = useState(
    studentsTableData(students, handleViewStudent).rows
  );
  const [openNewDialog, setOpenNewDialog] = useState(false);

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const [openAdd, setOpenAdd] = useState(false);

  const [newStudent, setNewStudent] = useState({
    nombre1: "",
    nombre2: "",
    apellido1: "",
    apellido2: "",
    correo: "",
    telf: "",
    carrera: "",
    seccion: "",
    seccion_tutor: "",
    cedula: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    nombre1: "",
    apellido1: "",
    cedula: "",
    nombre2: "",
    apellido2: "",
  });

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setValidationErrors({
      nombre1: "",
      apellido1: "",
      cedula: "",
      nombre2: "",
      apellido2: "",
    });
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const handleDeleteClick = (cedula) => {
    setStudentToDelete(cedula);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (studentToDelete) {
      const response = await fetch(`${backendUrl}/matriculas`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({cedula: studentToDelete}),
      });

      console.log(response.ok);
      if (response.ok) {
        handleGetStudents();
        setSnackbar({
          open: true,
          message: "Estudiante creado exitosamente",
          severity: "success",
        });
      }
    } else {
      setSnackbar({
        open: true,
        message: "Fallo al borrar al estudiante",
        severity: "error",
      });
    }
    setDeleteModalOpen(false);
  };

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

    if (!newStudent.nombre1.trim()) {
      errors.nombre1 = "El primer nombre es obligatorio";
    }

    if (!newStudent.apellido1.trim()) {
      errors.apellido1 = "El primer apellido es obligatorio";
    }

    if (!newStudent.cedula.trim()) {
      errors.cedula = "La cédula es obligatoria";
    }

    if (!newStudent.correo.trim()) {
      errors.correo = "El Correo es obligatoria";
    }

    if (!newStudent.seccion > 0) {
      errors.seccion = "Indique una seccion";
    }

    if (!newStudent.carrera > 0) {
      errors.carrera = "Indique una Carrera";
    }

    return errors;
  };

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;

    // Validaciones en tiempo real
    let error = "";

    if (name === "nombre1" || name === "nombre2" || name === "apellido1" || name === "apellido2") {
      if (value && !validateLettersOnly(value)) {
        error = "Solo se permiten letras";
        return; // No actualizar el valor si no es válido
      }
    }

    if (name === "cedula") {
      if (value && !validateNumbersOnly(value)) {
        error = "Solo se permiten números";
        return; // No actualizar el valor si no es válido
      }
    }

    if (name === "correo") {
      if (value && !validateEmailStructure(value)) {
        error = "Solo se permiten números";
        return; // No actualizar el valor si no es válido
      }
    }

    // Limpiar error si el valor es válido
    setValidationErrors((prev) => ({ ...prev, [name]: error }));

    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleTelfChange = (value) => {
    setNewStudent({
      ...newStudent,
      telf: value,
    });
    console.log(newStudent);
  };

  const handleGetStudents = async () => {
    const response = await fetch(`${backendUrl}/estudiantesA`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    console.log("API Response:", data);
    console.log(response.ok);
    if (response.ok) {
      // Si la respuesta es un array directamente
      if (Array.isArray(data)) {
        console.log("Setting students from array:", data);
        setStudents(data);
      }
      // Si la respuesta tiene la propiedad 'estudiantes'
      else if (Array.isArray(data.estudiantes)) {
        console.log("Setting students from data.estudiantes:", data.estudiantes);
        setStudents(data.estudiantes);
      } else {
        setStudents([]); // O maneja el error como prefieras
        console.error("La respuesta no contiene estudiantes válidos");
      }
    }
  };
  const handleGetCareers = async () => {
    const response = await fetch(`${backendUrl}/carreras`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      setCareers(data);
      setSections([]);
      setNewStudent({
        ...newStudent,
        seccion: "",
      });
    } else {
    }
  };

  const handleGetSections = async (carrera) => {
    setSection(false);
    const response = await fetch(`${backendUrl}/secciones/${carrera}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      setSections(data);
      setSection(true);
    } else {
      console.error("Failed to fetch sections");
    }
  };

  const handleGetSectionsTutor = async (carrera) => {
    setSectionTutor(false);
    const response = await fetch(`${backendUrl}/seccionesTutor/${carrera}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      setSectionsTutor(data);
      setSectionTutor(true);
    } else {
      console.error("Failed to fetch sections");
    }
  };

  useEffect(() => {
    // Busca la sección seleccionada en el array de sections
    console.log(newStudent.seccion);
    const selectedSection = sections.find((section) => section.idSeccion === newStudent.seccion);

    if (selectedSection) {
      console.log(selectedSection);
      console.log(selectedSection.Materias.categoria);
    }
    if (selectedSection && selectedSection.Materias.categoria == "investigacion_II") {
      console.log("Hola");
      handleGetSectionsTutor(newStudent.carrera);
    } else {
      setSectionsTutor([]);
      setSectionTutor(false);
      setNewStudent((prev) => ({ ...prev, seccion_tutor: "" }));
    }
  }, [newStudent.seccion, newStudent.carrera, sections]);

  useEffect(() => {
    handleGetCareers();
    handleGetStudents();
  }, []);

  useEffect(() => {
    handleGetSections(newStudent.carrera);
  }, [newStudent.carrera]);

  useEffect(() => {
    setRows(studentsTableData(students, handleViewStudent, handleDeleteClick).rows);
  }, [students]);

  const handleAddStudent = async () => {
    // Validar campos obligatorios
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

    const response = await fetch(`${backendUrl}/estudiante`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newStudent }),
    });

    const data = await response.json();

    if (response.ok) {
      setOpenNewDialog(false);
      setNewStudent({
        nombre1: "",
        nombre2: "",
        apellido1: "",
        apellido2: "",
        correo: "",
        telf: "",
        carrera: "",
        seccion: "",
        seccion_tutor: "",
        cedula: "",
      });
      setValidationErrors({
        nombre1: "",
        apellido1: "",
        cedula: "",
        nombre2: "",
        apellido2: "",
      });
      handleGetStudents();
      setSnackbar({
        open: true,
        message: "Estudiante creado exitosamente",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Fallo en la creacion del estudiante",
        severity: "error",
      });
    }
    handleCloseAdd();
  };

  // Estados para filtros y búsqueda
  const [orderBy, setOrderBy] = useState("Nombre");
  const [filterCarrera, setFilterCarrera] = useState("");
  const [filterMateria, setFilterMateria] = useState("");
  const [search, setSearch] = useState("");

  // Función para filtrar, buscar y ordenar
  const getFilteredRows = () => {
    let filtered = [...students];
    
    // Eliminar estudiantes duplicados basándose en la cédula
    const uniqueStudents = [];
    const seenCedulas = new Set();
    
    filtered.forEach((student) => {
      if (!seenCedulas.has(student.cedula)) {
        seenCedulas.add(student.cedula);
        uniqueStudents.push(student);
      }
    });
    
    filtered = uniqueStudents;
    
    // Filtrar por carrera
    if (filterCarrera) {
      filtered = filtered.filter((row) => row.carrera === filterCarrera);
    }
    // Filtrar por materia
    if (filterMateria) {
      filtered = filtered.filter((row) => {
        // Check if materia is an array and use .some() to check if AT LEAST ONE materia matches the filter.
        if (Array.isArray(row.materia)) {
          return row.materia.some((mat) => {
            console.log(mat)
            // Return true if the materia (case-insensitive) includes the filter text.
            return mat.toLowerCase().includes(filterMateria.toLowerCase());
          });
        } else {
          // If materia is not an array, check if it's a string that matches the filter
          return row.materia && typeof row.materia === 'string' && 
                 row.materia.toLowerCase().includes(filterMateria.toLowerCase());
        }
      });
    }

    // Buscar por nombre
    if (search) {
      filtered = filtered.filter(
        (row) =>
          row.nombre.toLowerCase().includes(search.toLowerCase()) ||
          `${row.cedula}`.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Ordenar
    if (orderBy === "Nombre") {
      filtered = filtered.filter((row) => row && row.nombre); // Solo los que tienen nombre
      filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orderBy === "Cedula") {
      filtered = filtered.filter((row) => row && row.cedula);
      filtered.sort((a, b) => `${a.cedula}`.localeCompare(b.cedula));
    } else if (orderBy === "Carrera") {
      filtered = filtered.filter((row) => row && row.carrera);
      filtered.sort((a, b) => a.carrera.localeCompare(b.carrera));
    }
    return studentsTableData(filtered, handleViewStudent, handleDeleteClick).rows;
  };

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
              ></MDBox>
              <br></br>
              <Grid container columns={4} spacing={3} px={2} py={1}>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="ordenar-label">Ordenar Por</InputLabel>
                    <Select
                      labelId="ordenar-label"
                      id="ordenar-select"
                      label="Ordenar Por"
                      value={orderBy}
                      onChange={(e) => setOrderBy(e.target.value)}
                    >
                      <MenuItem value="Nombre">Nombre</MenuItem>
                      <MenuItem value="Cedula">Cedula</MenuItem>
                      <MenuItem value="Carrera">Carrera</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <MDTypography variant="h6">Filtrar por:</MDTypography>
                </Grid>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="carrera-label">Carrera</InputLabel>
                    <Select
                      labelId="carrera-label"
                      id="carrera-select"
                      label="Carrera"
                      value={filterCarrera}
                      onChange={(e) => setFilterCarrera(e.target.value)}
                    >
                      <MenuItem value="">Todas</MenuItem>
                      {careers.map((career, index) => (
                        <MenuItem key={index} value={career.nombre}>
                          {career.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="materia-label">Unidad</InputLabel>
                    <Select
                      labelId="materia-label"
                      id="materia-select"
                      label="Materia"
                      value={filterMateria}
                      onChange={(e) => setFilterMateria(e.target.value)}
                    >
                      <MenuItem value="">Todas</MenuItem>
                      <MenuItem value="Trabajo_Especial_de_Grado">
                        Trabajo Especial de Grado
                      </MenuItem>
                      <MenuItem value="investigación_II">Investigación II</MenuItem>
                      <MenuItem value="Tutorias">Tutorias</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <MDTypography variant="h6">Buscar al: </MDTypography>
                </Grid>
                <Grid item size={6} width={200}>
                  <TextField
                    id="outlined-basic"
                    label="Estudiante"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Grid>
                <Grid item></Grid>
                <Grid item>
                  <Stack spacing={2} direction="row">
                    <Button variant="contained" onClick={handleOpenAdd}>
                      Agregar Estudiante
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              <MDBox pt={1}>
                <DataTable
                  table={{ columns: columns, rows: getFilteredRows(),  }}
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
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Agregar Estudiante</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Primer Nombre"
                name="nombre1"
                value={newStudent.nombre1}
                onChange={handleNewStudentChange}
                fullWidth
                error={!!validationErrors.nombre1}
                helperText={validationErrors.nombre1}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Segundo Nombre"
                name="nombre2"
                value={newStudent.nombre2}
                onChange={handleNewStudentChange}
                fullWidth
                error={!!validationErrors.nombre2}
                helperText={validationErrors.nombre2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Primer Apellido"
                name="apellido1"
                value={newStudent.apellido1}
                onChange={handleNewStudentChange}
                fullWidth
                error={!!validationErrors.apellido1}
                helperText={validationErrors.apellido1}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Segundo Apellido"
                name="apellido2"
                value={newStudent.apellido2}
                onChange={handleNewStudentChange}
                fullWidth
                error={!!validationErrors.apellido2}
                helperText={validationErrors.apellido2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Cédula"
                name="cedula"
                value={newStudent.cedula}
                onChange={handleNewStudentChange}
                fullWidth
                error={!!validationErrors.cedula}
                helperText={validationErrors.cedula}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Correo"
                name="correo"
                value={newStudent.correo}
                onChange={handleNewStudentChange}
                fullWidth
                error={!!validationErrors.correo}
                helperText={validationErrors.correo}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="standard" fullWidth>
                <PhoneInput
                  className="hola MuiInputBase-root  MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl css-1u5lk04-MuiInputBase-root-MuiOutlinedInput-root"
                  placeholder="Ingresar N° de Teléfono"
                  value={newStudent.telf}
                  onChange={handleTelfChange}
                  defaultCountry="VE"
                  numberInputProps={{
                    className:
                      "MuiInputBase-input MuiOutlinedInput-input css-5mmmz-MuiInputBase-input-MuiOutlinedInput-input",
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="carrera-add-label">Carrera</InputLabel>
                <Select
                  labelId="carrera-add-label"
                  name="carrera"
                  value={newStudent.carrera}
                  label="Carrera"
                  onChange={handleNewStudentChange}
                  error={!!validationErrors.carrera}
                  helperText={validationErrors.carrera}
                >
                  <MenuItem value="">Seleccione una carrera</MenuItem>
                  {careers.map((career, index) => (
                    <MenuItem key={index} value={career.idCarrera}>
                      {career.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="seccion-add-label">Sección</InputLabel>
                <Select
                  labelId="seccion-add-label"
                  name="seccion"
                  value={newStudent.seccion}
                  label="Sección"
                  onChange={handleNewStudentChange}
                  disabled={!section}
                  error={!!validationErrors.seccion}
                  helperText={validationErrors.seccion}
                >
                  <MenuItem value="">Seleccione una sección</MenuItem>
                  {sections.map((section, index) => (
                    <MenuItem key={index} value={section.idSeccion}>
                      {section.letra + " " + section.Materias.categoria}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="seccion-add-label">Sección Tutorias</InputLabel>
                <Select
                  labelId="seccion-add-label"
                  name="seccion_tutor"
                  value={newStudent.seccion_tutor}
                  label="Sección"
                  onChange={handleNewStudentChange}
                  disabled={!sectionTutor}
                >
                  <MenuItem value="">Seleccione una sección de tutor</MenuItem>
                  {sectionsTutor.map((section, index) => (
                    <MenuItem key={index} value={section.idSeccion}>
                      {section.letra + ") " + section.Materias.categoria}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancelar</Button>
          <Button onClick={handleAddStudent} variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Estás seguro que deseas eliminar este estudiante?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Eliminar
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

      <Footer />
    </DashboardLayout>
  );
}

export default Students;
