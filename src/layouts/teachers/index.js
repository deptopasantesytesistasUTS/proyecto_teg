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

  // Filtrar y ordenar la lista
  const getFilteredAndSortedRows = () => {
    let filteredRows = [...teachers];
    // Filtro de búsqueda
    if (searchTerm.trim() !== "") {
      filteredRows = filteredRows.filter((teacher) => {
        console.log(teacher);
        const name = `${teacher.nombre}`.trim();
        const id = `${teacher.cedula}`|| "";
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
        const idA = a.cedula || "";
        const idB = b.cedula || "";
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

  // Modal: manejar cambios en el formulario
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Modal: agregar docente
  const handleAddTeacher = async () => {
    setLoading(true);
    setError("");
    try {
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
  const filteredColumns = columns.filter(col => col.accessor !== "carrera");

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
                              onChange={e => handleFormChange("firstName", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Segundo Nombre"
                              variant="outlined"
                              size="medium"
                              value={formData.secondName}
                              onChange={e => handleFormChange("secondName", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Primer Apellido"
                              variant="outlined"
                              size="medium"
                              value={formData.firstLastName}
                              onChange={e => handleFormChange("firstLastName", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Segundo Apellido"
                              variant="outlined"
                              size="medium"
                              value={formData.secondLastName}
                              onChange={e => handleFormChange("secondLastName", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Cédula"
                              variant="outlined"
                              size="medium"
                              value={formData.id}
                              onChange={e => handleFormChange("id", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Correo Electrónico"
                              variant="outlined"
                              size="medium"
                              value={formData.email}
                              onChange={e => handleFormChange("email", e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Teléfono"
                              variant="outlined"
                              size="medium"
                              value={formData.telf}
                              onChange={e => handleFormChange("telf", e.target.value)}
                            />
                          </Grid>
                        </Grid>
                        {error && (
                          <MDTypography color="error" mt={2}>{error}</MDTypography>
                        )}
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
      <Footer />
    </DashboardLayout>
  );
}

export default Teachers;
