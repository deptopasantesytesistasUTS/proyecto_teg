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

export default function teachersTableData(teachers) {
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


  return {
    columns: [
      { Header: "Profesor", accessor: "profesor", width: "45%", align: "left" },
      { Header: "Estatus", accessor: "estatus", align: "center" },
      { Header: "Acciones", accessor: "action", align: "center" },
    ],

    rows: teachers.map((p) => ({
      profesor: (
        <Profesor
          name= {p.nombre}
          id={p.cedula}
          image={team2}
          email={p.correo}
        />
      ),
      estatus: (
        <MDBox ml={-1}>
          <MDBadge badgeContent={p.estatus} color="success" variant="gradient" size="sm" />
        </MDBox>
      ),
      action: (
        <MDTypography
          component="a"
          href={"/docentes/"+ p.cedula}
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          Ver Profesor
        </MDTypography>
      ),
    }))
      
  };
}
