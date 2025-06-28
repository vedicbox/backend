import StaffProfileSchema from "../models/staff/StaffProfileSchema.js";

export default class StaffProfileRepo {
  static async createProfile(profileData) {
    const profile = new StaffProfileSchema(profileData);
    return await profile.save();
  }

  static async findProfileById(profileId) {
    return await StaffProfileSchema.findById(profileId).populate({
      path: "userRef", // Populate user details
      select: "firstName lastName username email", // Select only required fields from User
      populate: [
        {
          path: "roleRef", // Populate role details
          select: "_id", // Select only the role name
        },
      ],
    }); // Populate user details if needed
  }

  static async updateProfile(profileId, profileData) {
    return await StaffProfileSchema.findByIdAndUpdate(profileId, profileData, {
      new: true,
    });
  }

  /**
   * Fetch all staff details
   * @returns {Promise<Array<Object>>}
   */
  static async fetchAllStaff() {
    return await StaffProfileSchema.find({})
      .populate({
        path: "userRef", // Populate user details
        select: "firstName lastName username email", // Select only required fields from User
        populate: {
          path: "roleRef", // Populate role details
          select: "name", // Select only the role name
        },
      })
      .select("phoneNo gender createdAt") // Select required fields from StaffProfile
      .lean(); // Return plain JavaScript objects instead of Mongoose documents
  }
}
