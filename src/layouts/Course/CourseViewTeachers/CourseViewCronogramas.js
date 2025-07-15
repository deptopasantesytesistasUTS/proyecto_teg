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
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import CourseViewEntregas from "./CourseViewEntregas";

function CourseViewCronogramas({
  newClassDate,
  setNewClassDate,
  newClassTime,
  setNewClassTime,
  newClassDescription,
  setNewClassDescription,
  handleAddClass,
  classes,
  handleEditClass,
  handleDeleteClass,
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
}) {
  // Estado para la fecha seleccionada en el calendario
  const [selectedDate, setSelectedDate] = useState(null);
  // Buscar si hay entrega programada para la fecha seleccionada
  const entregaSeleccionada = selectedDate && classes.find(
    (cls) => cls.date === dayjs(selectedDate).format('YYYY-MM-DD')
  );

  return (
    <MDBox>
      <MDTypography 
        variant="h6" 
        fontWeight="medium" 
        mb={3}
        sx={{ textAlign: 'center', textTransform: 'uppercase', color: '#1976d2', letterSpacing: 2, mt: 4 }}
      >
        Cronograma de Entregas
      </MDTypography>
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
        <TextField
          label="Fecha de Entrega"
          type="date"
          value={newClassDate}
          onChange={(e) => setNewClassDate(e.target.value)}
          fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
        />
        <TextField
          label="Hora de Entrega"
          type="time"
          value={newClassTime}
          onChange={(e) => setNewClassTime(e.target.value)}
          fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
        />
        <TextField
          label="Descripción de la Entrega"
          value={newClassDescription}
          onChange={(e) => setNewClassDescription(e.target.value)}
          fullWidth
          placeholder="Ej: Entrega del borrador 1"
              sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddClass}
          fullWidth
              sx={{ mt: 2, fontWeight: 'bold', fontSize: '1rem' }}
          disabled={!newClassDate || !newClassTime || !newClassDescription}
        >
          Agregar Entrega
        </Button>
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
              entregaSeleccionada ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Hay una entrega programada para esta fecha: <b>{entregaSeleccionada.description}</b> a las <b>{entregaSeleccionada.time}</b>
                </Alert>
              ) : (
                <Alert severity="success" sx={{ mt: 2 }}>
                  No hay entregas programadas para esta fecha.
                </Alert>
              )
            )}
          </MDBox>
        </Grid>
      </Grid>
      {classes.length > 0 && (
        <MDBox sx={{ mt: 4 }}>
          <MDTypography variant="h6" fontWeight="medium" mb={2}>
            Entregas Programadas
          </MDTypography>
          <Grid container spacing={2}>
            {classes.map((cls) => (
              <Grid item xs={12} md={6} lg={4} key={cls.id}>
                <Card sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  boxShadow: 2,
                  mb: 2,
                  background: '#f9f9fb',
                }}>
                  <MDBox display="flex" justifyContent="space-between" alignItems="flex-start">
                    <MDBox>
                      <MDTypography variant="h6" fontWeight="medium" color="primary.main">
                        {cls.description}
                      </MDTypography>
                      <MDTypography variant="body2" color="text.secondary">
                        Fecha: <b>{cls.date}</b>
                      </MDTypography>
                      <MDTypography variant="body2" color="text.secondary">
                        Hora: <b>{cls.time}</b>
                      </MDTypography>
                    </MDBox>
                    <MDBox display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleEditClass(cls)}
                        sx={{ fontWeight: 'bold' }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClass(cls.id)}
                        sx={{ fontWeight: 'bold' }}
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
  newClassDate: PropTypes.string.isRequired,
  setNewClassDate: PropTypes.func.isRequired,
  newClassTime: PropTypes.string.isRequired,
  setNewClassTime: PropTypes.func.isRequired,
  newClassDescription: PropTypes.string.isRequired,
  setNewClassDescription: PropTypes.func.isRequired,
  handleAddClass: PropTypes.func.isRequired,
  classes: PropTypes.array.isRequired,
  handleEditClass: PropTypes.func.isRequired,
  handleDeleteClass: PropTypes.func.isRequired,
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
};

export default CourseViewCronogramas;
