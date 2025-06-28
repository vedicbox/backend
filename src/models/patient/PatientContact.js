import mongoose from "mongoose";

const patientContactSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientDetails",
      required: true,
    },
    phone1: {
      type: String,
      match: [/^[0-9]{10,15}$/, "Please enter a valid phone number"],
      trim: true,
    },
    phone2: {
      type: String,
      match: [/^[0-9]{10,15}$/, "Please enter a valid phone number"],
      trim: true,
    },
    whatsappPref: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    email: {
      type: String,
      maxlength: 45,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      lowercase: true,
      trim: true,
    },
    createId: {
      type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toObject: { virtuals: true },
  }
);

const PatientContact = mongoose.model("patient_contacts", patientContactSchema);
export default PatientContact;
