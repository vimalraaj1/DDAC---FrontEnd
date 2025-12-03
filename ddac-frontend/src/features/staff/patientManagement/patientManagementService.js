import {
  getAllPatients,
  createPatient,
  getPatientById as getPatientRecordById,
  updatePatient as updatePatientRecord,
  deletePatient as deletePatientRecord,
} from "../services/patientService";

export const getPatients = getAllPatients;

export const registerPatient = createPatient;

export const getPatientById = getPatientRecordById;

export const updatePatient = updatePatientRecord;

export const deletePatient = deletePatientRecord;

