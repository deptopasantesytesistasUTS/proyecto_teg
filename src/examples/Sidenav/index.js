import { useLocation, NavLink } from "react-router-dom";
import PropTypes from "prop-types";

// @mui components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Icon from "@mui/material/Icon";

// Assets
import logo from "../../assets/images/LOGO UNIVERSIDAD_Mesa de trabajo 1.png";

// Custom components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Context
import { useMaterialUIController } from "context";
import { useAuth } from "context/AuthContext";

function Sidenav({ routes }) {
  const location = useLocation();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor, transparentSidenav, whiteSidenav } = controller;
  const { user } = useAuth();

  const collapseName = location.pathname.replace("/", "");

  let textColor = "white";
  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  // Filtrar rutas según el rol del usuario
  const filteredRoutes = routes.filter((route) => {
    if (!user) return false;

    // Si la ruta no tiene allowedRoles, no se muestra
    if (!route.allowedRoles) return false;

    // Verificar si el rol del usuario está permitido
    const userRole = user.role;
    return route.allowedRoles.includes(userRole) || route.allowedRoles.includes(String(userRole));
  });

  const renderRoutes = filteredRoutes.map(({ type, name, icon, noCollapse, key, href, route }) => {
    if (type !== "collapse" && type !== "url") return null;

    const isActive = key === collapseName;

    return href ? (
      <MDBox key={key} mx={1}>
        <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
          <SidenavCollapse
            name={name}
            icon={icon}
            active={isActive}
            noCollapse={noCollapse}
            color={sidenavColor}
            orientation="horizontal"
          />
        </a>
      </MDBox>
    ) : (
      <MDBox key={key} mx={1}>
        <NavLink to={route} style={{ textDecoration: "none" }}>
          <SidenavCollapse
            name={name}
            icon={icon}
            active={isActive}
            color={sidenavColor}
            orientation="horizontal"
          />
        </NavLink>
      </MDBox>
    );
  });

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: transparentSidenav
          ? "transparent"
          : whiteSidenav
          ? "white"
          : (theme) => theme.palette[sidenavColor].main,
        boxShadow: "none",
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        color: textColor === "white" ? "white" : "inherit",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 8 }}>
        <MDBox
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ marginLeft: { xs: "0px", md: "100px" } }}
        >
          <MDBox
            component="img"
            src={logo}
            alt="Brand"
            sx={{
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
            }}
          />
        </MDBox>
        <MDBox display="flex">{renderRoutes}</MDBox>
      </Toolbar>
    </AppBar>
  );
}

Sidenav.defaultProps = {
  brand: "",
};

Sidenav.propTypes = {
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
