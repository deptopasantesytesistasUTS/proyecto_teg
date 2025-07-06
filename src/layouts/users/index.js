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
import teachersTableData from "../teachers/data/teachersTableDatasTableData";

function Teachers() {
  const { columns, rows } = teachersTableData();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
                    <InputLabel id="demo-simple-select-label">Ordenar Por</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Age"
                      onChange={() => {}}
                      defaultValue={1}
                    >
                      <MenuItem value={1}>Nombre</MenuItem>
                      <MenuItem value={2}>Cedula</MenuItem>
                      <MenuItem value={3}>Carrera</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <MDTypography variant="h6">Filtrar por:</MDTypography>
                </Grid>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Carrera"
                      onChange={() => {}}
                      defaultValue={1}
                    >
                      <MenuItem value={1}>Docente</MenuItem>
                      <MenuItem value={2}>Tutor</MenuItem>
                      <MenuItem value={2}>Jurados</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="demo-simple-select-label">Carrera</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Age"
                      onChange={() => {}}
                      defaultValue={1}
                    >
                      <MenuItem value={1}>Ninguna</MenuItem>
                      <MenuItem value={1}>Informática</MenuItem>
                      <MenuItem value={2}>Diseño</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <MDTypography variant="h6">Buscar al: </MDTypography>
                </Grid>
                <Grid item size={6} width={200}>
                  <TextField id="outlined-basic" label="Docente" variant="outlined" />
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
      <Footer />
    </DashboardLayout>
  );
}

export default Teachers;
