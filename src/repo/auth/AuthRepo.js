import Role from "../../models/auth/Role.js";
import User from "../../models/auth/User.js";

export default class AuthRepo {
  /**
   * Find a user by email
   * @param {string} email - User email
   * @param {string} [selectFields] - Fields to select
   * @returns {Promise<Object|null>}
   */
  static async findUserByFields(validateFields, selectFields = null) {
    return await User.findOne({ ...validateFields }).select(selectFields);
  }

  /**
   * Find a user by ID
   * @param {string} userId - User ID
   * @param {string} [selectFields] - Fields to select
   * @returns {Promise<Object|null>}
   */
  static async findUserById(userId, selectFields = null) {
    return await User.findById(userId).select(selectFields);
  }

  static async updateUser(userId, userData) {
    return await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>}
   */
  static async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Fetch users' names and IDs by role name
   * @param {string} roleName - Role name to filter users
   * @returns {Promise<Array<{ id: string, name: string }>>}
   */
  static async fetchUsersByRoleName(roleName) {
    // Step 1: Fast indexed query on Role
    const role = await Role.findOne({ name: roleName }).select("_id").lean();
    if (!role) return [];

    // Step 2: Filter users directly with indexed roleRef
    return await User.aggregate([
      { $match: { roleRef: role._id } },
      {
        $project: {
          _id: 1,
          name: { $concat: ["$firstName", " ", "$lastName"] },
        },
      },
    ]);
  }

}
