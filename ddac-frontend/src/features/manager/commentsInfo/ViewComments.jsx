import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaStar, FaRegStar, FaUser, FaUserMd, FaUserTie, FaCalendarAlt, FaClock, FaCommentAlt, FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import {FaMessage} from "react-icons/fa6";
import {getCommentById} from "../../../services/commentManagementService.js";
import {GetAppointmentWithDetailsById} from "../../../services/appointmentManagementService.js";

export default function ViewComments() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [comment, setComment] = useState(null);
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCommentInfo();
    }, []);

    const getCommentInfo = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getCommentById(id);
            console.log('Fetched comment:', data);
            if (data && typeof data === 'object') {
                setComment(data);
                const appointmentId = data.appointmentId;
                try{
                    const appointmentData = await GetAppointmentWithDetailsById(appointmentId);
                    setAppointment(appointmentData);
                } catch (err) {
                    console.error(`Error fetching appointment information for ${appointmentId}:`, err);
                }
            } else {
                throw new Error('Comment not found or invalid data format.');
            }
        }
        catch (err) {
            console.error('Error fetching comment:', err);
            setError(err.message || 'Failed to fetch comment');
            setComment(null);
        } finally {
            setLoading(false);
        }
    }

    // Render star rating
    const renderStars = (rating, size = 20) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= rating ? (
                        <FaStar key={star} className="text-accent-warning" size={size} />
                    ) : (
                        <FaRegStar key={star} className="text-muted" size={size} />
                    )
                ))}
            </div>
        );
    };

    // Format date and time
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-MY', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const splitTags = (tags) => {
        if (!tags || typeof tags !== "string") {
            return [];
        }
        return tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            console.log('Delete comment:', id);
            // Call delete API
            // After successful deletion, navigate back
            navigate('/managerCommentsInfo');
        }
    };

    // Loading state
    if (loading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted">Loading comment...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    // Error state
    if (error) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <FaMessage size={64} className="text-accent-danger mx-auto mb-4" />
                        <h2 className="text-heading text-xl font-bold mb-2">Error Loading Comment</h2>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            onClick={getCommentInfo}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!comment) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <FaCommentAlt size={64} className="text-muted opacity-50 mx-auto mb-4" />
                        <p className="text-heading text-xl font-semibold">Review not found</p>
                        <button
                            onClick={() => navigate('/managerCommentsInfo')}
                            className="mt-4 btn-primary"
                        >
                            Back to Reviews
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Page Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-heading">Review Details</h1>
                        <p className="text-muted mt-1">View patient feedback and ratings</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-accent-danger text-white rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            <FaTrash size={16} />
                            <span>Delete Review</span>
                        </button>
                        <button
                            onClick={() => navigate('/managerCommentsInfo')}
                            className="flex items-center gap-2 px-4 py-2 text-muted hover:text-heading transition-colors"
                        >
                            <FaArrowLeft size={16} />
                            <span>Back to Reviews</span>
                        </button>
                    </div>
                </div>

                {/* Review ID & Timestamp Banner */}
                <div className="bg-primary bg-opacity-10 border border-primary rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <FaCommentAlt className="text-primary" size={24} />
                            <div>
                                <p className="text-sm text-ondark">Review ID</p>
                                <p className="text-2xl font-bold text-ondark">{comment.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-ondark">
                            <FaClock size={16} />
                            <span className="text-sm">Submitted: {formatDateTime(comment.time)}</span>
                        </div>
                    </div>
                </div>

                {/* Overall Rating Card */}
                <div className="bg-card rounded-xl shadow-soft p-8 border border-color mb-6">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-heading mb-4">Overall Rating</h2>
                        <div className="flex justify-center mb-2">
                            {renderStars(comment.overallRating, 32)}
                        </div>
                        <p className="text-4xl font-bold text-primary">{comment.overallRating}.0</p>
                        <p className="text-muted text-sm mt-1">out of 5 stars</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Doctor Rating Card */}
                    <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                <FaUserMd className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-heading">Doctor Rating</h2>
                                <p className="text-sm text-muted">Healthcare provider feedback</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-body">Rating:</span>
                                <div className="flex items-center gap-2">
                                    {renderStars(comment.doctorRating, 18)}
                                    <span className="text-lg font-bold text-heading ml-2">{comment.doctorRating}.0</span>
                                </div>
                            </div>
                            <div className="border-t border-color pt-4">
                                <p className="text-sm text-muted mb-2">Doctor Information:</p>
                                <p className="text-heading font-semibold">{`Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</p>
                                <p className="text-body text-sm">{appointment.doctor.specialization}</p>
                                <p className="text-muted text-xs mt-1">{comment.doctorId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Staff Rating Card */}
                    <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                <FaUserTie className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-heading">Staff Rating</h2>
                                <p className="text-sm text-muted">Support staff feedback</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-body">Rating:</span>
                                <div className="flex items-center gap-2">
                                    {renderStars(comment.staffRating, 18)}
                                    <span className="text-lg font-bold text-heading ml-2">{comment.staffRating}.0</span>
                                </div>
                            </div>
                            <div className="border-t border-color pt-4">
                                <p className="text-sm text-muted mb-2">Staff Information:</p>
                                <p className="text-heading font-semibold">{`${appointment.staff?.firstName} ${appointment.staff?.lastName}`}</p>
                                <p className="text-body text-sm">{appointment.staff?.role}</p>
                                <p className="text-muted text-xs mt-1">{comment.staffId}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient Comment & Tags Card */}
                <div className="bg-card rounded-xl shadow-soft p-6 border border-color mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                            <FaCommentAlt className="text-ondark" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-heading">Patient Comment</h2>
                            <p className="text-sm text-muted">Detailed feedback</p>
                        </div>
                    </div>

                    <div className="bg-main bg-opacity-50 rounded-lg p-6">
                        <p className="text-body leading-relaxed whitespace-pre-wrap">
                            {comment.commentText}
                        </p>
                    </div>

                    <div className="bg-main bg-opacity-50 rounded-lg p-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-body font-semibold whitespace-nowrap">
                                Tags:
                            </p>
    
                            {splitTags(comment.tags).map((tag, index) => (
                                <span
                                    key={index}
                                    className="
                                        bg-primary text-ondark
                                        px-3 py-1
                                        text-xs font-medium
                                        rounded-full
                                        whitespace-nowrap"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Patient & Appointment Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Patient Information Card */}
                    <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                <FaUser className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-heading">Patient Information</h2>
                                <p className="text-sm text-muted">Reviewer details</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-muted mb-1">Patient ID</p>
                                <p className="text-heading font-semibold">{comment.patientId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted mb-1">Full Name</p>
                                <p className="text-body">{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted mb-1">Email</p>
                                <p className="text-body">{appointment.patient.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted mb-1">Phone</p>
                                <p className="text-body">{appointment.patient.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Information Card */}
                    <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-accent-danger bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarAlt className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-heading">Appointment Details</h2>
                                <p className="text-sm text-muted">Related appointment</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-muted mb-1">Appointment ID</p>
                                <p className="text-heading font-semibold">{comment.appointmentId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted mb-1">Datee</p>
                                <p className="text-body flex items-center gap-2">
                                    <FaCalendarAlt className="text-muted" size={14} />
                                    {appointment.date}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted mb-1">Time</p>
                                <p className="text-body flex items-center gap-2">
                                    <FaClock className="text-muted" size={14} />
                                    {appointment.time}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={() => navigate('/managerCommentsInfo')}
                        className="btn-primary"
                    >
                        Back to All Reviews
                    </button>
                </div>
            </div>
        </Layout>
    );
}