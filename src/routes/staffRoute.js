// routes/patientRoutes.js
import express from "express";
import StaffController from "../controller/StaffController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);

// Create patient
router.post("/profile/create", StaffController.createStaffProfile);
router.get("/profile/edit", StaffController.editStaffProfile);
router.post("/profile/update", StaffController.updateStaffProfile);
router.get("/fetch-tablist", StaffController.fetchTabList);
router.get("/list-via-role", StaffController.fetchStaffListByRole);

export default router;
