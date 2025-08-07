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

function Teachers() {
  const { columns, rows: originalRows } = teachersTableData();
  
  // State for filters
  const [sortBy, setSortBy] = React.useState("1");
  const [roleFilter, setRoleFilter] = React.useState("1");
  const [careerFilter, setCareerFilter] = React.useState("1");
  const [searchTerm, setSearchTerm] = React.useState("");
  
  // State for modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Filter and sort the data
  const getFilteredAndSortedRows = () => {
    let filteredRows = [...originalRows];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filteredRows = filteredRows.filter((row) => {
        const name = row.profesor.props.name || "";
        const id = row.profesor.props.id || "";
        const email = row.profesor.props.email || "";
        const searchLower = searchTerm.toLowerCase();
        
        return (
          name.toLowerCase().includes(searchLower) ||
          id.toLowerCase().includes(searchLower) ||
          email.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply role filter
    if (roleFilter !== "1") {
      filteredRows = filteredRows.filter((row) => {
        const description = row.carrera.props.description || "";
        const searchLower = searchTerm.toLowerCase();
        
        switch (roleFilter) {
          case "2": // Tutor
            return description.toLowerCase().includes("tutor");
          case "3": // Jurado
            return description.toLowerCase().includes("jurado");
            case "4": // Jurado
            return description.toLowerCase().includes("docente");
          default:
            return true;
        }
      });
    }

    // Apply career filter
    if (careerFilter !== "1") {
      filteredRows = filteredRows.filter((row) => {
        const title = row.carrera.props.title || "";
        
        switch (careerFilter) {
          case "2": // Informática
            return title.toLowerCase().includes("informática");
          case "3": // Diseño
            return title.toLowerCase().includes("diseño");
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (sortBy !== "1") {
      filteredRows.sort((a, b) => {
        const nameA = a.profesor.props.name || "";
        const nameB = b.profesor.props.name || "";
        const idA = a.profesor.props.id || "";
        const idB = b.profesor.props.id || "";
        const careerA = a.carrera.props.title || "";
        const careerB = b.carrera.props.title || "";
        
        switch (sortBy) {
          case "2": // Nombre
            return nameA.localeCompare(nameB);
          case "3": // Cédula
            return idA.localeCompare(idB);
          case "4": // Carrera
            return careerA.localeCompare(careerB);
          default:
            return 0;
        }
      });
    }

    return filteredRows;
  };

  const filteredRows = getFilteredAndSortedRows();

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
                      <MenuItem value="4">Carrera</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <MDTypography variant="h6">Filtrar por:</MDTypography>
                </Grid>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="role-select-label">Rol</InputLabel>
                    <Select
                      labelId="role-select-label"
                      id="role-select"
                      value={roleFilter}
                      label="Rol"
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <MenuItem value="1">Todos los roles</MenuItem>
                      <MenuItem value="2">Tutor</MenuItem>
                      <MenuItem value="3">Jurado</MenuItem>
                      <MenuItem value="4">Docente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="career-select-label">Carrera</InputLabel>
                    <Select
                      labelId="career-select-label"
                      id="career-select"
                      value={careerFilter}
                      label="Carrera"
                      onChange={(e) => setCareerFilter(e.target.value)}
                    >
                      <MenuItem value="1">Todas las carreras</MenuItem>
                      <MenuItem value="2">Informática</MenuItem>
                      <MenuItem value="3">Diseño</MenuItem>
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
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Segundo Nombre"
                              variant="outlined"
                              size="medium"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Primer Apellido"
                              variant="outlined"
                              size="medium"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Segundo Apellido"
                              variant="outlined"
                              size="medium"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Cédula"
                              variant="outlined"
                              size="medium"
                            />
                          </Grid>
                        </Grid>

                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                          <Button variant="outlined" onClick={handleClose} sx={{ minWidth: 100 }}>
                            Cancelar
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={handleClose}
                            sx={{ minWidth: 100 }}
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
                  table={{ columns, rows: filteredRows }}
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
