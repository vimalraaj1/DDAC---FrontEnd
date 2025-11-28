import api from '../../../services/api';

/**
 * Doctor API Service
 * Handles all doctor-related API calls
 */

const doctorService = {
    /**
     * Get all doctors
     * GET /api/doctors
     */
    getAllDoctors: async () => {
        try {
            const response = await api.get('/doctors');
            return response.data;
        } catch (error) {
            console.error('Error fetching doctors:', error);
            throw error;
        }
    },

    /**
     * Get doctor by ID
     * GET /api/doctors/{id}
     */
    getDoctorById: async (id) => {
        try {
            const response = await api.get(`/doctors/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching doctor ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get current doctor profile
     * Uses userId from localStorage
     */
    getCurrentDoctorProfile: async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found in localStorage');
            }
            const response = await api.get(`/doctors/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching current doctor profile:', error);
            throw error;
        }
    },

    /**
     * Create new doctor
     * POST /api/doctors
     */
    createDoctor: async (doctorData) => {
        try {
            const response = await api.post('/doctors', doctorData);
            return response.data;
        } catch (error) {
            console.error('Error creating doctor:', error);
            throw error;
        }
    },

    /**
     * Update doctor profile
     * PUT /api/doctors/{id}
     */
    updateDoctor: async (id, doctorData) => {
        try {
            const response = await api.put(`/doctors/${id}`, doctorData);
            return response.data;
        } catch (error) {
            console.error(`Error updating doctor ${id}:`, error);
            throw error;
        }
    },

    /**
     * Update current doctor profile
     * Uses userId from localStorage
     */
    updateCurrentDoctorProfile: async (doctorData) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User ID not found in localStorage');
            }
            const response = await api.put(`/doctors/${userId}`, doctorData);
            return response.data;
        } catch (error) {
            console.error('Error updating current doctor profile:', error);
            throw error;
        }
    },

    /**
     * Delete doctor
     * DELETE /api/doctors/{id}
     */
    deleteDoctor: async (id) => {
        try {
            await api.delete(`/doctors/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting doctor ${id}:`, error);
            throw error;
        }
    },
};

export default doctorService;
