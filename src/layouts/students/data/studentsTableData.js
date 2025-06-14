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

export default function data() {
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

    rows: [
      {
        estudiante: (
          <Estudiante
            name="Luis Alejandro Cárdenas Lozano"
            id="30443230"
            image={team2}
            email="luiscl1804@gmail.com"
          />
        ),
        carrera: <Job title="Informática" description="Trabajo Especial de Grado (TEG)" />,
        estatus: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography
            component="a"
            href="/estudiantes/30443230"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            Ver Estudiante
          </MDTypography>
        ),
      },
      {
        estudiante: (
          <Estudiante
            name="Oriana Margarita Duran Zambrano"
            image={team2}
            email="orianadaran1@gmail.com"
            id="28457689"
          />
        ),
        carrera: <Job title="Diseño" description="Investigación 2" />,
        estatus: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Ver Estudiante
          </MDTypography>
        ),
      },
      {
        estudiante: (
          <Estudiante
            name="Kevin Alejandro Sanabria Ramirez"
            image={team2}
            email="kevin@gmail.com"
            id="30163499"
          />
        ),
        carrera: <Job title="Diseño" description="Pasantias" />,
        estatus: (
          <MDBox ml={-1}>
            <MDBadge badgeContent="activo" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Ver Estudiante
          </MDTypography>
        ),
      },
    ],
  };
}
