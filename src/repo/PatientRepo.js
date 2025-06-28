const { default: AlignPatientSchema } = require("../models/patient/AlignPatientSchema");
const { default: PatientContact } = require("../models/patient/PatientContact");
const { default: PatientDetails } = require("../models/patient/PatientDetails");

class PatientRepo {
    static async findByPhone(phoneNumber) {
        return PatientContact.aggregate([
            {
                $match: {
                    $or: [{ phone1: phoneNumber }, { phone2: phoneNumber }],
                },
            },
            {
                $lookup: {
                    from: "patient_details", // Verify actual collection name
                    localField: "caseId", // Match PatientContact field name
                    foreignField: "_id", // Match PatientDetails field name
                    as: "details",
                },
            },
            {
                $unwind: {
                    path: "$details",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $project: {
                    _id: 0,
                    caseId: "$caseId",
                    gender: "$details.gender",
                    patientName: {
                        $trim: {
                            input: {
                                $concat: ["$details.firstName", " ", "$details.lastName"],
                            },
                        },
                    },
                    phone1: 1,
                },
            },
        ]);
    }

    static async validatePatientById(caseId) {
        const patient = await PatientDetails.findOne(
            { _id: caseId },
            { firstName: 1, lastName: 1 }
        ).lean(); // Using `.lean()` for faster plain JS object

        if (!patient) return null; // Early return if no patient found

        const { _id, ...rest } = patient;
        return { ...rest, caseId: _id }; // Destructure and rename _id → caseId
    }

    /**
     * Get contact details by caseId
     * @param {string} caseId - The case ID of the patient
     * @returns {Promise<Object|null>}
     */
    static async getContactByCaseId(caseId) {
        return PatientContact.findOne({ caseId }).lean();
    }

    /**
     * Update contact details by caseId
     * @param {Object} contactData - The updated contact data
     * @returns {Promise<Object|null>}
     */
    static async updateContactByCaseId(contactData) {
        const { caseId, ...updateFields } = contactData;

        return PatientContact.findOneAndUpdate(
            { caseId },
            { $set: updateFields },
            { new: true } // Return the updated document
        ).lean();
    }

    /**
     * Get patient details by caseId
     * @param {string} caseId - The case ID of the patient
     * @returns {Promise<Object|null>}
     */
    static async getPatientDetailsByCaseId(caseId) {
        return PatientDetails.findOne({ _id: caseId }).lean();
    }

    /**
     * Update patient details by caseId
     * @param {Object} patientData - The updated patient data
     * @returns {Promise<Object|null>}
     */
    static async updatePatientDetailsByCaseId(patientData) {
        const { caseId, ...updateFields } = patientData;

        return PatientDetails.findOneAndUpdate(
            { _id: caseId },
            { $set: updateFields },
            { new: true } // Return the updated document
        ).lean();
    }

    /**
     * Save patient assignment to the database
     * @param {Object} alignPatientDao - DAO object for patient assignment
     * @returns {Promise<void>}
     */
    static async alignPatient(assignPatientDao) {
        const assignPatient = new AlignPatientSchema(assignPatientDao);
        await assignPatient.save();
    }

    /**
     * Get list of align patients with status 0, populate doctor name and patient name
     * @returns {Promise<Array>}
     */
    static async getAlignPatientList() {
        return AlignPatientSchema.find({ status: 0 })
            .populate({
                path: "docId",
                select: "firstName lastName",
                model: "users"
            })
            .populate({
                path: "caseId",
                select: "firstName lastName",
                model: "patient_details"
            })
            .populate({
                path: "caseId",
                select: "phone1",
                model: "patient_contacts"
            })
            .lean();
    }

    /**
     * Change status of an align patient by _id
     * @param {string} alignPatientId
     * @param {number|string} status
     * @returns {Promise<Object|null>}
     */
    static async changeAlignPatientStatus(alignPatientId, status) {
        return AlignPatientSchema.findByIdAndUpdate(
            alignPatientId,
            { $set: { status } },
            { new: true }
        ).lean();
    }

}

module.exports = PatientRepo;
