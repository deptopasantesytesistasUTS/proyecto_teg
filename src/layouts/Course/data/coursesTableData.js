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

const Job = ({ title }) => (
  <MDBox lineHeight={1} textAlign="left">
    <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
      {title}
    </MDTypography>
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

Job.propTypes = {
  title: PropTypes.string.isRequired,
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
export default function data(courses) {
  return {
    columns: [
      { Header: "Nombre", accessor: "nombre" },
    { Header: "Carrera", accessor: "carrera" },
    { Header: "Profesores", accessor: "profesores" },
    { Header: "Estatus", accessor: "estatus" },
    { Header: "Action", accessor: "action" },
    ],
    rows: courses.map((c) => ({
      nombre: (
        <Course name={c.nombre}></Course>
      ),
      estatus: (
        <MDBox ml={-1}>
          <MDBadge badgeContent={c.estatus} color="success" variant="gradient" size="sm" />
        </MDBox>
      ),
      profesores: (
        <Professor name={c.profesores}></Professor>
      ),
      carrera: (
        <Job title={c.carrera} />
      ),
      action: (
        <MDTypography
          component="a"
          href={"/aulaVirtualAdm/" + c.idSeccion}
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          Ver Aula Virtual
        </MDTypography>
      ),
    })),
  };
}
