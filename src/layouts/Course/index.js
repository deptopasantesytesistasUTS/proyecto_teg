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
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import { backendUrl } from "config";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import coursesTableData from "layouts/Course/data/coursesTableData";
import DialogContentText from "@mui/material/DialogContentText"

;
function Course() {
  // Estados para datos
  const [courses, setCourses] = useState([]); // materias
  const [careers, setCareers] = useState([]);
  const [professors, setProfessors] = useState([]);

  // Estados para filtros
  const [filterMateria, setFilterMateria] = useState("");
  const [filterCarrera, setFilterCarrera] = useState("");
  const [filterEstatus, setFilterEstatus] = useState("");

  // Estados para tabla
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([
    { Header: "Nombre", accessor: "nombre" },
    { Header: "Carrera", accessor: "carrera" },
    { Header: "Profesores", accessor: "profesores" },
    { Header: "Estatus", accessor: "estatus" },
    { Header: "Action", accessor: "action" },
  ]);

  // Estados para modal de comunicado general
  const [openComunicado, setOpenComunicado] = useState(false);
  const [comunicado, setComunicado] = useState({ titulo: "", mensaje: "" });
  const [loadingComunicado, setLoadingComunicado] = useState(false);


  // Estados para formulario de creación
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [newCourse, setNewCourse] = useState({
    nombre: "",
    carrera: "",
    profesores: [],
    estatus: "Activo",
    letraSeccion: "",
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleGetCareersList = async () => {
    const response = await fetch(`${backendUrl}/UnidadesListA`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();

    console.log(response.ok);
    if (response.ok) {
      // Si la respuesta es un array directamente
      if (Array.isArray(data)) {
        setCourses(data);
        console.log("caso 1");
      }
      // Si la respuesta tiene la propiedad 'estudiantes'
      else if (Array.isArray(data.unidades)) {
        setCourses(data.unidades);
        console.log("caso 2");
      } else {
        setCourses([]); // O maneja el error como prefieras
        console.error("La respuesta no contiene cursos válidos");
      }
    }
  };

  // Cargar carreras y profesores desde backend
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await fetch(`${backendUrl}/carreras`);
        if (res.ok) {
          const data = await res.json();
          setCareers(data);
        } else {
          setCareers([]);
          console.error("error en conexion con servidor");
        }
      } catch {
        setCareers([]);
        console.error("error en conexion con servidor");
      }
    };
    const fetchProfessors = async () => {
      try {
        const res = await fetch(`${backendUrl}/profesoresUnidades`);
        if (res.ok) {
          const data = await res.json();
          setProfessors(data.profesores);
        } else {
          console.error("error en conexion con servidor");
          setProfessors([]);
        }
      } catch {
        console.error("error en conexion con servidor");
        setProfessors([]);
      }
    };
    fetchCareers();
    fetchProfessors();
    // Datos de ejemplo para materias
    handleGetCareersList();
  }, []);

  // Filtrado de materias
  useEffect(() => {
    let filtered = [...courses];
    if (filterMateria) filtered = filtered.filter((row) => row.nombre === filterMateria);
    if (filterCarrera) filtered = filtered.filter((row) => row.carrera === filterCarrera);
    if (filterEstatus) filtered = filtered.filter((row) => row.estatus === filterEstatus);
    
    console.log("Datos filtrados que se pasan a coursesTableData:", filtered);
    console.log("Primera materia:", filtered[0]);
    
    setRows(coursesTableData(filtered).rows);
  }, [courses, filterMateria, filterCarrera, filterEstatus]);

  // Manejo de formulario de creación
  const handleFormChange = (field, value) => {
    setNewCourse((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateCourse = async () => {
    // Aquí deberías hacer el POST al backend, por ahora solo agrega localmente

    const response = await fetch(`${backendUrl}/secciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: newCourse.nombre,
        carrera: careers.find((c) => c.idCarrera === newCourse.carrera)?.nombre || "",
        profesores: newCourse.profesores,
        estatus: "Activo",
        letraSeccion: newCourse.letraSeccion,
      }),
    });


    const data = await response.json();

    if (response.ok) {
      setOpenNewDialog(false);
      setNewCourse({ nombre: "", carrera: "", profesores: [], estatus: "Activo" , letraSeccion: ""});
      handleGetCareersList();
      setSnackbar({
        open: true,
        message: "Curso creada con exitosamente",
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Fallo en la creacion de curso",
        severity: "error",
      });
    }
    setOpenNewDialog(false);
  };

  // Función para enviar comunicado general
  const handleEnviarComunicado = async () => {
    setLoadingComunicado(true);
    try {
      const response = await fetch(`${backendUrl}/comunicados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: comunicado.titulo,
          texto: comunicado.mensaje,
          idUsuario: null, // Puedes ajustar esto según tu lógica
        }),
      });
      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Comunicado enviado correctamente",
          severity: "success",
        });
        setOpenComunicado(false);
        setComunicado({ titulo: "", mensaje: "" });
      } else {
        setSnackbar({
          open: true,
          message: "Error al enviar el comunicado",
          severity: "error",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Error de conexión al enviar el comunicado",
        severity: "error",
      });
    }
    setLoadingComunicado(false);
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
              >
                <MDTypography variant="h6" color="white">
                  Gestión de Áreas
                </MDTypography>
              </MDBox>
              <br></br>
              <Grid container columns={4} spacing={3} px={2} py={1}>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="materia-select-label">Área</InputLabel>
                    <Select
                      labelId="materia-select-label"
                      id="materia-select"
                      label="Área"
                      value={filterMateria}
                      onChange={(e) => setFilterMateria(e.target.value)}
                    >
                      <MenuItem value="">Todas</MenuItem>
                      <MenuItem value="Trabajo de Grado">Trabajo de Grado</MenuItem>
                      <MenuItem value="Investigación 2">Investigación II</MenuItem>
                      <MenuItem value="Tutorias">Tutorias</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="carrera-select-label">Carrera</InputLabel>
                    <Select
                      labelId="carrera-select-label"
                      id="carrera-select"
                      label="Carrera"
                      value={filterCarrera}
                      onChange={(e) => setFilterCarrera(e.target.value)}
                    >
                      <MenuItem value="">Todas</MenuItem>
                      {careers.map((career) => (
                        <MenuItem key={career.idCarrera} value={career.nombre}>
                          {career.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="estatus-select-label">Estatus</InputLabel>
                    <Select
                      labelId="estatus-select-label"
                      id="estatus-select"
                      label="Estatus"
                      value={filterEstatus}
                      onChange={(e) => setFilterEstatus(e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="Activo">Activo</MenuItem>
                      <MenuItem value="Inactivo">Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item></Grid>
                <Grid item></Grid>
                <Grid item></Grid>

                <Grid item>
                  <Stack spacing={2} direction="row">
                    <Button variant="contained" onClick={() => setOpenNewDialog(true)}>
                      Agregar Área
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setOpenComunicado(true)}
                    >
                      Enviar Comunicado General
                    </Button>
                  </Stack>
                </Grid>

              </Grid>
              <MDBox pt={1}>
                <DataTable
                  table={{ columns, rows }}
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
        {/* Modal de Comunicado General */}
        <Dialog open={openComunicado} onClose={() => setOpenComunicado(false)}>
          <DialogTitle>Enviar Comunicado General</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Este comunicado será enviado a todas las áreas/materias.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Título"
              fullWidth
              variant="standard"
              value={comunicado.titulo}
              onChange={(e) => setComunicado({ ...comunicado, titulo: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Mensaje"
              fullWidth
              multiline
              minRows={3}
              variant="standard"
              value={comunicado.mensaje}
              onChange={(e) => setComunicado({ ...comunicado, mensaje: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenComunicado(false)}>Cancelar</Button>
            <Button
              onClick={handleEnviarComunicado}
              variant="contained"
              disabled={loadingComunicado || !comunicado.titulo || !comunicado.mensaje}
            >
              Enviar
            </Button>
          </DialogActions>
        </Dialog>
      <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)}>
        <DialogTitle>Agregar Area</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="nombre-materia-label">Nombre del Area</InputLabel>
                <Select
                  labelId="nombre-materia-label"
                  value={newCourse.nombre}
                  label="Nombre del Área"
                  onChange={(e) => handleFormChange("nombre", e.target.value)}
                >
                  <MenuItem value="Trabajo Especial de Grado">Trabajo de Grado</MenuItem>
                  <MenuItem value="investigación II">Investigación 2</MenuItem>
                  <MenuItem value="Tutorias">Tutorias</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="carrera-materia-label">Carrera</InputLabel>
                <Select
                  labelId="carrera-materia-label"
                  value={newCourse.carrera}
                  label="Carrera"
                  onChange={(e) => handleFormChange("carrera", e.target.value)}
                >
                  {careers.map((career) => (
                    <MenuItem key={career.idCarrera} value={career.idCarrera}>
                      {career.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="profesores-materia-label">Profesores</InputLabel>
                <Select
                  labelId="profesores-materia-label"
                  value={newCourse.profesores}
                  onChange={(e) => handleFormChange("profesores", e.target.value)}
                  label="Profesores"
                >
                  {professors.map((prof) => (
                    <MenuItem key={prof.idProfesor} value={prof.idProfesor}>
                      {prof.idProfesor+ ") " + prof.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" fullWidth>
                <TextField
                  label="Letra de Sección"
                  name="letraSeccion"
                  value={newCourse.letraSeccion}
                  onChange={(e) => handleFormChange("letraSeccion", e.target.value)}
                  fullWidth
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateCourse} variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default Course;
