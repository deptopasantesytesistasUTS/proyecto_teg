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

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/illustrations/fondo2.jpg";
import logo from "assets/images/logo-small.fw.png";
import { backendUrl } from "config";

// Función global de logout
export function logout(setUser) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setUser(null);
}

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        // Normaliza el campo de rol para que siempre sea 'role'
        const userData = {
          ...data.user,
          userId: data.user.userId || data.user.cedula || data.user.id,
          role: data.user.role_id || data.user.role, // Normaliza a 'role'
        };
        setUser(userData);
        console.log("Rol recibido:", userData.role, typeof userData.role);
        // Redirección según el rol numérico o string
        if (userData.role === 1 || userData.role === "1") {
          console.log("Antes de navigate /dashboard");
          navigate("/dashboard");
          console.log("Después de navigate /dashboard");
        } else if (userData.role === 2 || userData.role === "2") {
          console.log("Antes de navigate /dashboard-teachers");
          navigate("/dashboard-teachers");
          console.log("Después de navigate /dashboard-teachers");
        } else if (userData.role === 3 || userData.role === "3") {
          console.log("Antes de navigate /dashboard-students");
          navigate("/dashboard-students");
          console.log("Después de navigate /dashboard-students");
        } else {
          alert("Rol desconocido, no se puede redirigir.");
        }
      } else {
        alert(data.error || "Error en login");
      }
    } catch (error) {
      alert("Error de red o servidor");
    }
  }

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <img src={logo} alt="logo" style={{ width: "100px", height: "80px" }} />
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            INICIO DE SESIÓN
          </MDTypography>
          
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                INGRESAR
              </MDButton>
            </MDBox>
            
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
