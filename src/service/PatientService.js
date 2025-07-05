import PatientMapper from "../mapper/PatientMapper.js";
import PatientAddress from "../models/patient/PatientAddress.js";
import PatientContact from "../models/patient/PatientContact.js";
import PatientDetails from "../models/patient/PatientDetails.js";
import PatientRepo from "../repo/PatientRepo.js";
import { ServiceResponse } from "../utils/responseHandler.js";

export default class PatientService {
    /**
     * Creates a new patient with details, contact, and address
     * @param {Object} request - Patient data
     * @param {Object} authentication - Auth context containing userId
     * @returns {Promise<ServiceResponse>}
     */
    static async createPatientService(request, authentication) {
        try {
            const { userId } = authentication;
            let patientDetails;

            try {
                // Step 1: Save patient details
                patientDetails = PatientMapper.patientDetailsMapper(request, userId);
                await patientDetails.save();

                // Step 2: Save patient contact
                const patientContact = PatientMapper.patientContactMapper(
                    request,
                    patientDetails._id,
                    userId
                );
                await patientContact.save();

                // Step 3: Save patient address
                const patientAddress = PatientMapper.patientAddressMapper(
                    request,
                    patientDetails._id,
                    userId
                );
                await patientAddress.save();

                return new ServiceResponse(200, "Patient registered successfully", {
                    patientId: patientDetails._id,
                });
            } catch (error) {
                // Clean up any created records if something fails
                if (patientDetails && patientDetails?._id) {
                    await Promise.allSettled([
                        PatientDetails.deleteOne({ _id: patientDetails._id }),
                        PatientContact.deleteOne({ caseId: patientDetails._id }),
                        PatientAddress.deleteOne({ caseId: patientDetails._id }),
                    ]);
                }
                throw error; // Re-throw the error for the outer catch block
            }
        } catch (error) {
            console.error("Patient creation error:", error);

            if (error.name === "ValidationError") {
                return new ServiceResponse(400, "Validation failed", {
                    errors: error.errors,
                });
            }

            if (error.code === 11000) {
                return new ServiceResponse(409, "Patient already exists");
            }

            return new ServiceResponse(500, "Failed to register patient");
        }
    }

    /**
     * Search patients by either caseId or phone number
     * @param {string} searchType - 'caseId' or 'phone'
     * @param {string} searchValue - The value to search for
     * @returns {Promise<ServiceResponse>}
     */
    static async searchPatientService(searchValue) {
        try {
            const patientData = await PatientRepo.findByPhone(searchValue);

            if (!patientData.length) {
                return new ServiceResponse(404, "No patients found");
            }

            return new ServiceResponse(
                200,
                null,
                patientData
            );
        } catch (error) {
            console.error("Search patient error:", error);
            return new ServiceResponse(500, "Failed to search patients");
        }
    }

    /**
     * Validate patient by caseId
     * @param {string} caseId - The case ID of the patient
     * @returns {Promise<ServiceResponse>}
     */
    static async validatePatientService(caseId) {
        try {
            const validatePatient = await PatientRepo.validatePatientById(caseId);

            if (!validatePatient) {
                return new ServiceResponse(404, "Patient not found");
            }

            return new ServiceResponse(200, null, validatePatient);
        } catch (error) {
            console.error("Validate patient error:", error);
            return new ServiceResponse(500, "Failed to validate patient");
        }
    }


    /**
    * Assign a patient to a doctor
    * @param {Object} assignPatientDTO - Data transfer object for assigning a patient
    * @param {Object} authentication - Auth context containing userId
    * @returns {Promise<ServiceResponse>}
    */
    static async alignToDocService(alignPatientDTO, authentication) {
        try {
            const { userId } = authentication;

            // Map DTO to DAO
            const assignPatientDao = PatientMapper.alignPatientMapper(
                alignPatientDTO,
                userId
            );

            // Save the assignment in the database
            await PatientRepo.alignPatient(assignPatientDao);

            return new ServiceResponse(200, "Patient assigned successfully", null);
        } catch (error) {
            console.error("Error assigning patient:", error);
            return new ServiceResponse(500, "Failed to assign patient");
        }
    }

    /**
   * Get list of align patients with status 0
   * @returns {Promise<ServiceResponse>}
   */
    static async getAlignPatientListService() {
        try {
            const alignPatients = await PatientRepo.getAlignPatientList();

            // Format the result to include patientName, doctorName, and status as "pending" if 0
            const formatted = alignPatients.map(item => ({
                ...item,
                caseId: item.caseId?._id || item.caseId, // keep caseId as separate field
               
                status: item.status === 0 ? "pending" : item.status , // map 0 to "pending",
                docId: item.docId?._id || item.docId,
            }));

            return new ServiceResponse(200, null, formatted);
        } catch (error) {
            console.error("Error fetching align patient list:", error);
            return new ServiceResponse(500, "Failed to fetch align patient list");
        }
    }

    /**
     * Change status of an align patient
     * @param {string} alignPatientId
     * @param {number|string} status
     * @returns {Promise<ServiceResponse>}
     */
    static async changeAlignPatientStatusService(alignPatientId, status) {
        try {
            const updated = await PatientRepo.changeAlignPatientStatus(alignPatientId, status);
            if (!updated) {
                return new ServiceResponse(404, "Align patient not found");
            }
            return new ServiceResponse(200, "Status updated successfully", updated);
        } catch (error) {
            console.error("Error updating align patient status:", error);
            return new ServiceResponse(500, "Failed to update status");
        }
    }

}
