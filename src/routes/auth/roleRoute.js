import express from "express";
import RoleController from "../../controller/auth/RoleController.js";

const router = express.Router();

/**
 * Route to fetch roles
 * @route GET /fetch/roles
 */
router.get("/fetch/roleNames", RoleController.fetchRoleNames);

/**
 * Route to create a new role
 * @route POST /create/role
 */
router.post("/create", RoleController.createRole);

/**
 * Route to update an existing role
 */
router.post("/update", RoleController.updateRole);

/**
 * Route to fetch available roles (active roles)
 * @route GET /fetch/availableRoles
 */
router.get("/fetch-tablist", RoleController.fetchTableRoles);

export default router;