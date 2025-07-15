import React from "react";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import AnnouncementIcon from "@mui/icons-material/Announcement";

function UltimosComunicadosList({ announcements }) {
  return (
    <MDBox mb={2}>
      <MDTypography
        variant="h6"
        fontWeight="bold"
        color="primary"
        mb={2}
        display="flex"
        alignItems="center"
      >
        <AnnouncementIcon sx={{ mr: 1 }} /> Últimos Comunicados
      </MDTypography>
      <Grid container spacing={2}>
        {announcements.map((a, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <Card
              elevation={2}
              sx={{ p: 1, borderRadius: 3, minHeight: 120, maxWidth: 320, mx: "auto" }}
            >
              <CardContent sx={{ p: 1, ".MuiTypography-root": { fontSize: 14 } }}>
                <MDTypography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="primary.main"
                  gutterBottom
                  sx={{ fontSize: 15 }}
                >
                  {a.title}
                </MDTypography>
                <MDTypography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ fontSize: 12, mb: 0.5 }}
                >
                  {a.date} — {a.author}
                </MDTypography>
                <MDTypography variant="body2" color="text" sx={{ fontSize: 13 }}>
                  {a.content}
                </MDTypography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </MDBox>
  );
}

UltimosComunicadosList.propTypes = {
  announcements: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default UltimosComunicadosList;
