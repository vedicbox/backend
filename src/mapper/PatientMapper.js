// services/patientService.js
import PatientAddress from "../models/patient/PatientAddress.js";
import PatientContact from "../models/patient/PatientContact.js";
import PatientDetails from "../models/patient/PatientDetails.js";

class PatientMapper {

    static patientDetailsMapper(request, userId) {
        return new PatientDetails({
            firstName: request.firstName,
            lastName: request.lastName,
            dob: request.dob,
            gender: request.gender,
            height: request.height,
            weight: request.weight,
            age: request.age,
            maritalStatus: request.maritalStatus,
            createId: userId,
        });
    }

    static patientContactMapper(request, caseId, userId) {
        return new PatientContact({
            caseId,
            phone1: request.phone1,
            phone2: request.phone2,
            whatsappPref: request.whatsappNo,
            email: request.email,
            createId: userId,
        });
    }

    static patientAddressMapper(request, caseId, userId) {
        return new PatientAddress({
            caseId,
            addr1: request.addr1,
            addr2: request.addr2,
            state: request.state,
            city: request.city,
            pincode: request.pincode,
            country: request.country,
            createId: userId,
        });
    }

    /**
     * Map alignPatientDto to DAO
     * @param {Object} alignPatientDto - Data transfer object
     * @param {string} userId - ID of the user creating the assignment
     * @returns {Object} - DAO object
     */
    static alignPatientMapper(alignPatientDto, userId) {
        return {
            caseId: alignPatientDto.caseId,
            docId: alignPatientDto.docId,
            fee: alignPatientDto.fee,
            payTag: alignPatientDto.payTag,
            transId: alignPatientDto.transId,
            createId: userId,
        };
    }

}

export default PatientMapper;
