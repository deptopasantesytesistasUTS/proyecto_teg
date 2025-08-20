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
  
];

// Opciones por defecto (TEG Y investigacion II)
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
    text: " Actividades",
    icon: <CheckCircleIcon />,
    key: "control_entrega",
  },
  {
    text: "Recursos",
    icon: <FolderIcon />,
    key: "recursos",
  },
];

// Opciones por defecto (TEG e investigacion II)
const estudianteOptions = [
  {
    text: "Informacion",
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

// Opciones por tutorias - estudiantes 
const estudianteOptionsTutorias = [
  {
    text: "Informacion",
    icon: <DashboardIcon />,
    key: "inicio",
  },
  {
    text: "Fechas ",
    icon: <EventNoteIcon />,
    key: "cronograma",
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
    
    
    if (options) {
      
      return options;
    }
    
    // Si es estudiante, determinar el tipo de materia
    if (userType === "estudiante") {
      const materiaCategoria = subject?.categoria || "";
      const materiaNombre = subject?.nombre || subject?.carrera || "";
      
      console.log("🚨 SubjectSideMenu - Valores extraídos para estudiante:", {
        materiaCategoria,
        materiaNombre
      });
      
      // Detección para estudiantes
     
    const categoriaLower = (materiaCategoria || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const nombreLower = (materiaNombre || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (categoriaLower.includes("tutoria") || nombreLower.includes("tutoria")) {
      return userType === "estudiante" ? estudianteOptionsTutorias : tutoriasDocenteOptions;
    }
      
     
      return estudianteOptions;
    }
    
   
    // Para docentes y administradores, determinar el tipo de materia
    const materiaCategoria = subject?.categoria || "";
    const materiaNombre = subject?.nombre || subject?.carrera || "";
    
    console.log("🚨 SubjectSideMenu - Valores extraídos:", {
      materiaCategoria,
      materiaNombre
    });
    
    // Detección simplificada y directa - buscar tanto en categoria como en nombre
    const categoriaLower = (materiaCategoria || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const nombreLower = (materiaNombre || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (categoriaLower.includes("tutoria") || nombreLower.includes("tutoria")) {
      return tutoriasDocenteOptions;
    }
    
    if (nombreLower === "trabajo_especial_de_grado") {
      return trabajoEspecialDocenteOptions;
    }
    
  return docenteOptions;

  },[userType, subject, options]);

  // Título y descripción a mostrar en el header del menú
  const displayTitle = useMemo(() => {
    if (!subject) return "Materia";
    
    const categoria = subject.categoria || "";
    const carrera = subject.carrera || subject.Carreras?.nombre || "";
    
    // Mostrar categoría si está disponible
    if (categoria) {
      return ` ${categoria}`;
    }
    
    // Fallback al nombre directo si no hay categoría
    return subject.nombre || "Materia";
  }, [subject]);

  const secondaryText = useMemo(() => {
    if (!subject) return "";
    
    const carrera = subject.carrera || subject.Carreras?.nombre || "";
    const id = subject.idMateria || subject.id || "";
    
    let info = [];
    
    // Agregar carrera si está disponible
    if (carrera) {
      info.push(`Carrera: ${carrera}`);
    }
    
    // Agregar ID si está disponible
    if (id) {
      info.push(`ID: ${id}`);
    }
    
    return info.join('\n');
  }, [subject]);

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
              primary={displayTitle}
              secondary={secondaryText}
              primaryTypographyProps={{ variant: "h6", sx: { color: '#fff', fontWeight: 700, letterSpacing: 1 } }}
              secondaryTypographyProps={{ 
                sx: { 
                  color: 'rgba(255,255,255,0.7)', 
                  whiteSpace: 'pre-line',
                  fontSize: '0.875rem',
                  lineHeight: 1.5
                } 
              }}
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
