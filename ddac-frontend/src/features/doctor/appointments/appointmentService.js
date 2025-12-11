import api from '../../../api/axios';

/**
 * Appointment API Service for Doctors
 * Handles all appointment-related API calls
 */

const appointmentService = {
    /**
     * Get all appointments
     * GET /api/appointments
     */
    getAllAppointments: async () => {
        try {
            const response = await api.get('/appointments');
            return response.data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    },

    /**
     * Get appointments for current doctor
     * Filters appointments by doctor ID from localStorage
     */
    getDoctorAppointments: async () => {
        try {
            const userId = localStorage.getItem('id');
            if (!userId) {
                throw new Error('User ID not found. Please log in again.');
            }
            
            console.log('Fetching appointments for doctor:', userId);
            
            const response = await api.get('/appointments');
            // Filter appointments for current doctor
            const doctorAppointments = response.data.filter(
                appointment => appointment.doctorId === userId
            );
            return doctorAppointments;
        } catch (error) {
            console.error('Error fetching doctor appointments:', error);
            throw error;
        }
    },

    /**
     * Get appointment by ID
     * GET /api/appointments/{id}
     */
    getAppointmentById: async (id) => {
        try {
            const response = await api.get(`/appointments/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching appointment ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get appointments with doctor details for a patient
     * GET /api/appointments/patient/{patientId}/appointments
     */
    getAppointmentWithDoctor: async (patientId) => {
        try {
            const response = await api.get(`/appointments/patient/${patientId}/appointments`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching appointments for patient ${patientId}:`, error);
            throw error;
        }
    },

    /**
     * Create new appointment
     * POST /api/appointments
     * @param {Object} appointmentData - Appointment creation data
     * @param {string} appointmentData.date - Appointment date (DateOnly format: YYYY-MM-DD)
     * @param {string} appointmentData.time - Appointment time
     * @param {string} appointmentData.status - Status (e.g., "Scheduled", "Approved")
     * @param {string} appointmentData.patientId - Patient ID (8 chars max)
     * @param {string} appointmentData.doctorId - Doctor ID (8 chars max)
     * @param {string} appointmentData.staffId - Staff ID (8 chars max)
     * @param {string} appointmentData.purpose - Purpose of appointment (200 chars max)
     * @param {string} [appointmentData.cancellationReason] - Cancellation reason (optional, 200 chars max)
     */
    createAppointment: async (appointmentData) => {
        try {
            const response = await api.post('/appointments', appointmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    /**
     * Update appointment
     * PUT /api/appointments/{id}
     */
    updateAppointment: async (id, appointmentData) => {
        try {
            const response = await api.put(`/appointments/${id}`, appointmentData);
            return response.data;
        } catch (error) {
            console.error(`Error updating appointment ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete appointment
     * DELETE /api/appointments/{id}
     */
    deleteAppointment: async (id) => {
        try {
            await api.delete(`/appointments/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting appointment ${id}:`, error);
            throw error;
        }
    },

    /**
     * Approve appointment
     * PATCH /api/appointments/{id}/approve
     */
    approveAppointment: async (id) => {
        try {
            const response = await api.patch(`/appointments/${id}/approve`);
            return response.data;
        } catch (error) {
            console.error(`Error approving appointment ${id}:`, error);
            throw error;
        }
    },

    /**
     * Reject appointment
     * PATCH /api/appointments/{id}/reject
     * @param {string} id - Appointment ID
     * @param {string} reason - Rejection reason
     */
    rejectAppointment: async (id, reason) => {
        try {
            const response = await api.patch(`/appointments/${id}/reject`, JSON.stringify(reason), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error rejecting appointment ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get appointment statistics for doctor dashboard
     */
    getAppointmentStats: async () => {
        try {
            const appointments = await appointmentService.getDoctorAppointments();
            
            const today = new Date().toISOString().split('T')[0];
            
            return {
                total: appointments.length,
                scheduled: appointments.filter(a => a.status === 'Approved' || a.status === 'Confirmed').length,
                completed: appointments.filter(a => a.status === 'Completed').length,
                cancelled: appointments.filter(a => a.status === 'Cancelled').length,
                today: appointments.filter(a => a.date === today).length,
            };
        } catch (error) {
            console.error('Error calculating appointment stats:', error);
            throw error;
        }
    },
};

export default appointmentService;
