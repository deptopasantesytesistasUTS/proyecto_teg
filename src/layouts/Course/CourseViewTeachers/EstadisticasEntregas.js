import React from "react";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import LinearProgress from "@mui/material/LinearProgress";
import BarChartIcon from "@mui/icons-material/BarChart";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

function EstadisticasEntregas({ estadisticas }) {
  return (
    <Card sx={{ p: 3, boxShadow: 'none', borderRadius: 3, minHeight: 220, background: '#f8fafc' }}>
      <MDTypography variant="h5" mb={2} display="flex" alignItems="center" fontWeight="bold">
        <BarChartIcon sx={{ mr: 1 }} /> Estadísticas de Entregas
      </MDTypography>
      <List dense sx={{ bgcolor: 'transparent', borderRadius: 2 }}>
        {estadisticas.map((e) => (
          <ListItem key={e.label} sx={{ flexDirection: "column", alignItems: "flex-start", py: 2 }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ListItemText
                primary={<MDTypography component="span" fontWeight="medium">{e.label}</MDTypography>}
                sx={{ m: 0 }}
              />
              <MDTypography
                variant="body2"
                color={e.value >= 70 ? "primary" : e.value >= 40 ? "warning.main" : "error.main"}
                fontWeight="bold"
                sx={{ minWidth: 40, textAlign: "right" }}
              >
                {e.value}%
              </MDTypography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={e.value}
              sx={{ width: "100%", height: 12, borderRadius: 6, mb: 1, mt: 1, boxShadow: 1 }}
              color={e.value >= 70 ? "primary" : e.value >= 40 ? "warning" : "error"}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

EstadisticasEntregas.propTypes = {
  estadisticas: PropTypes.array.isRequired,
};

export default EstadisticasEntregas;
