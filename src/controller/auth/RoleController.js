import RoleService from "../../service/auth/RoleService.js";
import { HttpHandler } from "../../utils/responseHandler.js";

export default class RoleController {
  static async fetchRoleNames(req, res) {
    try {
      const response = await RoleService.fetchRoleNames();
      return HttpHandler.send(res, response);
    } catch (error) {
      return HttpHandler.error(res, error);
    }
  }

  static async createRole(req, res) {
    try {
      const response = await RoleService.createRole(req.body);
      return HttpHandler.send(res, response);
    } catch (error) {
      return HttpHandler.error(res, error);
    }
  }

  static async updateRole(req, res) {
    try {
      const response = await RoleService.updateRole(req.body);
      return HttpHandler.send(res, response);
    } catch (error) {
      return HttpHandler.error(res, error);
    }
  }

  static async editRole(req, res) {
    try {
      const response = await RoleService.editRole(req.params.id);
      return HttpHandler.send(res, response);
    } catch (error) {
      return HttpHandler.error(res, error);
    }
  }

  /**
 * Fetch the list of available roles (active roles)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {ResponseHandler}
 */
  static async fetchTableRoles(req, res) {
    try {
      const response = await RoleService.fetchTableRoles();
      return HttpHandler.send(res, response);
    } catch (error) {
      return HttpHandler.error(res, error);
    }
  }

}
