
import mongoose from "mongoose";

const alignPatientSchema = new mongoose.Schema(
    {
        caseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "cases", // Reference to the Case model
            required: true,
        },
        docId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "doctors", // Reference to the Doctor model
            required: true,
        },
        fee: {
            type: Number,
            required: true,
        },
        payTag: {
            type: String,
            required: true,
        },
        transId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "transactions",
        },
        status: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const AlignPatientSchema = mongoose.model("align_patients", alignPatientSchema);

export default AlignPatientSchema;