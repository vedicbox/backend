import Role from "../../models/auth/Role.js";

export default class RoleRepo {
  static async findRoles() {
    return await Role.find({}, { name: 1, _id: 1 });
  }

  static async createRole(roleData) {
    const role = new Role(roleData);
    return await role.save();
  }

  static async updateRole(roleData) {
    return await Role.findByIdAndUpdate(roleData._id, roleData, { new: true });
  }

  /**
   * Find a role by its ID
   * @param {string} roleId
   * @returns {Promise<Object|null>}
   */
  static async findRoleById(roleId) {
    return await Role.findById(roleId);
  }

  /**
  * Fetch all active roles
  * @returns {Promise<Array<Object>>}
  */
  static async fetchTableRoles() {
    return await Role.find({});
  }

}
