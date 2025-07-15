import React from "react";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import PersonIcon from "@mui/icons-material/Person";

function UltimosConectadosList({ users }) {
  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 3,
        borderRadius: 4,
        minHeight: 220,
        border: "1.5px solid",
        borderColor: "grey.200",
        bgcolor: "white",
        transition: "box-shadow 0.3s",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <MDTypography variant="h5" mb={2} display="flex" alignItems="center" fontWeight="bold">
        <PersonIcon sx={{ mr: 1, color: "primary.main" }} /> Últimos Conectados
      </MDTypography>
      <List dense sx={{ bgcolor: "grey.50", borderRadius: 3, p: 1 }}>
        {users.map((user, idx) => (
          <React.Fragment key={user.id}>
            <ListItem
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                py: 2,
                borderRadius: 2,
                mb: 1,
                transition: "background 0.2s",
                "&:hover": {
                  background: "rgba(25, 118, 210, 0.07)",
                  boxShadow: 1,
                },
              }}
            >
              <MDBox display="flex" alignItems="center" width="100%">
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      border: "2px solid",
                      borderColor: "primary.light",
                      bgcolor: "white",
                      color: "primary.main",
                      boxShadow: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PersonIcon sx={{ color: "primary.main", fontSize: 28 }} />
                  </Avatar>
                </ListItemAvatar>
                <MDTypography fontWeight="bold" ml={1} fontSize={18} color="primary.main">
                  {user.name}
                </MDTypography>
              </MDBox>
              <MDTypography variant="caption" color="text.secondary" mb={0.5} ml={7}>
                {user.id} — {user.email}
              </MDTypography>
              <MDTypography variant="body2" color="info.main" ml={7}>
                Última conexión: {user.lastConnection}
              </MDTypography>
            </ListItem>
            {idx < users.length - 1 && <Divider component="li" sx={{ borderColor: "grey.200" }} />}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
}

UltimosConectadosList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      lastConnection: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default UltimosConectadosList;
