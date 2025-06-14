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

function OrdersOverview() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium" align="center">
          COMUNICADOS
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <TimelineItem
          color="success"
          icon="notifications"
          title="Entrega de cartas tutores"
          dateTime="22 DEC 7:20 PM"
        />
        <TimelineItem
          color="error"
          icon="inventory_2"
          title="Notificacion de reunion general de tutores"
          dateTime="21 DEC 11 PM"
        />
        <TimelineItem
          color="warning"
          icon="payment"
          title="peticion de pago de cuotas"
          dateTime="20 DEC 2:20 AM"
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title="Entrega de cartas titulos"
          dateTime="22 DEC 7:20 PM"
        />
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
