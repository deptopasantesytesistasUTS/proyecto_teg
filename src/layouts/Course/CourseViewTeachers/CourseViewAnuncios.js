import React, { useEffect, useState } from "react";
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
import { backendUrl } from "config";

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

function CourseViewAnuncios({
  titleProposals,
  handleTitleProposalChange,
  handleOpenTitleModal,
  openTitleModal,
  handleCloseTitleModal,
  handleSubmitTitleProposals,
  seccionId,
  userId,
}) {
  const [openFormModal, setOpenFormModal] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const url = seccionId
        ? `${backendUrl}/comunicados?seccionId=${seccionId}&limit=50`
        : `${backendUrl}/comunicados?limit=50`;
      const res = await fetch(url);
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (e) {
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [seccionId]);

  const handleCreate = async () => {
    try {
      const [titulo, texto] = titleProposals;
      const body = {
        titulo,
        texto,
        idUsuario: userId || null,
        seccionesIds: seccionId ? [seccionId] : [],
      };
      const res = await fetch(`${backendUrl}/comunicados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setOpenFormModal(false);
        fetchAnnouncements();
      }
    } catch (e) {}
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este comunicado?")) return;
    try {
      const res = await fetch(`${backendUrl}/comunicados/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchAnnouncements();
    } catch (e) {}
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
              onClick={handleCreate}
              disabled={!titleProposals.some((proposal) => proposal.trim() !== "")}
              startIcon={<SendIcon />}
            >
              Crear
            </Button>
          </Box>
        </Box>
      </Modal>

      <MDTypography variant="h6" fontWeight="bold" color="primary" mb={2} mt={4}>
        Lista de Anuncios
      </MDTypography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 80, fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ width: 220, fontWeight: "bold" }}>Título</TableCell>
              <TableCell sx={{ width: 360, fontWeight: "bold" }}>Descripción</TableCell>
              <TableCell sx={{ width: 140, fontWeight: "bold" }}>Fecha</TableCell>
              <TableCell sx={{ width: 120, fontWeight: "bold", textAlign: 'center' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5}>Cargando...</TableCell></TableRow>
            ) : announcements.length === 0 ? (
              <TableRow><TableCell colSpan={5}>Sin anuncios</TableCell></TableRow>
            ) : announcements.map((a, idx) => (
              <TableRow key={a.idComunicado || idx} hover sx={{ verticalAlign: 'top' }}>
                <TableCell>{a.idComunicado}</TableCell>
                <TableCell>{a.titulo}</TableCell>
                <TableCell sx={{ whiteSpace: 'pre-line' }}>{a.texto}</TableCell>
                <TableCell>{a.created_At ? new Date(a.created_At).toLocaleString() : ''}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Tooltip title="Eliminar" arrow>
                    <IconButton size="small" color="error" onClick={() => handleDelete(a.idComunicado)}>
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
  handleCloseTitleModal: PropTypes.bool,
  handleSubmitTitleProposals: PropTypes.func,
  seccionId: PropTypes.number,
  userId: PropTypes.number,
};

export default CourseViewAnuncios;
