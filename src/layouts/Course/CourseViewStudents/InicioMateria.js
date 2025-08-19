import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import Divider from "@mui/material/Divider";
import { backendUrl } from "config";
import PropTypes from "prop-types";

export default function InicioMateria({ seccionId }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError("");
      try {
        const url = seccionId
          ? `${backendUrl}/comunicados?seccionId=${seccionId}&limit=10`
          : `${backendUrl}/comunicados?limit=10`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("No se pudieron obtener los anuncios");
        const data = await res.json();
        setAnnouncements(
          Array.isArray(data)
            ? data.map((c) => ({
                id: c.idComunicado || c.id || Math.random(),
                title: c.titulo || "(Sin título)",
                description: c.texto || "",
                date: c.created_At ? new Date(c.created_At).toLocaleDateString() : "",
              }))
            : []
        );
      } catch (err) {
        setError(err.message || "Error cargando anuncios");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [seccionId]);

  return (
    <Box>
      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h4" sx={{ color: 'rgb(25, 118, 210)' }} gutterBottom>
            ¡Bienvenido al Aula Virtual!
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgb(25, 118, 210)' }} gutterBottom>
            Trabajo Especial de Grado - Informática
          </Typography>
          <Typography variant="body1" color="text.primary">
            Aquí encontrarás toda la información relevante sobre la materia, anuncios recientes, cronograma de actividades y recursos importantes para tu desarrollo académico.
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ mb: 4, boxShadow: 1 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: 'rgb(25, 118, 210)' }} gutterBottom>
            Anuncios recientes
          </Typography>
          {loading ? (
            <Typography variant="body2">Cargando...</Typography>
          ) : error ? (
            <Typography variant="body2" color="error">{error}</Typography>
          ) : announcements.length === 0 ? (
            <Typography variant="body2">No hay anuncios disponibles.</Typography>
          ) : (
            <List>
              {announcements.map((a, idx) => (
                <React.Fragment key={a.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <AnnouncementIcon color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary={a.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {a.description}
                          </Typography>
                          <br />
                          <Typography component="span" variant="caption" color="text.secondary">
                            {a.date}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {idx < announcements.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
      <Card sx={{ boxShadow: 1 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: 'rgb(25, 118, 210)' }} gutterBottom>
            Resumen de la materia
          </Typography>
          <Typography variant="body2" color="text.primary">
            Esta materia está orientada a la realización del Trabajo Especial de Grado, donde los estudiantes desarrollarán un proyecto de investigación bajo la tutoría de un profesor. A lo largo del semestre, se abordarán temas de metodología, redacción académica, y presentación de resultados.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

InicioMateria.propTypes = {
  seccionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}; 