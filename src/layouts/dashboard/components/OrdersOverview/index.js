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
import { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview() {
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComunicados = async () => {
      try {
        setLoading(true);
        // Obtener comunicados del dashboard (para admin, usar role 1)
        const response = await fetch('http://localhost:3003/api/dashboard/comunicados?userId=1&role=1');
        if (!response.ok) {
          throw new Error('Error al obtener comunicados');
        }
        const data = await response.json();
        setComunicados(data);
      } catch (error) {
        console.error('Error fetching comunicados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComunicados();
  }, []);
  // Función para obtener el color según el tipo de comunicado
  const getComunicadoColor = (tipo) => {
    switch (tipo) {
      case "urgente":
        return "error";
      case "informacion":
        return "info";
      case "evento":
        return "success";
      case "recordatorio":
        return "warning";
      case "mantenimiento":
        return "secondary";
      case "resultados":
        return "primary";
      default:
        return "info";
    }
  };

  // Función para obtener el icono según el tipo de comunicado
  const getComunicadoIcon = (tipo) => {
    switch (tipo) {
      case "urgente":
        return "warning";
      case "informacion":
        return "info";
      case "evento":
        return "event";
      case "recordatorio":
        return "notifications";
      case "mantenimiento":
        return "build";
      case "resultados":
        return "assessment";
      default:
        return "notifications";
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).toUpperCase();
  };

  // Función para truncar texto largo
  const truncateText = (text, maxLength = 100) => {
    if (!text) return "Sin descripción disponible";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium" align="center">
          COMUNICADOS
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {loading ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="100px">
            <MDTypography variant="body2" color="text.secondary">
              Cargando comunicados...
            </MDTypography>
          </MDBox>
        ) : comunicados.length === 0 ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="100px">
            <MDTypography variant="body2" color="text.secondary">
              No hay comunicados disponibles
            </MDTypography>
          </MDBox>
        ) : (
          comunicados.slice(0, 5).map((comunicado, index) => (
            <TimelineItem
              key={comunicado.idComunicado || index}
              color={getComunicadoColor(comunicado.tipo)}
              icon={getComunicadoIcon(comunicado.tipo)}
              title={comunicado.titulo || "Comunicado"}
              dateTime={formatDate(comunicado.created_At)}
              description={truncateText(comunicado.texto, 80)}
            />
          ))
        )}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
