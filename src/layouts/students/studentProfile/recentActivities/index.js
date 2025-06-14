/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

function RecentActivities() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium" align="center">
          Actividades Recientes
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <TimelineItem
          color="success"
          icon="notifications"
          title="Entrega del Borrador 3"
          dateTime="22 DEC 7:20 PM"
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title="Entrega del Borrador 2"
          dateTime="16 DEC 7:20 PM"
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title="Entrega del Borrador 1"
          dateTime="14 DEC 7:20 PM"
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title="Entrega de TItulos"
          dateTime="12 DEC 7:20 PM"
        />
      </MDBox>
    </Card>
  );
}

export default RecentActivities;
