import express from "express";
import AuthController from "../../controller/auth/AuthController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import {
  validateLogin,
  validateSignUp,
} from "../../middlewares/validationMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signUp", validateSignUp, AuthController.signUp);
router.post("/login", validateLogin, AuthController.login);

// Protected routes
router.use(isAuthenticated);
router.get("/validate", AuthController.authCheck);

export default router;
