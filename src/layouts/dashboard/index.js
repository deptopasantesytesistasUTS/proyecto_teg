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
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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

  const fetchDashboardData = async () => {
    try {
      // Obtener eventos del dashboard (para admin, usar role 1)
      const eventsResponse = await fetch(`${backendUrl}/dashboard/events?userId=1&role=1`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        console.log('Eventos recibidos del dashboard:', eventsData);
        setDashboardEvents(eventsData || []);
      } else {
        console.error('Error en la respuesta del servidor:', eventsResponse.status);
        setDashboardEvents([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardEvents([]);
    }
  };

  useEffect(() => {
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Cronograma de Actividades</Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={fetchDashboardData}
                    sx={{ minWidth: 'auto' }}
                  >
                    Recargar
                  </Button>
                </Box>
                <Cronograma 
                  events={dashboardEvents}
                  onEventClick={(event) => console.log('Evento seleccionado:', event)}
                />
                {/* Debug info */}
                <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Eventos cargados: {dashboardEvents.length} | 
                    Última actualización: {new Date().toLocaleTimeString()}
                  </Typography>
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={async () => {
                      try {
                        const response = await fetch(`${backendUrl}/dashboard/test`);
                        const data = await response.json();
                        console.log('Test de base de datos:', data);
                        alert(`Estado: ${data.status}\nComunicados: ${data.counts.comunicados}\nLapsos: ${data.counts.lapsos}`);
                      } catch (error) {
                        console.error('Error en test:', error);
                        alert('Error al conectar con la base de datos');
                      }
                    }}
                    sx={{ mt: 0.5, fontSize: '0.7rem' }}
                  >
                    Test DB
                  </Button>
                </Box>
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

