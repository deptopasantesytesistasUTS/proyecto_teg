import * as React from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import { Button, Card, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";

// Overview page components
import Header from "./components/Header";

// Data

// Images
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import informatica from "assets/images/informatica.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function TeacherProfile() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const [open3, setOpen3] = React.useState(false);
  const handleOpen3 = () => setOpen3(true);
  const handleClose3 = () => setOpen3(false);
  const [open4, setOpen4] = React.useState(false);
  const handleOpen4 = () => setOpen4(true);
  const handleClose4 = () => setOpen4(false);
  return (
    <DashboardLayout>
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <Card>
                <MDTypography variant="h5"> Datos Profesionales: </MDTypography>
                <MDTypography>Pregrado: Ingenieria Informática</MDTypography>
                <MDTypography>Postgrado: Maestría en Gestión de Recursos Humanos</MDTypography>
              </Card>
              <br></br>
              <Card>
                <MDTypography variant="h5"> Datos de Contacto: </MDTypography>
                <MDTypography>Correo: perezmora12@gmail.com</MDTypography>
                <MDTypography>Teléfono: 0414-0343286</MDTypography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}></Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Grid item size={4}>
                <Stack mt={2} px={5} spacing={3}>
                  <Button
                    color="white"
                    variant="contained"
                    onClick={() => {
                      setOpen2(true), console.log(open2);
                    }}
                  >
                    Cambiar Datos de Identificación
                  </Button>

                  <Modal
                    open={open2}
                    onClose={handleClose2}
                    aria-labelledby="modal-modal-title2"
                    aria-describedby="modal-modal-description2"
                  >
                    <Box p={3} sx={style}>
                      <Typography id="modal-modal-title2" variant="h6" component="h2">
                        Introduzca los Datos de Identificacion del Docente:
                      </Typography>
                      <TextField id="outlined-basic" label="Primer Nombre" variant="outlined" />
                      <TextField id="outlined-basic" label="Segundo Nombre" variant="outlined" />
                      <TextField id="outlined-basic" label="Primer Apellido" variant="outlined" />
                      <TextField id="outlined-basic" label="Segundo Apellido" variant="outlined" />
                      <TextField
                        id="outlined-basic"
                        type="number"
                        label="Cedula"
                        variant="outlined"
                      />
                      <Button color="success" onClick={handleClose2}>
                        Aceptar
                      </Button>
                    </Box>
                  </Modal>

                  <Button onClick={handleOpen3} color="white" variant="contained">
                    Cambiar Número de Teléfono
                  </Button>

                  <Modal
                    open={open3}
                    onClose={handleClose3}
                    aria-labelledby="modal-modal-title2"
                    aria-describedby="modal-modal-description2"
                  >
                    <Box p={3} sx={style}>
                      <Typography id="modal-modal-title2" variant="h6" component="h2">
                        Introduzca el Número de Teléfono:
                      </Typography>
                      <TextField id="outlined-basic" label="Telefono" variant="outlined" />
                      <Button color="success" onClick={handleClose3}>
                        Aceptar
                      </Button>
                    </Box>
                  </Modal>

                  <Button color="white" variant="contained" onClick={handleOpen}>
                    Cambiar Correo Electrónico
                  </Button>

                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box p={3} sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Introduzca el Nuevo Correo:
                      </Typography>

                      <TextField
                        id="outlined-basic"
                        label="Correo Electrónico"
                        variant="outlined"
                      />
                      <Button color="success" onClick={handleClose}>
                        Aceptar
                      </Button>
                    </Box>
                  </Modal>

                  <Button onClick={handleOpen4} color="white" variant="contained">
                    Restaurar Constraseña
                  </Button>

                  <Modal
                    open={open4}
                    onClose={handleClose4}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box p={3} sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Si prosigue la contraseña del docente sera reseteada, la nueva contraseña le
                        llega al docente por correo
                      </Typography>

                      <Button color="error" onClick={handleClose4}>
                        Aceptar
                      </Button>
                    </Box>
                  </Modal>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Materias
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Actualmente el docente imparte:
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={informatica}
                label="Informática"
                title="Trabajo Especial de Grado (TEG)"
                description="Cargo: DOCENTE"
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "Ver Sección",
                }}
                authors={[
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={informatica}
                label="Informática"
                title="Investigación II"
                description="Cargo: DOCENTE"
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "Ver Sección",
                }}
                authors={[
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={informatica}
                label="Informática"
                title="Tutoria de Investigación II"
                description="Cargo: TUTOR"
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "Ver Sección",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default TeacherProfile;
