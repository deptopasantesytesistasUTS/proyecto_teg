import React from "react";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

// Componente para mostrar la materia
const Course = ({ name, code, credits }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDBox ml={2}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
      <MDTypography variant="caption">Código: {code}</MDTypography>
      <MDTypography variant="caption" display="block">
        {credits} créditos
      </MDTypography>
    </MDBox>
  </MDBox>
);

// Componente para mostrar el profesor
const Professor = ({ name, email }) => (
  <MDBox lineHeight={1}>
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {name}
    </MDTypography>
    <MDTypography variant="caption">{email}</MDTypography>
  </MDBox>
);

// Componente para mostrar el horario
const Schedule = ({ day, time, classroom }) => (
  <MDBox lineHeight={1}>
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {day} - {time}
    </MDTypography>
    <MDTypography variant="caption">Aula: {classroom}</MDTypography>
  </MDBox>
);

// Tipado de props (opcional si usas TypeScript)
Course.propTypes = {
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  credits: PropTypes.string.isRequired,
};

Professor.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

Schedule.propTypes = {
  day: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  classroom: PropTypes.string.isRequired,
};

// Función que exporta los datos de la tabla
export default function data() {
  return {
    columns: [
      { Header: "Materia", accessor: "materia", width: "25%", align: "left" },
      { Header: "Profesor", accessor: "profesor", align: "left" },
      { Header: "Horario", accessor: "horario", align: "left" },
      { Header: "Estatus", accessor: "estatus", align: "center" },
      { Header: "Acciones", accessor: "action", align: "center" },
    ],
    rows: [
      {
        materia: <Course name="Trabajo Especial de Grado (TEG)" code="TEG-001" credits="6" />,
        profesor: <Professor name="Dr. María González" email="maria.gonzalez@universidad.edu" />,
        horario: <Schedule day="Lunes" time="8:00 AM - 10:00 AM" classroom="A-101" />,
        estatus: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography
            component="a"
            href="/materias/TEG-001"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            Ver Materia
          </MDTypography>
        ),
      },
      {
        materia: <Course name="Investigación II" code="INV-002" credits="4" />,
        profesor: (
          <Professor name="Prof. Carlos Rodríguez" email="carlos.rodriguez@universidad.edu" />
        ),
        horario: <Schedule day="Martes" time="2:00 PM - 4:00 PM" classroom="B-203" />,
        estatus: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography
            component="a"
            href="/materias/INV-002"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            Ver Materia
          </MDTypography>
        ),
      },
      {
        materia: <Course name="Pasantías" code="PAS-003" credits="3" />,
        profesor: <Professor name="Lic. Ana Martínez" email="ana.martinez@universidad.edu" />,
        horario: <Schedule day="Miércoles" time="10:00 AM - 12:00 PM" classroom="C-105" />,
        estatus: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography
            component="a"
            href="/materias/PAS-003"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            Ver Materia
          </MDTypography>
        ),
      },
    ],
  };
}
