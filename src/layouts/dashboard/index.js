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
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";

// Dashboard components
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import Cronograma from "layouts/dashboard/components/Cronograma";
import ConnectedUsers from "layouts/dashboard/components/ConnectedUsers";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { backendUrl } from "config";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [dashboardEvents, setDashboardEvents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obtener eventos del dashboard (para admin, usar role 1)
        const eventsResponse = await fetch(`${backendUrl}/dashboard/events?userId=1&role=1`);
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setDashboardEvents(eventsData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            
            {/* Comunicados - 4 columnas */}
            <Grid item xs={6} lg={3} >
              <OrdersOverview />
            </Grid>

            {/* Cronograma - 4 columnas */}
            <Grid item xs={12} lg={6}>
              <MDBox mb={3}>
                <Cronograma 
                  events={dashboardEvents}
                  onEventClick={(event) => console.log('Evento seleccionado:', event)}
                />
              </MDBox>
            </Grid>

            {/* Usuarios Conectados - 4 columnas */}
            <Grid item xs={6} lg={3}>
              <ConnectedUsers />
            </Grid>

            
            
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;

