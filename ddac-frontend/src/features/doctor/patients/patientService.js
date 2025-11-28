import api from '../../../services/api';

/**
 * Patient API Service
 * Handles all patient-related API calls for doctors
 */

// Mock doctor ID for testing
const MOCK_DOCTOR_ID = 'DR000001';

const patientService = {
    /**
     * Get all patients
     * GET /api/patients
     */
    getAllPatients: async () => {
        try {
            const response = await api.get('/patients');
            return response.data;
        } catch (error) {
            console.error('Error fetching patients:', error);
            throw error;
        }
    },

    /**
     * Get patient by ID
     * GET /api/patients/{id}
     * @param {string} id - Patient ID
     */
    getPatientById: async (id) => {
        try {
            const response = await api.get(`/patients/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching patient ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get patients for current doctor
     * Returns patients who have appointments with the current doctor
     */
    getDoctorPatients: async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found in localStorage');
            }

            // Get all appointments for the doctor
            const appointmentsResponse = await api.get('/appointments');
            const doctorAppointments = appointmentsResponse.data.filter(
                appointment => appointment.doctorId === userId
            );

            // Get unique patient IDs
            const patientIds = [...new Set(doctorAppointments.map(a => a.patientId))];

            // Fetch patient details
            const patientsResponse = await api.get('/patients');
            const doctorPatients = patientsResponse.data.filter(
                patient => patientIds.includes(patient.id)
            );

            return doctorPatients;
        } catch (error) {
            console.error('Error fetching doctor patients:', error);
            throw error;
        }
    },

    /**
     * Create new patient
     * POST /api/patients
     * @param {Object} patientData - Patient creation data
     * @param {string} patientData.firstName - First name (50 chars max)
     * @param {string} patientData.lastName - Last name (50 chars max)
     * @param {string} patientData.email - Email (50 chars max)
     * @param {string} patientData.phone - Phone number (15 chars max)
     * @param {string} patientData.dateOfBirth - Date of birth (DateOnly format: YYYY-MM-DD)
     * @param {string} patientData.gender - Gender (10 chars max)
     * @param {string} patientData.address - Address (250 chars max)
     * @param {string} [patientData.bloodGroup] - Blood group (optional, 20 chars max)
     * @param {string} [patientData.emergencyContact] - Emergency contact phone (optional, 15 chars max)
     * @param {string} [patientData.emergencyName] - Emergency contact name (optional, 50 chars max)
     * @param {string} [patientData.emergencyRelationship] - Emergency contact relationship (optional, 15 chars max)
     * @param {string} [patientData.allergies] - Allergies (optional, 256 chars max)
     * @param {string} [patientData.conditions] - Medical conditions (optional, 256 chars max)
     * @param {string} [patientData.medications] - Current medications (optional, 256 chars max)
     */
    createPatient: async (patientData) => {
        try {
            const response = await api.post('/patients', patientData);
            return response.data;
        } catch (error) {
            console.error('Error creating patient:', error);
            throw error;
        }
    },

    /**
     * Update patient
     * PUT /api/patients/{id}
     */
    updatePatient: async (id, patientData) => {
        try {
            const response = await api.put(`/patients/${id}`, patientData);
            return response.data;
        } catch (error) {
            console.error(`Error updating patient ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete patient
     * DELETE /api/patients/{id}
     */
    deletePatient: async (id) => {
        try {
            await api.delete(`/patients/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting patient ${id}:`, error);
            throw error;
        }
    },

    /**
     * Search patients by name, email, or ID
     * Client-side filtering
     */
    searchPatients: async (searchTerm) => {
        try {
            const patients = await patientService.getAllPatients();
            
            if (!searchTerm) return patients;

            const term = searchTerm.toLowerCase();
            return patients.filter(patient => 
                patient.firstName.toLowerCase().includes(term) ||
                patient.lastName.toLowerCase().includes(term) ||
                patient.email.toLowerCase().includes(term) ||
                patient.id.toLowerCase().includes(term) ||
                patient.phone.includes(searchTerm)
            );
        } catch (error) {
            console.error('Error searching patients:', error);
            throw error;
        }
    },

    /**
     * Get patient statistics
     */
    getPatientStats: async () => {
        try {
            const patients = await patientService.getDoctorPatients();
            
            return {
                total: patients.length,
                active: patients.length, // All fetched patients are considered active
                male: patients.filter(p => p.gender.toLowerCase() === 'male').length,
                female: patients.filter(p => p.gender.toLowerCase() === 'female').length,
            };
        } catch (error) {
            console.error('Error calculating patient stats:', error);
            throw error;
        }
    },
};

export default patientService;
