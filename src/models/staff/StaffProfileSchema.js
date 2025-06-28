import mongoose from "mongoose";

const staffProfileSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the User model
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    whatsappNo: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the creation timestamp
      immutable: true, // Prevent updates to this field
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically set the update timestamp
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
  }
);

const StaffProfile = mongoose.model("staff_profiles", staffProfileSchema);

export default StaffProfile;
