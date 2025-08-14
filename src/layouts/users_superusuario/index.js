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
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";

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
  { Header: "Rol", accessor: "rol" },
  { Header: "Estado", accessor: "status" },
  { Header: "Acciones", accessor: "acciones" },
];

function UsersSuperusuario() {
  // Estado para la lista de usuarios (administradores)
  const [rows, setRows] = React.useState([]);

  // Control modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");
  
  // Control modal de confirmación de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [adminToDelete, setAdminToDelete] = React.useState(null);

  // Estado formulario
  const [form, setForm] = React.useState({
    correo: "",
    password: "",
    role_id: 1,
    status: "activo",
  });

  // Obtener lista de administradores
  const obtenerAdministradores = async () => {
    try {
      console.log("Intentando obtener administradores...");
      const response = await fetch("http://localhost:3003/api/superusuario/administradores", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Respuesta del servidor:", response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log("Administradores obtenidos del backend:", data);
        console.log("Primer administrador (ejemplo):", data[0]);
        
        // Transformar los datos para la tabla
        const administradoresFormateados = data.map(admin => ({
          correo: admin.correo,
          rol: admin.Roles?.nombre || "Admin",
          status: admin.status,
          id: admin.userId,
          acciones: (
            <IconButton
              color="error"
              onClick={() => handleEliminarClick({
                id: admin.userId,
                correo: admin.correo,
                rol: admin.Roles?.nombre || "Admin",
                status: admin.status
              })}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          )
        }));
        
        console.log("Administradores formateados:", administradoresFormateados);
        setRows(administradoresFormateados);
      } else {
        const errorData = await response.text();
        console.error("Error al obtener administradores:", response.status, errorData);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  // Abrir modal de confirmación de eliminación
  const handleEliminarClick = (admin) => {
    setAdminToDelete(admin);
    setDeleteModalOpen(true);
  };

  // Cerrar modal de confirmación
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setAdminToDelete(null);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;

    console.log("Confirmando eliminación de administrador:", adminToDelete);
    console.log("ID del administrador a eliminar:", adminToDelete.id);

    // Verificar que el ID existe
    if (!adminToDelete.id) {
      console.error("Error: No se encontró el ID del administrador");
      setSuccessMsg("Error: No se pudo identificar el administrador");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 3000);
      handleCloseDeleteModal();
      return;
    }

    try {
      const response = await fetch(`http://localhost:3003/api/superusuario/administradores/${adminToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Respuesta de eliminación:", response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log("Resultado de eliminación:", result);
        setSuccessMsg("¡Administrador eliminado exitosamente!");
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 3000);
        obtenerAdministradores(); // Recargar la lista
      } else {
        const errorData = await response.text();
        console.error("Error en eliminación:", response.status, errorData);
        setSuccessMsg("Error al eliminar administrador");
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 3000);
      }
    } catch (error) {
      console.error("Error de conexión en eliminación:", error);
      setSuccessMsg("Error de conexión");
      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 3000);
    } finally {
      handleCloseDeleteModal();
    }
  };

  // Cargar administradores al montar el componente
  React.useEffect(() => {
    obtenerAdministradores();
  }, []);

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
        setForm({ correo: "", password: "", role_id: 1, status: "activo" });
        handleClose();
        setSuccessMsg("¡Usuario registrado exitosamente!");
        setSuccessOpen(true);
        setTimeout(() => setSuccessOpen(false), 3000);
        obtenerAdministradores(); // Recargar la lista
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
                    <MDTypography id="modal-success-title" variant="h6" component="h2" color="success" align="center">
                      {successMsg}
                    </MDTypography>
                    <Button variant="contained" color="success" onClick={() => setSuccessOpen(false)}>
                      Cerrar
                    </Button>
                  </Box>
                </Modal>
                
                {/* Modal de confirmación de eliminación */}
                <Modal
                  open={deleteModalOpen}
                  onClose={handleCloseDeleteModal}
                  aria-labelledby="modal-delete-title"
                  aria-describedby="modal-delete-description"
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
                      minWidth: 400,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <WarningIcon sx={{ fontSize: 60, color: "#f57c00" }} />
                    <MDTypography id="modal-delete-title" variant="h6" component="h2" color="warning" align="center">
                      Confirmar Eliminación
                    </MDTypography>
                    <MDTypography variant="body1" align="center" color="text">
                      ¿Estás seguro de que quieres eliminar al administrador?
                    </MDTypography>
                    {adminToDelete && (
                      <MDBox 
                        sx={{ 
                          bgcolor: "grey.100", 
                          p: 2, 
                          borderRadius: 2, 
                          width: "100%",
                          textAlign: "center"
                        }}
                      >
                        <MDTypography variant="body2" fontWeight="medium">
                          {adminToDelete.correo}
                        </MDTypography>
                      </MDBox>
                    )}
                    <MDTypography variant="body2" align="center" color="text">
                      Esta acción no se puede deshacer.
                    </MDTypography>
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        onClick={handleCloseDeleteModal}
                        sx={{ minWidth: 100 }}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleConfirmDelete}
                        sx={{ minWidth: 100 }}
                      >
                        Eliminar
                      </Button>
                    </Box>
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

