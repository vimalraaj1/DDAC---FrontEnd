import api from '../../../api/axios';

/**
 * Consultation API Service
 * Handles all consultation-related API calls
 */

const consultationService = {
    /**
     * Get all consultations
     * GET /api/consultations
     */
    getAllConsultations: async () => {
        try {
            const response = await api.get('/consultations');
            return response.data;
        } catch (error) {
            console.error('Error fetching consultations:', error);
            throw error;
        }
    },

    /**
     * Get consultation by ID
     * GET /api/consultations/{id}
     */
    getConsultationById: async (id) => {
        try {
            const response = await api.get(`/consultations/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching consultation ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get consultation by appointment ID
     * GET /api/consultations/appointment/{appointmentId}
     */
    getConsultationByAppointmentId: async (appointmentId) => {
        try {
            const response = await api.get(`/consultations/appointment/${appointmentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching consultation for appointment ${appointmentId}:`, error);
            throw error;
        }
    },

    /**
     * Create new consultation
     * POST /api/consultations
     * @param {Object} consultationData - Consultation creation data
     * @param {string} consultationData.appointmentId - Appointment ID (9 chars max)
     * @param {string} consultationData.feedbackNotes - Feedback notes
     * @param {string} consultationData.prescriptionNotes - Prescription notes (format: "MedicationName Dosage, frequency, duration | ...")
     */
    createConsultation: async (consultationData) => {
        try {
            const response = await api.post('/consultations', consultationData);
            return response.data;
        } catch (error) {
            console.error('Error creating consultation:', error);
            throw error;
        }
    },

    /**
     * Update consultation
     * PUT /api/consultations/{id}
     */
    updateConsultation: async (id, consultationData) => {
        try {
            const response = await api.put(`/consultations/${id}`, consultationData);
            return response.data;
        } catch (error) {
            console.error(`Error updating consultation ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete consultation
     * DELETE /api/consultations/{id}
     */
    deleteConsultation: async (id) => {
        try {
            await api.delete(`/consultations/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting consultation ${id}:`, error);
            throw error;
        }
    },
};

export default consultationService;
