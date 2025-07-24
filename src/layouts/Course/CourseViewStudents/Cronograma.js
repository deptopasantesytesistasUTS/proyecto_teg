import React, { useState } from "react";
import { Box, Typography, Paper, Button, Chip, List, ListItem, ListItemText, Stack, useMediaQuery, TextField, Divider } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

const entregas = [
  { fecha: "2024-06-10", descripcion: "Entrega de Título" },
  { fecha: "2024-07-01", descripcion: "Borrador 1" },
  { fecha: "2024-08-01", descripcion: "Borrador 2" },
  { fecha: "2024-09-01", descripcion: "Borrador Final" },
  { fecha: "2024-09-15", descripcion: "Entrega Final y Defensa" },
];

// Declaración de VisuallyHiddenInput fuera de la función y con sintaxis válida
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function Cronograma() {
  const [archivo, setArchivo] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [archivoSubido, setArchivoSubido] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [descripcionSubida, setDescripcionSubida] = useState("");
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const handleArchivoChange = (e) => {
    if (e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const handleSubir = () => {
    if (!archivo) return;
    setSubiendo(true);
    setTimeout(() => {
      setArchivoSubido(archivo.name);
      setDescripcionSubida(descripcion);
      setArchivo(null);
      setDescripcion("");
      setSubiendo(false);
    }, 1200);
  };

  const pdfUrl = "/ruta/al/cronograma.pdf"; // Cambia esto por la ruta real

  // Estado para archivo de carga académica
  const [archivoCarga, setArchivoCarga] = React.useState(null);
  const [archivoCargaSubido, setArchivoCargaSubido] = React.useState(null);
  const [subiendoCarga, setSubiendoCarga] = React.useState(false);

  const handleArchivoCargaChange = (e) => {
    setArchivoCarga(e.target.files[0]);
  };
  const handleSubirCarga = () => {
    setSubiendoCarga(true);
    setTimeout(() => {
      setArchivoCargaSubido(archivoCarga.name);
      setArchivoCarga(null);
      setSubiendoCarga(false);
    }, 1200);
  };

  // Define la fecha límite para carga académica
  const fechaLimiteCarga = "2026-06-05T23:59";
  const formatoFecha = (fechaLimite) => {
    const fecha = new Date(fechaLimite);
    return fecha.toLocaleString("es-VE", { dateStyle: "medium", timeStyle: "short" });
  };
  const vencidaCarga = new Date(fechaLimiteCarga) < new Date();

  return (
    <Box
      maxWidth={1200}
      mx="auto"
      py={{ xs: 2, md: 4 }}
      px={{ xs: 1, md: 2 }}
      sx={{
        background: '#fff',
        borderRadius: { xs: 0, md: 4 },
        boxShadow: { xs: 'none', md: '0 4px 24px 0 rgba(31, 38, 135, 0.08)' },
        minHeight: 400,
      }}
    >
     <Paper>
        <Stack
          direction={isMdUp ? 'row' : 'column'}
          spacing={4}
          alignItems={isMdUp ? 'stretch' : 'center'}
          justifyContent="center"
          sx={{ width: '100%' }}
        >
          {/* Stack vertical para subir y descargar cronograma */}
          <Stack direction="column" spacing={3} sx={{ minWidth: 340, flex: 1 }}>
            {/* Caja: Subir carga académica */}
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, minWidth: 100, bgcolor: vencidaCarga && !archivoCargaSubido ? '#fff3f3' : 'background.paper' }}>
              <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: 'rgb(25, 118, 210)' }} align="center">
                Subir carga académica
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgb(25, 118, 210)' }} mb={1}>
                Fecha límite: {formatoFecha(fechaLimiteCarga)}
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Button
                  variant="contained"
                  component="label"
                  size="small"
                  disabled={subiendoCarga}
                >
                  Seleccionar Archivo
                  <input
                    type="file"
                    hidden
                    onChange={handleArchivoCargaChange}
                  />
                </Button>
                <TextField
                  value={archivoCarga?.name || ""}
                  placeholder="Ningún archivo seleccionado"
                  size="small"
                  InputProps={{ readOnly: true }}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={handleSubirCarga}
                  disabled={!archivoCarga || subiendoCarga}
                >
                  {subiendoCarga ? 'Subiendo...' : 'Subir'}
                </Button>
              </Box>
              {archivoCargaSubido && (
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Chip label={archivoCargaSubido} color="info" size="small" />
                  <Typography variant="caption" color="success.main">
                    Entregado
                  </Typography>
                </Box>
              )}
            </Paper>
            {/* Caja: Descargar cronograma (PDF) */}
            <Paper sx={{
              p: 3,
              mt: 10,
              minWidth: 180,
              maxWidth: 260,
              boxShadow: 'none',
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: 'rgb(25, 118, 210)' }} align="center">
                Descargar cronograma 
              </Typography>
              <Button
                component="a"
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 1 , width: '100%' , height: '150%'}}
              >
                (PDF)
              </Button>
            </Paper>
          </Stack>

          {/* Entregas y fechas */}
          <Paper
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              boxShadow: '0 2px 12px 0 rgba(25, 118, 210, 0.08)',
              minWidth: 340,
              width: '100%',
              maxWidth: 500,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 320, md: 420 },
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: 'rgb(25, 118, 210)' }} align="center">
              Entregas y Fechas
            </Typography>
            <Divider sx={{ my: 2, bgcolor: 'primary.main', height: 3, borderRadius: 2, width: '80%' }} />
            <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, width: '100%' }}>
              {entregas.map((e, idx) => (
                <ListItem key={idx} divider={idx < entregas.length - 1} sx={{ py: 2 }}>
                  <ListItemText
                    primary={<b style={{ color: 'rgb(25, 118, 210)' }}>{e.fecha}</b>}
                    secondary={e.descripcion}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: 18 }}
                    secondaryTypographyProps={{ color: 'text.secondary', fontSize: 16 }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Cronograma; 