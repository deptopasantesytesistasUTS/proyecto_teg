import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import CourseViewEntregas from "./CourseViewEntregas";
import { tutoriasService } from "../../../services/tutoriasService";
import { useParams, useLocation } from 'react-router-dom';

function CourseViewCronogramas({
  // Props para entregas
  currentUploadType,
  handleOpenUploadModal,
  uploadFileName,
  setUploadFileName,
  handleOpenUploadModalButton,
  openUploadModal,
  handleCloseUploadModal,
  handleFileUpload,
  handleSubmitUpload,
  uploadFile,
  
  // Prop para el id de la sección (opcional, se puede obtener de la URL)
  idSeccion,
}) {

  // Obtener parámetros de la URL
  const params = useParams();
  const location = useLocation();
  
  // Extraer idSeccion de la URL si no se pasa como prop
  const seccionId = idSeccion || params.idSeccion || extractIdSeccionFromUrl(location.pathname);

  // Estados para el formulario de tutorías
  const [newTutoriaDate, setNewTutoriaDate] = useState("");
  
  // Estado para las tutorías
  const [tutorias, setTutorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Estado para la fecha seleccionada en el calendario
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Estado para edición
  const [editingTutoria, setEditingTutoria] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Función para extraer idSeccion de la URL
  function extractIdSeccionFromUrl(pathname) {
    // La URL es como: /aula-virtual/202521416
    const match = pathname.match(/\/aula-virtual\/(\d+)/);
    return match ? match[1] : null;
  }

  // Cargar tutorías al montar el componente
  useEffect(() => {
    if (seccionId) {
      console.log("Cargando tutorías para sección:", seccionId);
      cargarTutorias();
    } else {
      console.log("No se pudo obtener idSeccion de la URL");
      setError("No se pudo identificar la sección. Verifica la URL.");
    }
  }, [seccionId]);

  // Función para cargar tutorías desde el backend
  const cargarTutorias = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Intentando cargar tutorías para sección:", seccionId);
      const data = await tutoriasService.obtenerTutoriasPorSeccion(seccionId);
      console.log("Tutorías cargadas:", data);
      setTutorias(data);
    } catch (error) {
      setError("Error al cargar las tutorías");
      console.error("Error al cargar tutorías:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar nueva tutoria
  const handleAddTutoria = async () => {
    if (!newTutoriaDate) {
      setError("Fecha es requerida");
      return;
    }

    // Verificar que no se excedan las 8 tutorías
    if (tutorias.length >= 8) {
      setError("Ya se han programado las 8 tutorías permitidas para esta sección");
      return;
    }

    // Verificar que la fecha no esté duplicada
    const fechaExistente = tutorias.find(
      tutoria => dayjs(tutoria.fecha).format('YYYY-MM-DD') === newTutoriaDate
    );
    if (fechaExistente) {
      setError("Ya existe una tutoría programada para esta fecha");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const nuevaTutoria = {
        fecha: newTutoriaDate,
        idSeccion: parseInt(seccionId)
      };

      console.log("Creando nueva tutoría:", nuevaTutoria);
      await tutoriasService.crearTutoria(nuevaTutoria);
      
      // Limpiar formulario
      setNewTutoriaDate("");
      
      // Recargar tutorías
      await cargarTutorias();
      
      setSuccess("Tutoría creada exitosamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error al crear la tutoría");
      console.error("Error al crear tutoría:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para editar tutoria
  const handleEditTutoria = (tutoria) => {
    setEditingTutoria(tutoria);
    setNewTutoriaDate(tutoria.fecha ? dayjs(tutoria.fecha).format('YYYY-MM-DD') : "");
    setIsEditing(true);
  };

  // Función para actualizar tutoria
  const handleUpdateTutoria = async () => {
    if (!editingTutoria) return;

    try {
      setLoading(true);
      setError("");
      
      const datosActualizados = {
        fecha: newTutoriaDate,
      };

      await tutoriasService.editarTutoria(editingTutoria.idTutoria, datosActualizados);
      
      // Limpiar formulario y estados
      setNewTutoriaDate("");
      setEditingTutoria(null);
      setIsEditing(false);
      
      // Recargar tutorías
      await cargarTutorias();
      
      setSuccess("Tutoría actualizada exitosamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error al actualizar la tutoría");
      console.error("Error al actualizar tutoría:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar tutoria
  const handleDeleteTutoria = async (idTutoria) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta tutoría?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      await tutoriasService.eliminarTutoria(idTutoria);
      
      // Recargar tutorías
      await cargarTutorias();
      
      setSuccess("Tutoría eliminada exitosamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error al eliminar la tutoría");
      console.error("Error al eliminar tutoría:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    setEditingTutoria(null);
    setIsEditing(false);
    setNewTutoriaDate("");
  };

  // Buscar si hay tutoria programada para la fecha seleccionada
  const tutoriaSeleccionada = selectedDate && tutorias.find(
    (tutoria) => tutoria.fecha === dayjs(selectedDate).format('YYYY-MM-DD')
  );

  // Si no hay seccionId, mostrar mensaje de error
  if (!seccionId) {
    return (
      <MDBox>
        <Alert severity="error" sx={{ mb: 2 }}>
          No se pudo identificar la sección. Verifica que la URL sea correcta.
        </Alert>
        <MDTypography variant="body2" color="text.secondary">
          URL actual: {location.pathname}
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <MDBox>
      <MDTypography 
        variant="h6" 
        fontWeight="medium" 
        mb={3}
        sx={{ textAlign: 'center', textTransform: 'uppercase', color: '#1976d2', letterSpacing: 2, mt: 4 }}
      >
        Cronograma de Tutorías - Sección {seccionId}
      </MDTypography>


      {/* Mensajes de estado */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MDBox
            sx={{
              background: '#f8fafc',
              borderRadius: 2,
              boxShadow: 1,
              p: 3,
              mb: 3,
            }}
          >
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              {isEditing ? "Editar Tutoría" : "Nueva Tutoría"}
            </MDTypography>
            
            <TextField
              label="Fecha de tutoría"
              type="date"
              value={newTutoriaDate}
              onChange={(e) => setNewTutoriaDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={1}>
              {isEditing ? (
                <>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdateTutoria}
                      fullWidth
                      disabled={loading || !newTutoriaDate}
                      sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                    >
                      {loading ? "Actualizando..." : "Actualizar"}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelEdit}
                      fullWidth
                      sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                    >
                      Cancelar
                    </Button>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddTutoria}
                    fullWidth
                    disabled={loading || !newTutoriaDate || tutorias.length >= 8}
                    sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                  >
                    {loading ? "Creando..." : `Agregar Tutoría (${tutorias.length}/8)`}
                  </Button>
                </Grid>
              )}
            </Grid>
          </MDBox>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <MDBox
            sx={{
              background: '#f8fafc',
              borderRadius: 2,
              boxShadow: 1,
              p: 3,
              mb: 3,
            }}
          >
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Calendario de Tutorías
            </MDTypography>
            
            <DateCalendar
              value={selectedDate}
              onChange={setSelectedDate}
              sx={{
                background: '#fff',
                borderRadius: 2,
                boxShadow: 0,
                mb: 2,
              }}
            />
            
            {selectedDate && (
              tutoriaSeleccionada ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Hay una tutoría programada para esta fecha
                </Alert>
              ) : (
                <Alert severity="success" sx={{ mt: 2 }}>
                  No hay tutorías programadas para esta fecha.
                </Alert>
              )
            )}
          </MDBox>
        </Grid>
      </Grid>

      {/* Lista de tutorías programadas */}
      {tutorias.length > 0 && (
        <MDBox sx={{ mt: 4 }}>
          <MDTypography variant="h6" fontWeight="medium" mb={2}>
            Tutorías Programadas ({tutorias.length}/8)
          </MDTypography>
          <Grid container spacing={2}>
            {tutorias.map((tutoria, index) => (
              <Grid item xs={12} md={6} lg={4} key={tutoria.idTutoria}>
                <Card sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  boxShadow: 2,
                  mb: 2,
                  background: '#f9f9fb',
                  position: 'relative',
                }}>
                  {/* Número de tutoría */}
                  <MDBox
                    sx={{
                      position: 'absolute',
                      top: -10,
                      left: -10,
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: '#1976d2',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {index + 1}
                  </MDBox>
                  
                  <MDBox display="flex" justifyContent="space-between" alignItems="flex-start">
                    <MDBox>
                      <MDTypography variant="h6" fontWeight="medium" color="primary.main">
                        Tutoría #{index + 1}
                      </MDTypography>
                      <MDTypography variant="body2" color="text.secondary">
                        Fecha: <b>{dayjs(tutoria.fecha).format('DD/MM/YYYY')}</b>
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleEditTutoria(tutoria)}
                        sx={{ fontWeight: 'bold' }}
                        disabled={loading}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteTutoria(tutoria.idTutoria)}
                        sx={{ fontWeight: 'bold' }}
                        disabled={loading}
                      >
                        Eliminar
                      </Button>
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MDBox>
      )}

      {/* Integrar sección de subir y ver entregas aquí */}
      <MDBox sx={{ mt: 6 }}>
        <CourseViewEntregas
          currentUploadType={currentUploadType}
          handleOpenUploadModal={handleOpenUploadModal}
          uploadFileName={uploadFileName}
          setUploadFileName={setUploadFileName}
          handleOpenUploadModalButton={handleOpenUploadModalButton}
          openUploadModal={openUploadModal}
          handleCloseUploadModal={handleCloseUploadModal}
          handleFileUpload={handleFileUpload}
          handleSubmitUpload={handleSubmitUpload}
          uploadFile={uploadFile}
        />
      </MDBox>
    </MDBox>
  );
}

CourseViewCronogramas.propTypes = {
  // Props para entregas
  currentUploadType: PropTypes.string,
  handleOpenUploadModal: PropTypes.func,
  uploadFileName: PropTypes.string,
  setUploadFileName: PropTypes.func,
  handleOpenUploadModalButton: PropTypes.func,
  openUploadModal: PropTypes.bool,
  handleCloseUploadModal: PropTypes.func,
  handleFileUpload: PropTypes.func,
  handleSubmitUpload: PropTypes.func,
  uploadFile: PropTypes.object,
  // Prop para el id de la sección (opcional, se puede obtener de la URL)
  idSeccion: PropTypes.string,
};

// Valores por defecto
CourseViewCronogramas.defaultProps = {
  idSeccion: null, // No hay valor por defecto, se obtiene de la URL
};

export default CourseViewCronogramas;
