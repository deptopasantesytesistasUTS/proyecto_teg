import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Hidden from "@mui/material/Hidden";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflow: "auto",
};

// Ejemplo de anuncios
const exampleAnnouncements = [
  {
    title: "Entrega de Proyecto Final",
    description: "Recuerden que la entrega del proyecto final es el 15 de junio.",
    date: "2024-06-07",
    author: "Prof. Carlos Rodríguez",
  },
  {
    title: "Reunión Extraordinaria",
    description: "Habrá una reunión extraordinaria el viernes a las 10:00 am.",
    date: "2024-06-05",
    author: "Dr. María González",
  },
  {
    title: "Nuevo Recurso Disponible",
    description: "Se ha subido la guía de estilo para tesis en la sección de recursos.",
    date: "2024-06-03",
    author: "Prof. Carlos Rodríguez",
  },
];

function CourseViewAnuncios({
  titleProposals,
  handleTitleProposalChange,
  handleOpenTitleModal,
  openTitleModal,
  handleCloseTitleModal,
  handleSubmitTitleProposals,
}) {
  // Estado para el modal del formulario
  const [openFormModal, setOpenFormModal] = useState(false);

  // Puedes reemplazar exampleAnnouncements por props o estado real
  const announcements = exampleAnnouncements;

  // Handlers de ejemplo para editar y eliminar
  const handleEdit = (idx) => {
    alert(`Editar comunicado #${idx + 1}`);
  };
  const handleDelete = (idx) => {
    if (window.confirm("¿Seguro que deseas eliminar este comunicado?")) {
      alert(`Eliminar comunicado #${idx + 1}`);
    }
  };

  return (
    <MDBox>
      <MDTypography variant="h5" fontWeight="bold" mb={3} color="primary.main">
        Anuncios
      </MDTypography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AnnouncementIcon />}
        sx={{ mb: 3, fontWeight: "bold", boxShadow: 2 }}
        onClick={() => setOpenFormModal(true)}
      >
        Nuevo Anuncio
      </Button>
      {/* Modal para crear anuncio */}
      <Modal
        open={openFormModal}
        onClose={() => setOpenFormModal(false)}
        aria-labelledby="nuevo-anuncio-modal-title"
        aria-describedby="nuevo-anuncio-modal-description"
      >
        <Box sx={style}>
          <Typography id="nuevo-anuncio-modal-title" variant="h6" component="h2" mb={3}>
            Crear Nuevo Anuncio
          </Typography>
          <TextField
            label="Título del Anuncio"
            variant="outlined"
            fullWidth
            margin="normal"
            value={titleProposals[0]}
            onChange={(e) => handleTitleProposalChange(0, e.target.value)}
          />
          <TextField
            label="Descripción del Anuncio"
            variant="outlined"
            fullWidth
            margin="normal"
            value={titleProposals[1]}
            onChange={(e) => handleTitleProposalChange(1, e.target.value)}
            multiline
            rows={3}
          />
          <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
            <Button variant="outlined" onClick={() => setOpenFormModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitTitleProposals}
              disabled={!titleProposals.some((proposal) => proposal.trim() !== "")}
              startIcon={<SendIcon />}
            >
              Crear
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Tabla de anuncios */}
      <MDTypography variant="h6" fontWeight="bold" color="primary" mb={2} mt={4}>
        Lista de Anuncios
      </MDTypography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 160, fontWeight: "bold", color: "primary.main", py: 2.5, fontSize: 16, letterSpacing: 1, textAlign: 'left', pl: 10 }}>
                Título
              </TableCell>
              <TableCell sx={{ width: 300, fontWeight: "bold", color: "primary.main", py: 2.5, fontSize: 16, letterSpacing: 1, textAlign: 'left', pl: 15 }}>
                Descripción
              </TableCell>
              <TableCell sx={{ width: 100, fontWeight: "bold", color: "primary.main", py: 2.5, fontSize: 16, letterSpacing: 1, textAlign: 'left', pl: 15 }}>
                Fecha
              </TableCell>
              <TableCell sx={{ width: 100, fontWeight: "bold", color: "primary.main", py: 2.5, fontSize: 16, letterSpacing: 1, textAlign: 'left', pl: 25 }}>
                Autor
              </TableCell>
              <TableCell sx={{ width: 100, fontWeight: "bold", color: "primary.main", py: 2.5, fontSize: 16, letterSpacing: 1, textAlign: 'center', pl: 25 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {announcements.map((a, idx) => (
              <TableRow key={idx} hover sx={{ verticalAlign: 'top' }}>
                <TableCell sx={{ width: 160, whiteSpace: 'pre-line', wordBreak: 'break-word', verticalAlign: 'top', textAlign: 'left', py: 1 }}>
                  {a.title}
                </TableCell>
                <TableCell sx={{ width: 320, whiteSpace: 'pre-line', wordBreak: 'break-word', verticalAlign: 'top', textAlign: 'left', py: 1 }}>
                  {a.description}
                </TableCell>
                <TableCell sx={{ width: 100, verticalAlign: 'top', textAlign: 'left', py: 1 }}>
                  {a.date}
                </TableCell>
                <TableCell sx={{ width: 100, verticalAlign: 'top', textAlign: 'left', py: 1 }}>
                  {a.author}
                </TableCell>
                <TableCell sx={{ width: 100, verticalAlign: 'top', textAlign: 'center', py: 1 }}>
                  <Tooltip title="Editar" arrow>
                    <IconButton size="small" color="primary" onClick={() => handleEdit(idx)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar" arrow>
                    <IconButton size="small" color="error" onClick={() => handleDelete(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MDBox>
  );
}

CourseViewAnuncios.propTypes = {
  titleProposals: PropTypes.array.isRequired,
  handleTitleProposalChange: PropTypes.func.isRequired,
  handleOpenTitleModal: PropTypes.func.isRequired,
  openTitleModal: PropTypes.bool.isRequired,
  handleCloseTitleModal: PropTypes.func.isRequired,
  handleSubmitTitleProposals: PropTypes.func.isRequired,
};

export default CourseViewAnuncios;
