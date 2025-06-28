import authRoute from "./auth/authRoute.js";
import roleRoute from "./auth/roleRoute.js";
import staffRoute from "./staffRoute.js";
import patientRoute from "./patientRoute.js";

// API routes
const routelist = [
  { path: "/auth", route: authRoute },
  { path: "/roles", route: roleRoute },
  { path: "/staff", route: staffRoute },
  { path: "/patient", route: patientRoute },
];

export default routelist;
