import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
      unique: true, 
    },
    status: {
      type: Number, 
      default: 1
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Role = mongoose.model("roles", roleSchema);

export default Role;