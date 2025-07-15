import React, { useState } from "react";
import { Box, Typography, Paper, Button, Chip, List, ListItem, ListItemText, Stack, useMediaQuery, TextField, Divider } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const entregas = [
  { fecha: "2024-06-10", descripcion: "Entrega de Título" },
  { fecha: "2024-07-01", descripcion: "Borrador 1" },
  { fecha: "2024-08-01", descripcion: "Borrador 2" },
  { fecha: "2024-09-01", descripcion: "Borrador Final" },
  { fecha: "2024-09-15", descripcion: "Entrega Final y Defensa" },
];

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
      <Stack
        direction={isMdUp ? 'row' : 'column'}
        spacing={4}
        alignItems={isMdUp ? 'stretch' : 'center'}
        justifyContent="center"
        sx={{ width: '100%' }}
      >
        {/* Subida de cronograma optimizada */}
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            boxShadow: '0 2px 12px 0 rgba(25, 118, 210, 0.08)',
            minWidth: 340,
            width: '10%',
            maxWidth: 440,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: 240, md: 280 },
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: 'rgb(25, 118, 210)' }} align="center">
            Subir Cronograma Personal
          </Typography>
          <Divider sx={{ my: 2, bgcolor: 'primary.main', height: 3, borderRadius: 2, width: '80%' }} />
          <Stack direction="row" spacing={2} alignItems="center" width="100%" justifyContent="center" mb={1}>
            <Button
              variant="contained"
              component="label"
              color="primary"
              startIcon={<UploadFileIcon />}
              disabled={subiendo}
              sx={{ minWidth: 100 }}
            >
              {archivo ? "Cambiar archivo" : "Subir archivo"}
              <input type="file" hidden onChange={handleArchivoChange} />
            </Button>
            {archivo && (
              <Chip label={archivo.name} color="info" size="small" sx={{ maxWidth: 160 }} />
            )}
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSubir}
              disabled={!archivo || subiendo}
              sx={{ minWidth: 90 }}
            >
              {subiendo ? "Subiendo..." : "Subir"}
            </Button>
          </Stack>
          <TextField
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
            size="small"
            fullWidth
            sx={{ mt: 1, maxWidth: 340, background: '#f8fafc', borderRadius: 2 }}
            inputProps={{ maxLength: 120 }}
          />
          {archivoSubido && (
            <Box mt={2}>
              <Chip label={archivoSubido} color="success" size="small" />
              <Typography variant="caption" color="primary.main" ml={1}>
                ¡Subido! {descripcionSubida && <span style={{ color: '#1976d2' }}>({descripcionSubida})</span>}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Separador azul entre tarjetas */}
        <Divider orientation={isMdUp ? 'vertical' : 'horizontal'} flexItem sx={{ mx: isMdUp ? 2 : 0, my: isMdUp ? 0 : 3, bgcolor: 'primary.main', width: isMdUp ? 5 : '80%', height: isMdUp ? '80%' : 5, borderRadius: 2 }} />

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
    </Box>
  );
}

export default Cronograma; 