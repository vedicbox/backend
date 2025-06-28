import mongoose from "mongoose";

const patientDetailsSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            maxlength: 35,
            trim: true,
            required: [true, "First name is required"],
        },
        lastName: {
            type: String,
            maxlength: 35,
            trim: true,
        },
        dob: {
            type: Date,
            required: [true, "Date of birth is required"],
        },
        age: {
            type: Number,
            min: [0, "Age cannot be negative"],
            max: [150, "Age seems unrealistic"],
        },
        weight: {
            type: Number,
            min: [0, "Weight cannot be negative"],
        },
        height: {
            type: String,
            maxlength: 10
        },
        gender: {
            type: String,
            uppercase: true,
        },
        maritalStatus: {
            type: String,
        },
        createId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

const PatientDetails = mongoose.model("patient_details", patientDetailsSchema);
export default PatientDetails;
