import React, { useEffect, useMemo } from "react";
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
import InfoIcon from "@mui/icons-material/Info";
import PeopleIcon from "@mui/icons-material/People";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { blue } from "@mui/material/colors";

// Opciones para Trabajo Especial de Grado - DOCENTE
const trabajoEspecialDocenteOptions = [
  {
    text: "Información",
    icon: <InfoIcon />,
    key: "informacion",
  },
  {
    text: "Anuncios",
    icon: <AnnouncementIcon />,
    key: "anuncios",
  },
  {
    text: "Participantes",
    icon: <PeopleIcon />,
    key: "participantes",
  },
  {
    text: "Recursos",
    icon: <FolderIcon />,
    key: "recursos",
  },
  {
    text: "Control de Entrega",
    icon: <CheckCircleIcon />,
    key: "control_entrega",
  },
];

// Opciones para Tutorías - DOCENTE
const tutoriasDocenteOptions = [
  {
    text: "Información",
    icon: <InfoIcon />,
    key: "informacion",
  },
  {
    text: "Anuncios",
    icon: <AnnouncementIcon />,
    key: "anuncios",
  },
  {
    text: "Cronograma",
    icon: <ScheduleIcon />,
    key: "cronograma",
  },
  {
    text: "Participantes",
    icon: <PeopleIcon />,
    key: "participantes",
  },
  {
    text: "Recursos",
    icon: <FolderIcon />,
    key: "recursos",
  },
  {
    text: "Asistencia",
    icon: <CheckCircleIcon />,
    key: "asistencia",
  },
  {
    text: "Control de Entrega",
    icon: <AssignmentIcon />,
    key: "control_entrega",
  },
];

// Opciones para Trabajo Especial de Grado - ESTUDIANTE
const trabajoEspecialEstudianteOptions = [
  {
    text: "Información",
    icon: <InfoIcon />,
    key: "informacion",
  },
  {
    text: "Anuncios",
    icon: <AnnouncementIcon />,
    key: "anuncios",
  },
  {
    text: "Participantes",
    icon: <PeopleIcon />,
    key: "participantes",
  },
  {
    text: "Recursos",
    icon: <FolderIcon />,
    key: "recursos",
  },
  {
    text: "Control de Entrega",
    icon: <CheckCircleIcon />,
    key: "control_entrega",
  },
];

// Opciones para Tutorías - ESTUDIANTE
const tutoriasEstudianteOptions = [
  {
    text: "Información",
    icon: <InfoIcon />,
    key: "informacion",
  },
  {
    text: "Anuncios",
    icon: <AnnouncementIcon />,
    key: "anuncios",
  },
  {
    text: "Cronograma",
    icon: <ScheduleIcon />,
    key: "cronograma",
  },
  {
    text: "Participantes",
    icon: <PeopleIcon />,
    key: "participantes",
  },
  {
    text: "Recursos",
    icon: <FolderIcon />,
    key: "recursos",
  },
  {
    text: "Asistencia",
    icon: <CheckCircleIcon />,
    key: "asistencia",
  },
  {
    text: "Control de Entrega",
    icon: <AssignmentIcon />,
    key: "control_entrega",
  },
];

// Opciones por defecto (para materias regulares)
const docenteOptions = [
  {
    text: "Información",
    icon: <InfoIcon />,
    key: "informacion",
  },
  {
    text: "Anuncios",
    icon: <AnnouncementIcon />,
    key: "anuncios",
  },
  {
    text: "Participantes",
    icon: <PeopleIcon />,
    key: "participantes",
  },
  {
    text: "Recursos",
    icon: <FolderIcon />,
    key: "recursos",
  },
  {
    text: "Control de Entrega",
    icon: <CheckCircleIcon />,
    key: "control_entrega",
  },
];

const estudianteOptions = [
  {
    text: "Home",
    icon: <DashboardIcon />,
    key: "inicio",
  },
  {
    text: "Fechas ",
    icon: <EventNoteIcon />,
    key: "cronograma",
  },
  {
    text: "Actividades",
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
  // useEffect para depurar cuando cambia la materia
  useEffect(() => {
    console.log("SubjectSideMenu - useEffect - subject cambió:", subject);
    console.log("SubjectSideMenu - useEffect - subject completo:", JSON.stringify(subject, null, 2));
  }, [subject]);

  // Log de las opciones disponibles para verificar que están correctas
  useEffect(() => {
    console.log("SubjectSideMenu - Opciones disponibles:", {
      trabajoEspecialDocenteOptions,
      tutoriasDocenteOptions,
      docenteOptions
    });
  }, []);

  // Función para determinar las opciones según el tipo de materia y rol
  const menuOptions = useMemo(() => {
    console.log("🚨 SubjectSideMenu - useMemo INICIADO");
    console.log("🚨 SubjectSideMenu - subject:", subject);
    console.log("🚨 SubjectSideMenu - userType:", userType);
    console.log("🚨 SubjectSideMenu - options:", options);
    console.log("🚨 SubjectSideMenu - options type:", typeof options);
    console.log("🚨 SubjectSideMenu - options truthy:", !!options);
    
    if (options) {
      console.log("🚨 SubjectSideMenu - Retornando options personalizadas");
      return options;
    }
    
    // Determinar el tipo de materia basado en la categoría o nombre
    const materiaCategoria = subject?.categoria || "";
    const materiaNombre = subject?.nombre || subject?.carrera || "";
    
    console.log("🚨 SubjectSideMenu - Valores extraídos:", {
      materiaCategoria,
      materiaNombre
    });
    
    // Detección simplificada y directa - buscar tanto en categoria como en nombre
    const categoriaLower = materiaCategoria.toLowerCase();
    const nombreLower = materiaNombre.toLowerCase();
    
    console.log("🚨 SubjectSideMenu - Comparaciones:", {
      categoriaLower,
      nombreLower,
      esTrabajoEspecial: nombreLower === "trabajo_especial_de_grado",
      esTutorias: nombreLower === "tutorias"
    });
    
    // Detección directa por categoría o nombre exacto
    if (nombreLower === "trabajo_especial_de_grado") {
      console.log("🚨 SubjectSideMenu - DETECTADO: Trabajo Especial de Grado");
      if (userType === "docente") {
        console.log("🚨 SubjectSideMenu - Devolviendo trabajoEspecialDocenteOptions");
        return trabajoEspecialDocenteOptions;
      } else {
        console.log("🚨 SubjectSideMenu - Devolviendo trabajoEspecialEstudianteOptions");
        return trabajoEspecialEstudianteOptions;
      }
    }
    
    if (nombreLower === "tutorias") {
      console.log("🚨 SubjectSideMenu - DETECTADO: Tutorías");
      if (userType === "docente") {
        console.log("🚨 SubjectSideMenu - Devolviendo tutoriasDocenteOptions");
        return tutoriasDocenteOptions;
      } else {
        console.log("🚨 SubjectSideMenu - Devolviendo tutoriasEstudianteOptions");
        return tutoriasEstudianteOptions;
      }
    }
    
    // Opciones por defecto
    console.log("🚨 SubjectSideMenu - DETECTADO: Materia regular");
    if (userType === "docente") {
      console.log("🚨 SubjectSideMenu - Devolviendo docenteOptions");
      return docenteOptions;
    } else {
      console.log("🚨 SubjectSideMenu - Devolviendo estudianteOptions");
      return estudianteOptions;
    }
  }, [subject, userType, options]);

  console.log("SubjectSideMenu - menuOptions final:", menuOptions);
  console.log("SubjectSideMenu - Número de opciones:", menuOptions.length);
  console.log("SubjectSideMenu - Primera opción:", menuOptions[0]);
  console.log("SubjectSideMenu - Todas las opciones:", menuOptions.map(opt => ({key: opt.key, text: opt.text})));

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
              primary={subject ? (subject.carrera || subject.nombre) : "Materia"}
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
