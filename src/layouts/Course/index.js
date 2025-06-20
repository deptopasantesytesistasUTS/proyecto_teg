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

function Course() {
  const { columns, rows } = coursesTableData();

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
                  Gestión de Materias
                </MDTypography>
              </MDBox>
              <br></br>
              <Grid container columns={4} spacing={3} px={2} py={1}>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="ordenar-select-label">Ordenar Por</InputLabel>
                    <Select
                      labelId="ordenar-select-label"
                      id="ordenar-select"
                      label="Ordenar Por"
                      onChange={() => {}}
                      defaultValue={1}
                    >
                      <MenuItem value={1}>Nombre</MenuItem>
                      <MenuItem value={2}>Código</MenuItem>
                      <MenuItem value={3}>Profesor</MenuItem>
                      <MenuItem value={4}>Créditos</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <MDTypography variant="h6">Filtrar por:</MDTypography>
                </Grid>

                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="carrera-select-label">Carrera</InputLabel>
                    <Select
                      labelId="carrera-select-label"
                      id="carrera-select"
                      label="Carrera"
                      onChange={() => {}}
                      defaultValue={1}
                    >
                      <MenuItem value={1}>Todas</MenuItem>
                      <MenuItem value={2}>Diseño</MenuItem>
                      <MenuItem value={3}>Informática</MenuItem>
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
                      onChange={() => {}}
                      defaultValue={1}
                    >
                      <MenuItem value={1}>Todos</MenuItem>
                      <MenuItem value={2}>Activo</MenuItem>
                      <MenuItem value={3}>Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item></Grid>
                <Grid item></Grid>
                <Grid item></Grid>
                <Grid item>
                  <Stack spacing={2} direction="row">
                    <Button variant="contained" color="info">
                      Agregar Materia
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
      <Footer />
    </DashboardLayout>
  );
}

export default Course;
