import patientService from "../service/PatientService.js";
import { HttpHandler } from "../utils/responseHandler.js";

export default class PatientController {
    static async createPatient(req, res) {
        const patientRequestDTO = req.body;
        const authentication = req.auth;

        const response = await patientService.createPatientService(
            patientRequestDTO,
            authentication
        );

        return HttpHandler.send(res, response);
    }

    /**
 * Search patients
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
    static async searchPatient(req, res) {
        const { searchVal } = req.query;

        if (!searchVal) {
            return HttpHandler.error(
                res,
                "searchValue are required",
                400
            );
        }

        const response = await patientService.searchPatientService(
            searchVal
        );
        return HttpHandler.send(res, response);
    }

    /**
 * Validate patient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
    static async validatePatient(req, res) {
        const { caseId } = req.query;

        if (!caseId) {
            return HttpHandler.error(res, "caseId is required", 400);
        }

        const response = await patientService.validatePatientService(caseId);
        return HttpHandler.send(res, response);
    }

    /**
     * Assign patient to doctor
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async alignPatient(req, res) {
        const alignPatientDTO = req.body; // Extract the request body
        const authentication = req.auth; // Extract authentication context

        // Call the service layer
        const response = await patientService.alignToDocService(
            alignPatientDTO,
            authentication
        );

        // Send the response using the existing HttpHandler
        return HttpHandler.send(res, response);
    }


    /**
     * Get list of align patients with status 0
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async alignPatientList(req, res) {
        const response = await patientService.getAlignPatientListService();
        return HttpHandler.send(res, response);
    }

    /**
     * Change status of an align patient
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async changeStatus(req, res) {
        const { alignPatientId, status } = req.body;
        if (!alignPatientId || typeof status === "undefined") {
            return HttpHandler.error(res, "alignPatientId and status are required", 400);
        }
        const response = await patientService.changeAlignPatientStatusService(alignPatientId, status);
        return HttpHandler.send(res, response);
    }

}
