/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";

export default function data(students, onViewStudent, onDeleteClick) {
  // Cambiado a onDeleteClick
  const Estudiante = ({ image, name, id, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{"V-" + id}</MDTypography>
        <br></br>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Estudiante", accessor: "estudiante", width: "45%", align: "left" },
      { Header: "Carrera", accessor: "carrera", align: "left" },
      { Header: "Estatus", accessor: "estatus", align: "center" },
      { Header: "Acciones", accessor: "action", align: "center" },
    ],

    rows: students.map((student) => ({
      estudiante: (
        <Estudiante name={student.nombre} id={student.cedula} image={team2} email={student.email} localidad={student.localidad} />
      ),
      carrera: <Job title={student.carrera} description={Array.isArray(student.materia) ? student.materia.map((m) => {
        return `${m} `;}) : student.materia || ''} />,
      estatus: (
        <MDBox ml={-1}>
          <MDBadge badgeContent={student.status} color="success" variant="gradient" size="sm" />
        </MDBox>
      ),
      action: (
        <>
          <MDTypography
            component="button"
            onClick={() => onViewStudent?.(student.cedula)}
            variant="caption"
            color="text"
            fontWeight="medium"
            sx={{
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": { color: "primary.main" },
              marginRight: "10px",
            }}
          >
            Ver Estudiante
          </MDTypography>
          <MDTypography
            component="button"
            onClick={() => onDeleteClick?.(student.cedula)}
            variant="caption"
            color="text"
            fontWeight="medium"
            sx={{
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": { color: "error.main" },
            }}
          >
            Borrar Estudiante
          </MDTypography>
        </>
      ),
    })),
  };
}
