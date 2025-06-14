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

function Sidenav({ routes }) {
  const location = useLocation();
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor, transparentSidenav, whiteSidenav } = controller;

  const collapseName = location.pathname.replace("/", "");

  let textColor = "white";
  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const renderRoutes = routes.map(({ type, name, icon, noCollapse, key, href, route }) => {
    if (type !== "collapse") return null;

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
            textColor={textColor}
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
            textColor={textColor}
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
