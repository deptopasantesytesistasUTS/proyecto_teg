import React from "react";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FolderIcon from "@mui/icons-material/Folder";
import DownloadIcon from "@mui/icons-material/Download";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const resources = [
  {
    name: "Calendario Académico 2024",
    type: "PDF",
    url: "#",
    description: "Calendario oficial de actividades académicas del año 2024",
  },
  {
    name: "Formato de Carta de Presentación",
    type: "DOC",
    url: "#",
    description: "Plantilla oficial para cartas de presentación de proyectos",
  },
  {
    name: "Guía de Estilo para Tesis",
    type: "PDF",
    url: "#",
    description: "Manual de formato y estilo para la presentación de tesis",
  },
  {
    name: "Formato de Evaluación de Jueces",
    type: "XLS",
    url: "#",
    description: "Planilla de evaluación utilizada por los jueces del tribunal",
  },
];

function Recursos() {
  return (
    <Card sx={{ p: 3, boxShadow: 'none', borderRadius: 3, minHeight: 320, background: '#f8fafc' }}>
      <MDTypography variant="h5" mb={2} display="flex" alignItems="center" fontWeight="bold" color="primary.main">
        <FolderIcon sx={{ mr: 1 }} /> Recursos
      </MDTypography>
      <Grid container spacing={2} mb={2}>
        {resources.map((r) => (
          <Grid item xs={12} sm={6} md={4} key={r.name}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc', boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {r.type === 'PDF' ? (
                  <PictureAsPdfIcon sx={{ fontSize: 36, color: '#1976d2', mr: 1 }} />
                ) : (
                  <FolderIcon sx={{ fontSize: 36, color: 'primary.main', mr: 1 }} />
                )}
                <MDTypography fontWeight="bold" fontSize={17} sx={{ flex: 1 }}>
                  {r.name}
                </MDTypography>
                <Chip
                  label={r.type}
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor:
                      r.type === 'PDF' ? '#1976d2'
                      : r.type === 'XLS' ? '#43a047'
                      : r.type === 'DOC' ? '#ff9800'
                      : 'primary.light',
                    color: 'white',
                    fontWeight: 700
                  }}
                />
              </Box>
              <MDTypography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>
                {r.description}
              </MDTypography>
              <Button
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<DownloadIcon />}
                size="small"
                variant="contained"
                sx={{ borderRadius: 2, fontWeight: 500, alignSelf: 'flex-end', mt: 'auto' }}
              >
                Descargar
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}

export default Recursos; 