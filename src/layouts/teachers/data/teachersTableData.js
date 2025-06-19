/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

export default function teachersTableData() {
  const Profesor = ({ image, name, id, email }) => (
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
      { Header: "Profesor", accessor: "profesor", width: "45%", align: "left" },
      { Header: "Carrera", accessor: "carrera", align: "left" },
      { Header: "Estatus", accessor: "estatus", align: "center" },
      { Header: "Acciones", accessor: "action", align: "center" },
    ],

    rows: [
      {
        profesor: (
          <Profesor
            name="Pedro Alexandro Perez Mora"
            id="20433708"
            image={team2}
            email="perezmora12@gmail.com"
          />
        ),
        carrera: (
          <Job
            title="Informática"
            description="Trabajo Especial de Grado (TEG) (Docente) Investigación II (Jurado)"
          />
        ),
        estatus: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography
            component="a"
            href="/docentes/30443230"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            Ver Profesor
          </MDTypography>
        ),
      },
      {
        profesor: (
          <Profesor
            name="Oriana Margarita Duran Zambrano"
            image={team2}
            email="orianadaran1@gmail.com"
            id="28457689"
          />
        ),
        carrera: <Job title="Diseño" description="Investigación 2 (Tutor)" />,
        estatus: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Ver Profesor
          </MDTypography>
        ),
      },
    ],
  };
}
