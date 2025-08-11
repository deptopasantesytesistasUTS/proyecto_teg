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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
//import rutas protegidas
import { AuthProvider } from "context/AuthContext";
import ProtectedRoute from "components/ProtectedRoute/ProtectedRoute";

//paginas

import Dashboard from "layouts/dashboard";
import Students from "layouts/students";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import StudentProfile from "layouts/students/studentProfile";
import SignUp from "layouts/authentication/sign-up";
import Teachers from "layouts/teachers";
import TeacherProfile from "layouts/teachers/teacherProfile";
import Courses from "layouts/Course";
import CourseView from "layouts/Course/CourseView";
import DashboardStudents from "layouts/dashboard-Students";
import CourseViewStudents from "layouts/Course/CourseViewStudents";
import DashboardTeachers from "layouts/dashboard-Teachers";
import CourseViewTeachers from "layouts/Course/CourseViewTeachers";
import SemesterConfig from "layouts/semester";
// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    allowedRoles: [1],
  },
  {
    type: "collapse",
    name: "Estudiantes",
    key: "estudiantes",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/estudiantes",
    component: <Students />,
    allowedRoles: [1],
  },
  {
    name: "Perfil-Estudiante",
    key: "estudiantes",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/estudiantes/:id",
    component: <StudentProfile />,
    allowedRoles: [1, 2],
  },
  {
    type: "collapse",
    name: "Docentes",
    key: "Docente",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/docentes",
    component: <Teachers />,
    allowedRoles: [1],
  },
  {
    type: "collapse",
    name: "Unidades",
    key: "Unidades",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/materias",
    component: <Courses />,
    allowedRoles: [1],
  },
  {
    type: "collapse",
    name: "Configuración Lapso",
    key: "semester-config",
    icon: <Icon fontSize="small">schedule</Icon>,
    route: "/semester-config",
    component: <SemesterConfig />,
    allowedRoles: [1],
  },

  // rutas profesores
  {
    type: "collapse",
    name: "Dashboard Docentes",
    key: "dashboard-teachers",
    icon: <Icon fontSize="small">school</Icon>,
    route: "/dashboard-teachers",
    component: <DashboardTeachers />,
    allowedRoles: [2],
  },

  //rutas estudiantes
  {
    type: "collapse",
    name: "Dashboard Estudiantes",
    key: "dashboard-students",
    icon: <Icon fontSize="small">school</Icon>,
    route: "/dashboard-students",
    component: <DashboardStudents />,
    allowedRoles: [3],
  },
  // rutas publicas
  {
    type: "url",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    allowedRoles: [1, 2, 3],
  },
  
  {
    type: "url",
    name: "Salir",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    allowedRoles: [1, 2, 3],
  },
  
];

export default routes;
