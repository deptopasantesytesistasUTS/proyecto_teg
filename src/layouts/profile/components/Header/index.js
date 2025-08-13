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

import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import backgroundImage from "assets/images/illustrations/fondo2.jpg";
import logo from "assets/images/logo-small.fw.png";
import burceMars from "assets/images/bruce-mars.jpg";
import team1 from "assets/images/team-1.jpg";
import { Alert } from "@mui/material";
import { backendUrl } from "config";

function Header({ children, userData, imagePreview,imageError,profileImage }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }
    console.log("hola: " + profileImage);
    console.log(profileImage);

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);



  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  // Generate full name from user data
  const getFullName = () => {
    if (!userData) return "Usuario";

    const firstName = userData.firstName || "";
    const secondName = userData.secondName || "";
    const firstLastName = userData.firstLastName || "";
    const secondLastName = userData.secondLastName || "";

    const names = [firstName, secondName, firstLastName, secondLastName].filter(Boolean);
    return names.length > 0 ? names.join(" ") : "Usuario";
  };

  // Get user role
  const getUserRole = () => {
    if (!userData) return "Usuario";
    return userData.role || "Usuario";
  };

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDBox display="flex" flexDirection="column" alignItems="center" p={2}>
              {/* Mostrar previsualización o imagen actual */}
              {imagePreview ? (
                <MDAvatar src={imagePreview} alt="Previsualización" size="xl" />
              ) : userData?.profileImage ? (
                <MDAvatar src={profileImage} alt="Foto de perfil" size="xl" />
              ) : (
                <MDAvatar
                  src={profileImage} // Imagen por defecto
                  alt="Foto de perfil"
                  size="xl"
                />
              )}
              {imageError && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {imageError}
                </Alert>
              )}
            </MDBox>
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {getFullName()}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {getUserRole()}
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
  userData: null,
  imagePreview: null,
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
  userData: PropTypes.object,
  imagePreview: PropTypes.any,
  imageError: PropTypes.string,
  profileImage: PropTypes.any
};

export default Header;
