import AuthRepo from "../repo/auth/AuthRepo.js";
import RoleRepo from "../repo/auth/RoleRepo.js";
import { default as StaffProfileRepo, default as StaffRepo } from "../repo/StaffRepo.js";
import { ServiceResponse } from "../utils/responseHandler.js";

export default class StaffService {
  /**
   * Create a new staff profile
   * @param {Object} profileData - Staff profile data
   * @returns {ServiceResponse}
   */
  static async createStaffProfile(profileData) {
    const role = await RoleRepo.findRoleById(profileData.roleId);
    if (!role) {
      return new ServiceResponse(404, "Role Not Found");
    }

    const newUser = await AuthRepo.createUser({
      email: profileData.email,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      password: profileData.email, // Hash the email as the password
      clinicRef: profileData.clinicId, // Add clinicId field
      roleRef: profileData.roleId, // Add roleId field
    });

    // Create and save the StaffProfile object
    const staffProfile = {
      phoneNo: profileData.phoneNo,
      whatsappNo: profileData.whatsappNo,
      gender: profileData.gender,
      dob: profileData.dob,
      country: profileData.country,
      state: profileData.state,
      city: profileData.city,
      pincode: profileData.pincode,
      address: profileData.address,
      userRef: newUser._id, // Link the saved User's ID
    };

    const newProfile = await StaffProfileRepo.createProfile(staffProfile); // Save the StaffProfile to the database

    return new ServiceResponse(
      200,
      "Staff profile created successfully",
      newProfile
    );
  }

  static async editStaffProfile(profileId) {
    const profile = await StaffRepo.findProfileById(profileId);
    return new ServiceResponse(200, null, profile);
  }

  static async updateStaffProfile(profileData) {
    const role = await RoleRepo.findRoleById(profileData.roleId);
    if (!role) {
      return new ServiceResponse(404, "Role Not Found");
    }

    // Update the User object
    const updatedUser = await AuthRepo.updateUser(profileData.userId, {
      email: profileData.email,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      clinicRef: profileData.clinicId,
      roleRef: profileData.roleId,
    });

    if (!updatedUser) {
      return new ServiceResponse(404, "User Not Found");
    }

    // Update the StaffProfile object
    const updatedProfile = await StaffRepo.updateProfile(profileData.staffId, {
      phoneNo: profileData.phoneNo,
      whatsappNo: profileData.whatsappNo,
      gender: profileData.gender,
      dob: profileData.dob,
      country: profileData.country,
      state: profileData.state,
      city: profileData.city,
      pincode: profileData.pincode,
      address: profileData.address,
      user: updatedUser._id, // Link the updated User's ID
    });

    if (!updatedProfile) {
      return new ServiceResponse(404, "Staff Profile Not Found");
    }

    return new ServiceResponse(
      200,
      "Staff profile updated successfully",
      updatedProfile
    );
  }

  /**
   * Fetch all staff details for tabular view
   * @returns {ServiceResponse}
   */
  static async fetchTabList() {
    const staffList = await StaffRepo.fetchAllStaff();
    return new ServiceResponse(200, null, staffList);
  }


  /**
   * Fetch staff list (name and ID) by role name
   * @param {String} roleName - Role name
   * @returns {ServiceResponse}
   */
  static async fetchStaffListByRole(roleName) {
    try {
      // Validate roleName
      if (!roleName) {
        throw new Error("Role name is required");
      }

      // Fetch staff list by role name
      const staffList = await AuthRepo.fetchUsersByRoleName(roleName);

      if (!staffList || staffList.length === 0) {
        return new ServiceResponse(404, "No staff found for the given role");
      }

      return new ServiceResponse(
        200,
        "Staff list fetched successfully",
        staffList
      );
    } catch (error) {
      throw new Error("Unable to fetch staff list: " + error.message);
    }
  }

}
