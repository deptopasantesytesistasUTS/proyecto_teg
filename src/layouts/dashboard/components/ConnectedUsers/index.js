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
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Config
import { backendUrl } from "config";

function ConnectedUsers() {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnectedUsers = async () => {
      try {
        setLoading(true);
        
        // Llamada al backend para obtener usuarios conectados reales
        const response = await fetch(`${backendUrl}/dashboard/connected-users?userId=1&role=1`);
        
        if (response.ok) {
          const data = await response.json();
          setConnectedUsers(data);
        } else {
          console.error('Error al obtener usuarios conectados');
          setConnectedUsers([]);
        }
      } catch (error) {
        console.error('Error fetching connected users:', error);
        setConnectedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConnectedUsers();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchConnectedUsers, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "success";
      case "away":
        return "warning";
      case "offline":
        return "error";
      default:
        return "info";
    }
  };

  // Función para obtener el icono del estado
  const getStatusIcon = (status) => {
    switch (status) {
      case "online":
        return "fiber_manual_record";
      case "away":
        return "schedule";
      case "offline":
        return "radio_button_unchecked";
      default:
        return "help";
    }
  };

  // Función para obtener el color del rol
  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "administrador":
        return "error";
      case "docente":
        return "primary";
      case "estudiante":
        return "success";
      case "coordinadora":
        return "warning";
      default:
        return "info";
    }
  };

  // Función para formatear el tiempo transcurrido
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Ahora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  // Función para obtener el texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case "online":
        return "En línea";
      case "away":
        return "Ausente";
      case "offline":
        return "Desconectado";
      default:
        return "Desconocido";
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDBox display="flex" alignItems="center" justifyContent="space-between">
          <MDTypography variant="h6" fontWeight="medium">
            Usuarios Conectados
          </MDTypography>
          <Chip 
            label={`${connectedUsers.filter(user => user.status === 'online').length} en línea`}
            color="success"
            size="small"
            icon={<Icon>group</Icon>}
          />
        </MDBox>
      </MDBox>
      
      <MDBox p={2}>
        {loading ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <MDTypography variant="body2" color="text">
              Cargando usuarios...
            </MDTypography>
          </MDBox>
        ) : connectedUsers.length === 0 ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <MDTypography variant="body2" color="text">
              No hay usuarios conectados
            </MDTypography>
          </MDBox>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {connectedUsers.map((user, index) => (
              <div key={user.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <Avatar 
                      alt={user.name} 
                      src={user.avatar}
                      sx={{ 
                        width: 48, 
                        height: 48,
                        border: 2,
                        borderColor: `${getStatusColor(user.status)}.main`
                      }}
                    />
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <MDBox display="flex" alignItems="center" gap={1}>
                        <MDTypography variant="body2" fontWeight="medium">
                          {user.name}
                        </MDTypography>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role)}
                          size="small"
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      </MDBox>
                    }
                    secondary={
                      <MDBox>
                        <MDBox display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Icon 
                            sx={{ 
                              fontSize: 12, 
                              color: `${getStatusColor(user.status)}.main` 
                            }}
                          >
                            {getStatusIcon(user.status)}
                          </Icon>
                          <MDTypography variant="caption" color="text">
                            {getStatusText(user.status)}
                          </MDTypography>
                          <MDTypography variant="caption" color="text.secondary">
                            • {formatTimeAgo(user.lastSeen)}
                          </MDTypography>
                        </MDBox>
                        <MDTypography variant="caption" color="text.secondary">
                          {user.department}
                        </MDTypography>
                      </MDBox>
                    }
                  />
                </ListItem>
                {index < connectedUsers.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </div>
            ))}
          </List>
        )}
      </MDBox>
      
      <MDBox px={3} pb={2}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="caption" color="text.secondary">
            Total: {connectedUsers.length} usuarios
          </MDTypography>
          <MDTypography variant="caption" color="text.secondary">
            Actualizado: {new Date().toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </MDTypography>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default ConnectedUsers;
