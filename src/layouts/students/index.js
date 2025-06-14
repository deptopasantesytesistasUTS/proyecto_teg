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

function Students() {
  const { columns, rows } = studentsTableData();

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
                  Listado de Estudiantes
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
                    <InputLabel id="demo-simple-select-label">Carrera</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Carrera"
                      onChange={() => {}}
                      defaultValue={1}
                    >
                      <MenuItem value={1}>Diseño</MenuItem>
                      <MenuItem value={2}>Informática</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={6} width={200}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="demo-simple-select-label">Materia</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Age"
                      onChange={() => {}}
                      defaultValue={1}
                    >
                      <MenuItem value={1}>TEG</MenuItem>
                      <MenuItem value={2}>Investigación II</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item></Grid>
                <Grid item></Grid>
                <Grid item></Grid>
                <Grid item>
                  <Stack spacing={2} direction="row">
                    <Button variant="text">Agregar Estudiante</Button>
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

export default Students;
