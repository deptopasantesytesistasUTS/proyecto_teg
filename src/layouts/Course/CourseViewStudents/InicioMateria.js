import React from "react";
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

const dummyAnnouncements = [
  {
    id: 1,
    title: "Bienvenida al semestre",
    description: "¡Bienvenidos al nuevo semestre académico! Les deseamos mucho éxito en sus estudios.",
    date: "2024-12-01",
  },
  {
    id: 2,
    title: "Primera clase",
    description: "La primera clase será el 6 de enero a las 8:00 am en el aula virtual.",
    date: "2024-12-15",
  },
  {
    id: 3,
    title: "Entrega de proyecto",
    description: "Recuerden que la entrega del proyecto final es el 15 de diciembre.",
    date: "2024-12-10",
  },
];

export default function InicioMateria() {
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
          <List>
            {dummyAnnouncements.map((a, idx) => (
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
                {idx < dummyAnnouncements.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
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