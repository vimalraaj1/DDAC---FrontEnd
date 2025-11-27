import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaStar, FaRegStar, FaUser, FaUserMd, FaUserTie, FaCalendarAlt, FaClock, FaCommentAlt, FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

export default function ViewComments() {
    const navigate = useNavigate();
    const { id } = useParams(); 

    const [commentData, setCommentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch comment data on component mount
    useEffect(() => {
        fetchCommentData();
    }, [id]);

    const fetchCommentData = async () => {
        try {
            setIsLoading(true);

            // Simulate API call - Replace with your actual API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data - Replace with actual API response
            const mockData = {
                id: 'CM000001',
                patientId: 'PT000001',
                patientName: 'Ahmad Ibrahim',
                patientEmail: 'ahmad.ibrahim@email.com',
                patientPhone: '+60 12-345 6789',
                doctorId: 'DR000001',
                doctorName: 'Dr. Sarah Wilson',
                doctorSpecialization: 'Cardiology',
                staffId: 'ST000001',
                staffName: 'Alice Johnson',
                staffRole: 'Nurse',
                appointmentId: 'APT000001',
                appointmentDate: '2024-11-20',
                appointmentTime: '09:00',
                comment: 'Excellent service! Dr. Wilson was very professional and attentive to my concerns. She took the time to explain my condition in detail and answered all my questions patiently. The staff was also very friendly and helpful throughout my visit. The clinic was clean and well-organized. I highly recommend this hospital for cardiac care. Overall, it was a wonderful experience and I felt well taken care of.',
                tags: 'Professional, Friendly, Great Service',
                doctorRating: 5,
                staffRating: 5,
                overallRating: 5,
                time: '2024-11-20T14:30:00'
            };

            setCommentData(mockData);
        } catch (error) {
            console.error('Error fetching comment data:', error);
            alert('Failed to load comment data. Please try again.');
            navigate('/managerCommentsInfo');
        } finally {
            setIsLoading(false);
        }
    };

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
    if (isLoading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-muted text-lg">Loading profile...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!commentData) {
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
                                <p className="text-2xl font-bold text-ondark">{commentData.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-ondark">
                            <FaClock size={16} />
                            <span className="text-sm">Submitted: {formatDateTime(commentData.time)}</span>
                        </div>
                    </div>
                </div>

                {/* Overall Rating Card */}
                <div className="bg-card rounded-xl shadow-soft p-8 border border-color mb-6">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-heading mb-4">Overall Rating</h2>
                        <div className="flex justify-center mb-2">
                            {renderStars(commentData.overallRating, 32)}
                        </div>
                        <p className="text-4xl font-bold text-primary">{commentData.overallRating}.0</p>
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
                                    {renderStars(commentData.doctorRating, 18)}
                                    <span className="text-lg font-bold text-heading ml-2">{commentData.doctorRating}.0</span>
                                </div>
                            </div>
                            <div className="border-t border-color pt-4">
                                <p className="text-sm text-muted mb-2">Doctor Information:</p>
                                <p className="text-heading font-semibold">{commentData.doctorName}</p>
                                <p className="text-body text-sm">{commentData.doctorSpecialization}</p>
                                <p className="text-muted text-xs mt-1">{commentData.doctorId}</p>
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
                                    {renderStars(commentData.staffRating, 18)}
                                    <span className="text-lg font-bold text-heading ml-2">{commentData.staffRating}.0</span>
                                </div>
                            </div>
                            <div className="border-t border-color pt-4">
                                <p className="text-sm text-muted mb-2">Staff Information:</p>
                                <p className="text-heading font-semibold">{commentData.staffName}</p>
                                <p className="text-body text-sm">{commentData.staffRole}</p>
                                <p className="text-muted text-xs mt-1">{commentData.staffId}</p>
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
                            {commentData.comment}
                        </p>
                    </div>

                    <div className="bg-main bg-opacity-50 rounded-lg p-6">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-body font-semibold whitespace-nowrap">
                                Tags:
                            </p>
    
                            {splitTags(commentData.tags).map((tag, index) => (
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
                                <p className="text-heading font-semibold">{commentData.patientId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted mb-1">Full Name</p>
                                <p className="text-body">{commentData.patientName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted mb-1">Email</p>
                                <p className="text-body">{commentData.patientEmail}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted mb-1">Phone</p>
                                <p className="text-body">{commentData.patientPhone}</p>
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
                                <p className="text-heading font-semibold">{commentData.appointmentId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted mb-1">Date</p>
                                <p className="text-body flex items-center gap-2">
                                    <FaCalendarAlt className="text-muted" size={14} />
                                    {formatDate(commentData.appointmentDate)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted mb-1">Time</p>
                                <p className="text-body flex items-center gap-2">
                                    <FaClock className="text-muted" size={14} />
                                    {formatTime(commentData.appointmentTime)}
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