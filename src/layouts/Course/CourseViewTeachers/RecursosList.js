import React, { useState } from "react";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

function RecursosList({ resources, onAddResource }) {
  const [adding, setAdding] = useState(false);
  // Simulación de agregar recurso
  const handleAdd = () => {
    setAdding(true);
    setTimeout(() => {
      setAdding(false);
      if (onAddResource) onAddResource();
    }, 1000);
  };
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
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={adding ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
          onClick={handleAdd}
          disabled={adding}
          sx={{ borderRadius: 2, fontWeight: 600, py: 1.2, minWidth: 180, fontSize: 16, boxShadow: 1 }}
        >
          {adding ? "Agregando..." : "Agregar Recurso"}
        </Button>
      </Box>
    </Card>
  );
}

RecursosList.propTypes = {
  resources: PropTypes.array.isRequired,
  onAddResource: PropTypes.func,
};

export default RecursosList;
