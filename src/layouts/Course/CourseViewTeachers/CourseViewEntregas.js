import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import UploadIcon from "@mui/icons-material/Upload";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflow: "auto",
};

function CourseViewEntregas({
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
  return (
    <MDBox>
      <MDTypography variant="h6" fontWeight="medium" mb={3}>
        Subir Archivos
      </MDTypography>
      <MDBox>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="upload-type-label">Tipo de Archivo</InputLabel>
          <Select
            labelId="upload-type-label"
            value={currentUploadType}
            onChange={(e) => handleOpenUploadModal(e.target.value)}
            label="Tipo de Archivo"
          >
            <MenuItem value="tema">Tema de Investigación</MenuItem>
            <MenuItem value="borrador">Borrador de Tesis</MenuItem>
            <MenuItem value="presentacion">Presentación Final</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Nombre del Archivo"
          variant="outlined"
          fullWidth
          margin="normal"
          value={uploadFileName}
          onChange={(e) => setUploadFileName(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenUploadModalButton}
          fullWidth
          sx={{ mt: 2 }}
          disabled={!uploadFileName}
        >
          Subir Archivo
        </Button>
      </MDBox>
      {/* Modal de subida de archivo */}
      <Modal
        open={openUploadModal}
        onClose={handleCloseUploadModal}
        aria-labelledby="upload-modal-title"
        aria-describedby="upload-modal-description"
      >
        <Box sx={style}>
          <Typography id="upload-modal-title" variant="h6" component="h2" mb={3}>
            Subir {currentUploadType}
          </Typography>
          <MDBox display="flex" flexDirection="column" gap={3}>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              startAdornment={
                <InputAdornment position="start">
                  <UploadIcon />
                </InputAdornment>
              }
            />
            {uploadFileName && (
              <MDBox>
                <MDTypography variant="body2" color="success.main">
                  Archivo seleccionado: {uploadFileName}
                </MDTypography>
              </MDBox>
            )}
            <MDBox display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleCloseUploadModal}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitUpload}
                disabled={!uploadFile}
                startIcon={<SendIcon />}
              >
                Enviar Archivo
              </Button>
            </MDBox>
          </MDBox>
        </Box>
      </Modal>
    </MDBox>
  );
}

CourseViewEntregas.propTypes = {
  currentUploadType: PropTypes.string.isRequired,
  handleOpenUploadModal: PropTypes.func.isRequired,
  uploadFileName: PropTypes.string.isRequired,
  setUploadFileName: PropTypes.func.isRequired,
  handleOpenUploadModalButton: PropTypes.func.isRequired,
  openUploadModal: PropTypes.bool.isRequired,
  handleCloseUploadModal: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  handleSubmitUpload: PropTypes.func.isRequired,
  uploadFile: PropTypes.object,
};

export default CourseViewEntregas;
 