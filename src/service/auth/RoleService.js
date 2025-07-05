import RoleMapper from "../../mapper/RoleMapper.js";
import RoleRepo from "../../repo/auth/RoleRepo.js";
import { ServiceResponse } from "../../utils/responseHandler.js";

export default class RoleService {
  static async fetchRoleNames() {
    const roles = await RoleRepo.findRoles();
    return new ServiceResponse(200, null, roles);
  }

  static async createRole(roleData) {

    const createObj = RoleMapper.createRoleMapper(roleData);

    await RoleRepo.createRole(createObj);
    return new ServiceResponse(200, "Role created successfully", null);
  }

  static async updateRole(roleData) {
    const updatedRole = await RoleRepo.updateRole(roleData);
    return new ServiceResponse(200, "Role updated successfully", updatedRole);
  }

  /**
  * Fetch the list of available roles (active roles)
  * @returns {ServiceResponse}
  */
  static async fetchTableRoles() {
    const availableRoles = await RoleRepo.fetchTableRoles();
    return new ServiceResponse(200, null, { rolelist: availableRoles });
  }

}
