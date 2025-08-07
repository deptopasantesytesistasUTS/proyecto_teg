import React, { useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, Button, TextField, Paper, Chip, Stack } from "@mui/material";

// Fechas límite de entregas de borradores
const entregas = [
  { nombre: "Borrador 1", fechaLimite: "2024-07-01T23:59" },
  { nombre: "Borrador 2", fechaLimite: "2024-08-01T23:59" },
  { nombre: "Borrador Final", fechaLimite: "2024-09-01T23:59" },
  { nombre: "Entrega Final", fechaLimite: "2024-09-15T23:59" },
];

function SubirContenido() {
  // Mock de propuestas de título
  const [propuestas, setPropuestas] = useState([
    "Sistema de Gestión Académica",
    "Plataforma de Tutorías Online",
    "App de Seguimiento de Proyectos"
  ]);
  // Mock de título aceptado
  const [tituloAceptado] = useState("Plataforma de Tutorías Online");

  // Estado para archivos subidos por entrega
  const [archivosEntregados, setArchivosEntregados] = useState({}); // { nombreEntrega: nombreArchivo }
  const [archivosSeleccionados, setArchivosSeleccionados] = useState({}); // { nombreEntrega: File }
  const [subiendo, setSubiendo] = useState({}); // { nombreEntrega: boolean }

  // Estado para enlaces subidos por entrega
  const [enlacesEntregados, setEnlacesEntregados] = useState({}); // { nombreEntrega: enlace }
  const [enlacesIngresados, setEnlacesIngresados] = useState({}); // { nombreEntrega: string }

  // Para nuevas propuestas
  const [nuevasPropuestas, setNuevasPropuestas] = useState(["", "", ""]);
  const [enviando, setEnviando] = useState(false);

  // Handlers para propuestas de título
  const handleNuevaPropuestaChange = (idx, value) => {
    const nuevas = [...nuevasPropuestas];
    nuevas[idx] = value;
    setNuevasPropuestas(nuevas);
  };
  const handleEnviarPropuestas = () => {
    setEnviando(true);
    setTimeout(() => {
      const propuestasValidas = nuevasPropuestas.filter((p) => p.trim() !== "");
      if (propuestasValidas.length > 0) {
        setPropuestas([...propuestas, ...propuestasValidas]);
      }
      setNuevasPropuestas(["", "", ""]);
      setEnviando(false);
    }, 1000);
  };

  // Handlers para subir borradores (ahora enlaces)
  const handleEnlaceChange = (nombreEntrega, enlace) => {
    setEnlacesIngresados((prev) => ({ ...prev, [nombreEntrega]: enlace }));
  };
  const handleSubirBorrador = (nombreEntrega) => {
    setSubiendo((prev) => ({ ...prev, [nombreEntrega]: true }));
    setTimeout(() => {
      setEnlacesEntregados((prev) => ({ ...prev, [nombreEntrega]: enlacesIngresados[nombreEntrega] }));
      setEnlacesIngresados((prev) => ({ ...prev, [nombreEntrega]: "" }));
      setSubiendo((prev) => ({ ...prev, [nombreEntrega]: false }));
    }, 1200);
  };

  // Helpers
  const now = new Date();
  const isVencida = (fechaLimite) => new Date(fechaLimite) < now;
  const formatoFecha = (fechaLimite) => {
    const fecha = new Date(fechaLimite);
    return fecha.toLocaleString("es-VE", { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
      {/* Sección Títulos */}
      <Paper sx={{ flex: 1, p: 3, borderRadius: 3, boxShadow: 3, minWidth: 320, mb: { xs: 3, md: 0 } }}>
        <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: 'rgb(25, 118, 210)' }}>
          Propuestas de Título
        </Typography>
        <List>
          {propuestas.map((titulo, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={titulo}
                primaryTypographyProps={{ fontWeight: 500, color: titulo === tituloAceptado ? 'success.main' : 'text.primary' }}
              />
              {titulo === tituloAceptado && <Chip label="Aceptado" color="success" size="small" />}
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" fontWeight={600} mb={1} color="primary.dark">
          Enviar nuevas propuestas (máx. 3)
        </Typography>
        <Stack spacing={2} direction="column" mb={2}>
          {nuevasPropuestas.map((valor, idx) => (
            <TextField
              key={idx}
              label={`Propuesta ${idx + 1}`}
              value={valor}
              onChange={e => handleNuevaPropuestaChange(idx, e.target.value)}
              size="small"
              fullWidth
              variant="outlined"
              inputProps={{ maxLength: 100 }}
            />
          ))}
        </Stack>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEnviarPropuestas}
          disabled={enviando || nuevasPropuestas.every((p) => p.trim() === "")}
          sx={{ minWidth: 160 }}
        >
          {enviando ? "Enviando..." : "Enviar Propuestas"}
        </Button>
      </Paper>
      {/* Sección Borradores tipo Google Classroom */}
      <Paper sx={{ flex: 1, p: 3, borderRadius: 3, boxShadow: 3, minWidth: 340 }}>
        <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: 'rgb(25, 118, 210)' }}>
          Entregas de Borradores
        </Typography>
        <List>
          {entregas.map((entrega, idx) => {
            const vencida = isVencida(entrega.fechaLimite);
            const entregado = enlacesEntregados[entrega.nombre];
            return (
              <ListItem key={entrega.nombre} alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'stretch', mb: 2, border: '1px solid #e0e0e0', borderRadius: 2, p: 2, bgcolor: vencida && !entregado ? '#fff3f3' : 'background.paper' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography fontWeight={600} sx={{ color: 'rgb(25, 118, 210)' }}>
                    {entrega.nombre}
                  </Typography>
                  <Chip
                    label={vencida ? (entregado ? 'Entregado fuera de tiempo' : 'Vencida') : 'A tiempo'}
                    color={vencida ? (entregado ? 'warning' : 'error') : 'success'}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgb(25, 118, 210)' }} mb={1}>
                  Fecha límite: {formatoFecha(entrega.fechaLimite)}
                </Typography>
                {entregado ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip label="Enlace entregado" color="info" size="small" />
                    <a href={enlacesEntregados[entrega.nombre]} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                      {enlacesEntregados[entrega.nombre]}
                    </a>
                    <Typography variant="caption" color={vencida ? 'error.main' : 'success.main'}>
                      {vencida ? 'Entregado fuera de tiempo' : 'Entregado a tiempo'}
                    </Typography>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center" gap={2}>
                    <TextField
                      label="Enlace de entrega"
                      value={enlacesIngresados[entrega.nombre] || ""}
                      onChange={e => handleEnlaceChange(entrega.nombre, e.target.value)}
                      placeholder="https://..."
                      size="small"
                      sx={{ flex: 1 }}
                      disabled={vencida || subiendo[entrega.nombre]}
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleSubirBorrador(entrega.nombre)}
                      disabled={!(enlacesIngresados[entrega.nombre] && enlacesIngresados[entrega.nombre].startsWith('http')) || vencida || subiendo[entrega.nombre]}
                    >
                      {subiendo[entrega.nombre] ? 'Subiendo...' : 'Subir'}
                    </Button>
                  </Box>
                )}
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}

export default SubirContenido; 