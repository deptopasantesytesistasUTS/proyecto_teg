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
import { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import Cronograma from "layouts/dashboard/components/Cronograma";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [dashboardEvents, setDashboardEvents] = useState([
    {
      id: 1,
      title: "Reunión de Coordinación",
      date: new Date(2024, 11, 15),
      type: "reunion",
      description: "Reunión mensual de coordinación académica"
    },
    {
      id: 2,
      title: "Evaluación de Proyectos",
      date: new Date(2024, 11, 20),
      type: "proyecto",
      description: "Evaluación de proyectos finales de estudiantes"
    },
    {
      id: 3,
      title: "Planificación Semestral",
      date: new Date(2024, 11, 25),
      type: "clase",
      description: "Planificación del próximo semestre académico"
    }
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obtener eventos del dashboard (para admin, usar role 1)
        const eventsResponse = await fetch('http://localhost:3003/api/dashboard/events?userId=1&role=1');
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

            {/* Projects */}
            <Grid item xs={12}>
              <MDBox mb={3}>
                <Projects />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
