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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

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
  const [careers, setCareers] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([
    {
      nombre: "Juan Perez",
      cedula: "1234567890",
      carrera: "Diseño",
      materia: "TEG",
      estatus: "Activo",
      correo: "juan.perez@gmail.com",
      telf: "1234567890",
    },
    {
      nombre: "Luis Perez",
      cedula: "453534890",
      carrera: "Informatica",
      materia: "TEG",
      estatus: "Activo",
      correo: "juan.perez@gmail.com",
      telf: "1234567890",
    },
  ]);

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
    cedula: "",
  });

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetStudents = async () => {
    const response = await fetch(`${backendUrl}/students`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setStudents(data);
  };
  const handleGetCareers = async () => {
    const response = await fetch(`${backendUrl}/carreras`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      setCareers(data);
    } else {
    }
  };

  const handleGetSections = async (carrera) => {
    const response = await fetch(`${backendUrl}/secciones/${carrera}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      setSections(data);
    } else {
      console.error("Failed to fetch sections");
    }
  };

  useEffect(() => {
    handleGetCareers();
  }, []);

  const handleAddStudent = () => {
    // Unir los nombres y apellidos para el campo 'nombre'
    const nombre =
      `${newStudent.nombre1} ${newStudent.nombre2} ${newStudent.apellido1} ${newStudent.apellido2}`
        .replace(/  +/g, " ")
        .trim();
    setStudents((prev) => [
      ...prev,
      {
        nombre,
        cedula: newStudent.cedula,
        carrera: newStudent.carrera,
        materia: "", // Puedes ajustar esto si tienes materia
        estatus: "Activo",
        correo: newStudent.correo,
        telf: newStudent.telf,
        seccion: newStudent.seccion,
      },
    ]);
    setNewStudent({
      nombre1: "",
      nombre2: "",
      apellido1: "",
      apellido2: "",
      correo: "",
      telf: "",
      carrera: "",
      seccion: "",
      cedula: "",
    });
    handleCloseAdd();
  };

  const { columns, rows } = studentsTableData(students);

  // Estados para filtros y búsqueda
  const [orderBy, setOrderBy] = useState("Nombre");
  const [filterCarrera, setFilterCarrera] = useState("");
  const [filterMateria, setFilterMateria] = useState("");
  const [search, setSearch] = useState("");

  // Función para filtrar, buscar y ordenar
  const getFilteredRows = () => {
    let filtered = [...students];
    // Filtrar por carrera
    if (filterCarrera) {
      filtered = filtered.filter((row) => row.carrera === filterCarrera);
    }
    // Filtrar por materia
    if (filterMateria) {
      filtered = filtered.filter((row) => row.materia === filterMateria);
    }
    // Buscar por nombre
    if (search) {
      filtered = filtered.filter((row) => row.nombre.toLowerCase().includes(search.toLowerCase()));
    }
    // Ordenar
    if (orderBy === "Nombre") {
      filtered = filtered.filter((row) => row && row.nombre); // Solo los que tienen nombre
      filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orderBy === "Cedula") {
      filtered = filtered.filter((row) => row && row.cedula);
      filtered.sort((a, b) => a.cedula.localeCompare(b.cedula));
    } else if (orderBy === "Carrera") {
      filtered = filtered.filter((row) => row && row.carrera);
      filtered.sort((a, b) => a.carrera.localeCompare(b.carrera));
    }
    return studentsTableData(filtered).rows;
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
                      <MenuItem value="Diseño">Diseño</MenuItem>
                      <MenuItem value="Informática">Informática</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="materia-label">Materia</InputLabel>
                    <Select
                      labelId="materia-label"
                      id="materia-select"
                      label="Materia"
                      value={filterMateria}
                      onChange={(e) => setFilterMateria(e.target.value)}
                    >
                      <MenuItem value="">Todas</MenuItem>
                      <MenuItem value="TEG">TEG</MenuItem>
                      <MenuItem value="Investigación II">Investigación II</MenuItem>
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
                  table={{ columns: columns, rows: getFilteredRows() }}
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
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Primer Nombre"
              name="nombre1"
              value={newStudent.nombre1}
              onChange={handleNewStudentChange}
              fullWidth
            />
            <TextField
              label="Segundo Nombre"
              name="nombre2"
              value={newStudent.nombre2}
              onChange={handleNewStudentChange}
              fullWidth
            />
            <TextField
              label="Primer Apellido"
              name="apellido1"
              value={newStudent.apellido1}
              onChange={handleNewStudentChange}
              fullWidth
            />
            <TextField
              label="Segundo Apellido"
              name="apellido2"
              value={newStudent.apellido2}
              onChange={handleNewStudentChange}
              fullWidth
            />
            <TextField
              label="Correo"
              name="correo"
              value={newStudent.correo}
              onChange={handleNewStudentChange}
              fullWidth
            />
            <TextField
              label="Teléfono"
              name="telf"
              value={newStudent.telf}
              onChange={handleNewStudentChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="carrera-add-label">Carrera</InputLabel>
              <Select
                labelId="carrera-add-label"
                name="carrera"
                value={newStudent.carrera}
                label="Carrera"
                onChange={handleNewStudentChange}
              >
                <MenuItem value="">Seleccione una carrera</MenuItem>
                <MenuItem value="Diseño">Diseño</MenuItem>
                <MenuItem value="Informática">Informática</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="seccion-add-label">Sección</InputLabel>
              <Select
                labelId="seccion-add-label"
                name="seccion"
                value={newStudent.seccion}
                label="Sección"
                onChange={handleNewStudentChange}
              >
                <MenuItem value="">Seleccione una sección</MenuItem>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Cédula"
              name="cedula"
              value={newStudent.cedula}
              onChange={handleNewStudentChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancelar</Button>
          <Button onClick={handleAddStudent} variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}

export default Students;
