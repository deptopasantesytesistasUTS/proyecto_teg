import * as React from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// Columnas para la tabla de usuarios administradores
const adminColumns = [
  { Header: "Correo", accessor: "correo" },
  { Header: "Rol ID", accessor: "role_id" },
  { Header: "Estado", accessor: "status" },
];

function UsersSuperusuario() {
  // Estado para la lista de usuarios (administradores)
  const [rows, setRows] = React.useState([
    { correo: "admin@example.com", role_id: 1, status: "activo" },
  ]);

  // Control modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");

  // Estado formulario
  const [form, setForm] = React.useState({
    correo: "",
    password: "",
    role_id: 1,
    status: "activo",
  });

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar nuevo usuario (llamada a backend)
  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3003/api/superusuario/crearadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: form.correo,
          password: form.password,
          role_id: Number(form.role_id),
          status: form.status
        })
      });

      const data = await response.json();
      if (response.ok) {
        setRows((prev) => [
          ...prev,
          {
            correo: data.usuario.correo,
            role_id: data.usuario.role_id,
            status: data.usuario.status
          }
        ]);
        setForm({ correo: "", password: "", role_id: 1, status: "activo" });
        handleClose();
        setSuccessMsg("¡Usuario registrado exitosamente!");
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 3000); // Cierra el modal después de 3 segundos
      } else {
        setSuccessMsg(data.error || "Error al crear usuario");
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 3000);
      }
    } catch (error) {
      setSuccessMsg("Error de conexión");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 3000);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
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
                  Listado de Administradores
                </MDTypography>
              </MDBox>

              <br />

              <Stack spacing={2} direction="row" px={2} py={1}>
                <Button onClick={handleOpen} variant="contained" color="primary">
                  Agregar Administrador
                </Button>

                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title2" aria-describedby="modal-modal-description2">
                  <MDBox p={4} sx={style}>
                    <MDTypography id="modal-modal-title2" variant="h5" component="h2" mb={3}>
                      Agregar Nuevo Administrador
                    </MDTypography>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Correo Electrónico"
                          variant="outlined"
                          size="medium"
                          type="email"
                          name="correo"
                          value={form.correo}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Contraseña"
                          variant="outlined"
                          size="medium"
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel id="role-label">Rol</InputLabel>
                          <Select
                            labelId="role-label"
                            name="role_id"
                            value={form.role_id}
                            label="Rol"
                            onChange={handleChange}
                          >
                            <MenuItem value={1}>Administrador</MenuItem>
                            <MenuItem value={2}>Superusuario</MenuItem>
                            {/* Agrega más roles según tu sistema */}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                    </Grid>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                      <Button variant="outlined" onClick={handleClose} sx={{ minWidth: 100 }}>
                        Cancelar
                      </Button>
                      <Button variant="contained" color="success" onClick={handleSave} sx={{ minWidth: 100 }}>
                        Guardar
                      </Button>
                    </Box>
                  </MDBox>
                </Modal>
                {/* Modal de éxito */}
                <Modal
                  open={successOpen}
                  onClose={() => setSuccessOpen(false)}
                  aria-labelledby="modal-success-title"
                  aria-describedby="modal-success-description"
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      bgcolor: "background.paper",
                      borderRadius: 3,
                      boxShadow: 24,
                      p: 4,
                      minWidth: 350,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <CheckCircleOutlineIcon sx={{ fontSize: 60, color: "#4caf50" }} />
                    <MDTypography id="modal-success-title" variant="h6" component="h2" color="success.main" align="center">
                      {successMsg}
                    </MDTypography>
                    <Button variant="contained" color="success" onClick={() => setSuccessOpen(false)}>
                      Cerrar
                    </Button>
                  </Box>
                </Modal>
              </Stack>

              <MDBox pt={1} px={2} pb={2}>
                <DataTable
                  table={{ columns: adminColumns, rows }}
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

export default UsersSuperusuario;

