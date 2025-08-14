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

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import { backendUrl } from "config";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [dashboardEvents, setDashboardEvents] = useState([]);


  // Lista simulada de conectados
  const [connectedUsers, setConnectedUsers] = useState([
    { id: 1, name: "Luis Cárdenas", role: "Administrador", avatar: "https://i.pravatar.cc/40?img=1" },
    { id: 2, name: "Ismael Sánchez", role: "Docente", avatar: "https://i.pravatar.cc/40?img=2" },
    { id: 3, name: "Kevin Sanabria", role: "Estudiante", avatar: "https://i.pravatar.cc/40?img=3" },
    { id: 4, name: "Oriana Durán", role: "Coordinadora", avatar: "https://i.pravatar.cc/40?img=4" }
  ]);

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
            {/* Cronograma */}
            <Grid item xs={12} lg={8}>
              <MDBox mb={3}>
                <Cronograma 
                  events={dashboardEvents}
                  onEventClick={(event) => console.log('Evento seleccionado:', event)}
                />
              </MDBox>
            </Grid>

            {/* Comunicados */}
            <Grid item xs={12} lg={4}>
              <MDBox mb={3}>
                <OrdersOverview />
              </MDBox>
              </Grid>

             <MDBox mb={6}>
                <ReportsBarChart
                  color="info"
                  title="ENTRADA DE ESTUDIANTES"
                  date="Última actualización: Hoy"
                  chart={reportsBarChartData}
                />
              </MDBox>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;

