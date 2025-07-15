import React from "react";
import PropTypes from "prop-types";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ForumIcon from "@mui/icons-material/Forum";
import FolderIcon from "@mui/icons-material/Folder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { blue } from "@mui/material/colors";

const docenteOptions = [
  {
    text: "Crear anuncios",
    icon: <AnnouncementIcon />,
    key: "anuncios",
  },
  {
    text: "Cronogramas",
    icon: <EventNoteIcon />,
    key: "cronogramas",
  },
  {
    text: "Subir y ver cronograma de entregas",
    icon: <AssignmentIcon />,
    key: "entregas",
  },
];

const estudianteOptions = [
  {
    text: "Inicio de materia",
    icon: <DashboardIcon />,
    key: "inicio",
  },
  {
    text: "Cronograma",
    icon: <EventNoteIcon />,
    key: "cronograma",
  },
  {
    text: "Página para subir contenido",
    icon: <CloudUploadIcon />,
    key: "subir",
  },
  {
    text: "Recursos",
    icon: <FolderIcon />,
    key: "recursos",
  },
];

function SubjectSideMenu({
  open,
  onClose,
  subject,
  userType,
  onOptionClick,
  selectedKey,
  options,
}) {
  const menuOptions = options || (userType === "docente" ? docenteOptions : estudianteOptions);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="persistent"
      PaperProps={{ sx: { position: "relative", background: '#1976d2', color: '#fff', minHeight: '60vh', borderRight: 0 } }}
    >
      <div style={{ width: 250, height: "60%" }} role="presentation">
        <List sx={{ mb: 1 }}>
          <ListItem>
            <ListItemText
              primary={subject ? subject.nombre : "Materia"}
              secondary={subject ? subject.descripcion : ""}
              primaryTypographyProps={{ variant: "h6", sx: { color: '#fff', fontWeight: 700, letterSpacing: 1 } }}
              secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)' } }}
            />
          </ListItem>
        </List>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 1 }} />
        <List>
          {menuOptions.map((option) => (
            <ListItem
              button
              key={option.key}
              onClick={() => onOptionClick(option.key)}
              sx={
                option.key === selectedKey
                  ? {
                      backgroundColor: '#fff',
                      color: '#1976d2',
                      borderRadius: '999px', // ovalado total
                      fontWeight: 700,
                      boxShadow: 1,
                      mb: 0.5,
                      px: 3, // padding horizontal extra para ovalar ambos lados
                      '& .MuiListItemIcon-root': { color: '#1976d2' },
                      '& .MuiListItemText-primary': { color: '#1976d2', fontWeight: 700 },
                      '&:hover': { backgroundColor: '#e3eafc' },
                    }
                  : {
                      color: '#fff',
                      borderRadius: 2,
                      mb: 0.5,
                      '& .MuiListItemIcon-root': { color: '#fff' },
                      '& .MuiListItemText-primary': { color: '#fff', fontWeight: 500 },
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
                    }
              }
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText
                primary={option.text}
                primaryTypographyProps={{ sx: { fontWeight: option.key === selectedKey ? 700 : 500, letterSpacing: 0.5 } }}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}

SubjectSideMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  subject: PropTypes.object,
  userType: PropTypes.oneOf(["docente", "estudiante"]).isRequired,
  onOptionClick: PropTypes.func,
  selectedKey: PropTypes.string,
  options: PropTypes.array,
};

export default SubjectSideMenu;
