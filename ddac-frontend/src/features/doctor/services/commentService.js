import api from '../../../api/axios';

/**
 * Comment API Service
 * Handles all comment and rating-related API calls
 */

const commentService = {
    /**
     * Get all comments
     * GET /api/comments
     */
    getAllComments: async () => {
        try {
            const response = await api.get('/comments');
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    /**
     * Get comment by ID
     * GET /api/comments/{id}
     */
    getCommentById: async (id) => {
        try {
            const response = await api.get(`/comments/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching comment ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get comments for current doctor
     * Filters comments by doctor ID from localStorage
     * Excludes comments with null ratings (pending patient feedback)
     */
    getDoctorComments: async () => {
        try {
            const userId = localStorage.getItem('id');
            if (!userId) {
                throw new Error('User ID not found. Please log in again.');
            }
            
            console.log('Fetching comments for doctor:', userId);
            
            const [commentsResponse, patientsResponse] = await Promise.all([
                api.get('/comments'),
                api.get('/patients')
            ]);
            
            // Filter comments for current doctor and exclude null ratings
            const doctorComments = commentsResponse.data.filter(
                comment => comment.doctorId === userId && 
                           comment.doctorRating !== null
            );
            
            // Enrich comments with patient names
            const enrichedComments = doctorComments.map(comment => {
                const patient = patientsResponse.data.find(p => p.id === comment.patientId);
                return {
                    ...comment,
                    patientName: patient ? `${patient.firstName} ${patient.lastName}` : `Patient ${comment.patientId}`
                };
            });
            
            // Sort by time (most recent first)
            return enrichedComments.sort((a, b) => new Date(b.time) - new Date(a.time));
        } catch (error) {
            console.error('Error fetching doctor comments:', error);
            throw error;
        }
    },

    /**
     * Get comments for a specific appointment
     * GET /api/comments/appointment/{appointmentId}
     */
    getCommentsByAppointmentId: async (appointmentId) => {
        try {
            const response = await api.get(`/comments/appointment/${appointmentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching comments for appointment ${appointmentId}:`, error);
            throw error;
        }
    },

    /**
     * Create new comment
     * POST /api/comments
     */
    createComment: async (commentData) => {
        try {
            const response = await api.post('/comments', commentData);
            return response.data;
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    },

    /**
     * Update comment
     * PUT /api/comments/{id}
     */
    updateComment: async (id, commentData) => {
        try {
            const response = await api.put(`/comments/${id}`, commentData);
            return response.data;
        } catch (error) {
            console.error(`Error updating comment ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete comment
     * DELETE /api/comments/{id}
     */
    deleteComment: async (id) => {
        try {
            await api.delete(`/comments/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting comment ${id}:`, error);
            throw error;
        }
    },

    /**
     * Calculate average ratings for doctor
     */
    getDoctorRatingStats: async () => {
        try {
            const comments = await commentService.getDoctorComments();
            
            if (comments.length === 0) {
                return {
                    averageDoctorRating: 0,
                    averageOverallRating: 0,
                    totalComments: 0
                };
            }
            
            const totalDoctorRating = comments.reduce((sum, c) => sum + (c.doctorRating || 0), 0);
            const totalOverallRating = comments.reduce((sum, c) => sum + (c.overallRating || 0), 0);
            
            return {
                averageDoctorRating: (totalDoctorRating / comments.length).toFixed(1),
                averageOverallRating: (totalOverallRating / comments.length).toFixed(1),
                totalComments: comments.length
            };
        } catch (error) {
            console.error('Error calculating rating stats:', error);
            throw error;
        }
    },
};

export default commentService;
