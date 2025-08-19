import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  IconButton,
  useTheme,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon
} from '@mui/icons-material';

const Cronograma = ({ events = [], onEventClick }) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Debug: mostrar eventos en consola
  useEffect(() => {
    console.log('Cronograma recibió eventos:', events);
  }, [events]);

  // Función para obtener el color del evento según su tipo
  const getEventColor = (type) => {
    const colors = {
      'clase': '#1976d2',
      'examen': '#d32f2f',
      'tarea': '#ed6c02',
      'proyecto': '#2e7d32',
      'reunion': '#7b1fa2',
      'default': '#757575'
    };
    return colors[type] || colors.default;
  };

  // Normaliza la fecha al formato YYYY-MM-DD en UTC para evitar problemas de zona horaria
  const dateKey = (d) => {
    try {
      const dt = new Date(d);
      return dt.toISOString().slice(0, 10);
    } catch (e) {
      return '';
    }
  };

  // Función para obtener eventos de un día específico (comparando por clave YYYY-MM-DD)
  const getEventsForDay = (date) => {
    const key = dateKey(date);
    return events.filter((event) => {
      const eventKey = dateKey(event.startDate || event.date);
      const endKey = event.endDate ? dateKey(event.endDate) : eventKey;
      // Incluye el evento si el día cae entre start y end (o igual al único día)
      return key >= eventKey && key <= endKey;
    });
  };

  // Función para manejar el clic en un evento
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Función para cambiar al mes anterior
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // Función para cambiar al mes siguiente
  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Función para cerrar el diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  // Función para formatear la fecha
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
<Card 
sx={{ 
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.card : '#fff',
  color: theme.palette.mode === 'dark' ? theme.palette.text.main : 'inherit'
}}
>
<CardContent>
            {/* Header del calendario */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <IconButton onClick={goToPreviousMonth} size="small">
                <ChevronLeftIcon />
              </IconButton>
  <Typography 
    variant="h6" 
    sx={{ 
                  color: theme.palette.mode === 'dark' ? theme.palette.text.main : 'inherit',
                  fontWeight: 'bold'
    }}
  >
                {new Intl.DateTimeFormat('es-ES', { 
                  month: 'long', 
                  year: 'numeric' 
                }).format(currentMonth)}
  </Typography>
              <IconButton onClick={goToNextMonth} size="small">
                <ChevronRightIcon />
              </IconButton>
            </Box>

            {/* Calendario Visual */}
  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
    {/* Días de la semana */}
    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
      <Box
        key={day}
        sx={{
          p: 1,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "0.875rem",
          color: theme.palette.mode === 'dark' ? theme.palette.text.main : "text.secondary",
        }}
      >
        {day}
      </Box>
    ))}
    
    {/* Días del mes */}
    {(() => {
      const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      const days = [];
      
      // Agregar días del mes anterior para completar la primera semana
      const firstDayOfWeek = start.getDay();
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const prevDate = new Date(start);
        prevDate.setDate(start.getDate() - i - 1);
        days.push({ date: prevDate, isCurrentMonth: false });
      }
      
      // Agregar días del mes actual
      for (let i = 1; i <= end.getDate(); i++) {
        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
        days.push({ date: currentDate, isCurrentMonth: true });
      }
      
      // Agregar días del mes siguiente para completar la última semana
      const lastDayOfWeek = end.getDay();
      for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
        const nextDate = new Date(end);
        nextDate.setDate(end.getDate() + i);
        days.push({ date: nextDate, isCurrentMonth: false });
      }
      
      return days.map((dayInfo, index) => {
        const events = getEventsForDay(dayInfo.date);
        const isToday = dayInfo.date.toDateString() === new Date().toDateString();
        
        return (
          <Box
            key={index}
            sx={{
              p: 1,
              textAlign: "center",
              borderRadius: 1,
              cursor: events.length > 0 ? "pointer" : "default",
              backgroundColor: events.length > 0 ? `${getEventColor(events[0].type)}20` : "transparent",
              border: isToday ? "2px solid #1976d2" : "1px solid transparent",
              opacity: dayInfo.isCurrentMonth ? 1 : 0.5,
              fontSize: "0.875rem",
              minHeight: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": events.length > 0 ? {
                backgroundColor: `${getEventColor(events[0].type)}30`,
              } : {},
            }}
            onClick={() => {
              if (events.length > 0) {
                handleEventClick(events[0]);
              }
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: isToday ? "bold" : "normal",
                color: isToday ? "#1976d2" : "text.primary",
              }}
            >
              {dayInfo.date.getDate()}
            </Typography>
            {events.length > 0 && (
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: getEventColor(events[0].type),
                  mt: 0.5,
                }}
              />
            )}
          </Box>
        );
      });
    })()}
  </Box>

            {/* Mensaje cuando no hay eventos */}
            {events.length === 0 && (
              <Box sx={{ mt: 2, textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No hay eventos programados para este mes
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Los eventos aparecerán aquí cuando se agreguen comunicados o fechas importantes
                </Typography>
                <Typography variant="caption" color="primary" display="block" sx={{ mt: 1 }}>
                  Verifica la consola del navegador para más información de debug
                </Typography>
              </Box>
            )}

            {/* Leyenda de eventos */}
            {events.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body2" sx={{ mr: 1, fontWeight: 'bold' }}>
                  Leyenda:
                </Typography>
                {['clase', 'examen', 'tarea', 'proyecto', 'reunion'].map((type) => (
                  <Chip
                    key={type}
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    size="small"
                    sx={{
                      backgroundColor: `${getEventColor(type)}20`,
                      color: getEventColor(type),
                      border: `1px solid ${getEventColor(type)}`,
                    }}
                  />
                ))}
              </Box>
            )}
</CardContent>
</Card>
</Grid>

      {/* Diálogo para mostrar detalles del evento */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon sx={{ color: selectedEvent ? getEventColor(selectedEvent.type) : 'inherit' }} />
            Detalles del Evento
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Título"
                  secondary={selectedEvent.title}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Fecha"
                  secondary={formatDate(new Date(selectedEvent.date))}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Tipo"
                  secondary={
                    <Chip
                      label={selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor: `${getEventColor(selectedEvent.type)}20`,
                        color: getEventColor(selectedEvent.type),
                      }}
                    />
                  }
                />
              </ListItem>
              {selectedEvent.description && (
                <>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Descripción"
                      secondary={selectedEvent.description}
                    />
                  </ListItem>
                </>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

Cronograma.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      type: PropTypes.oneOf(['clase', 'examen', 'tarea', 'proyecto', 'reunion']).isRequired,
      description: PropTypes.string
    })
  ),
  onEventClick: PropTypes.func
};

Cronograma.defaultProps = {
  events: [],
  onEventClick: null
};

export default Cronograma;
