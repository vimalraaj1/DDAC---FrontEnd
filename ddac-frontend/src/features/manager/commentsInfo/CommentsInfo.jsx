import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import {useEffect, useState} from 'react';
import { FaSearch, FaTrash, FaEye, FaStar, FaRegStar, FaCommentAlt, FaUserMd, FaUser, FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {FaMessage} from "react-icons/fa6";
import {deleteDoctor, getDoctors} from "../../../services/doctorManagementService.js";
import {CountNumberOfUniquePatientsByDoctorId} from "../../../services/appointmentManagementService.js";
import {deleteComment, getComments} from "../../../services/commentManagementService.js";
import {toast} from "sonner";

export default function CommentsInfo() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('all');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch doctors on component mount
    useEffect(() => {
        getCommentsInfo();
    }, []);

    const getCommentsInfo = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getComments();
            console.log('Fetched comments:', data);
            if (Array.isArray(data)) {
                setComments(data);
            } else {
                throw new Error('Invalid response format');
            }
        }
        catch (err) {
            console.error('Error fetching comments:', err);
            setError(err.message || 'Failed to fetch comments');
            setComments([]);
        } finally {
            setLoading(false);
        }
    }

    // Format date and time
    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render star rating
    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= rating ? (
                        <FaStar key={star} className="text-accent-warning" size={16} />
                    ) : (
                        <FaRegStar key={star} className="text-muted" size={16} />
                    )
                ))}
            </div>
        );
    };

    // Get average rating
    const getAverageRating = () => {
        if (comments.length === 0) return 0;
        const sum = comments.reduce((acc, comment) => acc + comment.overallRating, 0);
        return (sum / comments.length).toFixed(1);
    };

    // Get rating distribution
    const getRatingCounts = () => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        comments.forEach(comment => {
            counts[comment.overallRating] = (counts[comment.overallRating] || 0) + 1;
        });
        return counts;
    };

    // Filter comments
    const filteredComments = comments.filter(comment => {
        const idString = String(comment.id ?? '');
        const doctorIdString = String(comment.doctorId ?? '');
        const patientIdString = String(comment.patientId ?? '');
        const commentTextString = comment.commentText?.toLowerCase() ?? '';
        
        const matchesSearch =
            idString.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctorIdString.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patientIdString.toLowerCase().includes(searchTerm.toLowerCase()) ||
            commentTextString.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRating = filterRating === 'all' ||
            comment.overallRating === parseInt(filterRating) || 
            comment.doctorRating === parseInt(filterRating) ||
            comment.staffRating === parseInt(filterRating);

        return matchesSearch && matchesRating;
    });

    const handleView = (id) => {
        console.log('View comment:', id);
        navigate(`/managerViewComments/${id}`);
    };

    const handleDelete = (id) => {
        toast.warning('Are you sure you want to delete this comment?', {
            closeButton: true,
            action: {
                label: 'Yes, delete',
                onClick: async () => {
                    try {
                        await deleteComment(id);
                        console.log('Delete comment successful:', id);
                        toast.success('Comment record deleted successfully');
                        try {
                            await getCommentsInfo();
                        } catch (refreshErr) {
                            console.error('Error refreshing comment list:', refreshErr);
                        }
                    } catch (err) {
                        console.error('Error deleting comment:', err);
                        toast.error('Failed to delete comment');
                    }
                }
            },
            duration: 15000
        });
    };

    // Loading state
    if (loading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted">Loading comments...</p>
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
                        <h2 className="text-heading text-xl font-bold mb-2">Error Loading Comments</h2>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            onClick={getCommentsInfo}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const ratingCounts = getRatingCounts();

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-heading">Patient Feedback & Reviews</h1>
                    <p className="text-muted mt-1">View and manage patient comments and ratings</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaCommentAlt size={24} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{comments.length}</h3>
                                <p className="text-muted text-sm">Total Reviews</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                <FaStar size={24} className="text-accent-warning" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{getAverageRating()}</h3>
                                <p className="text-muted text-sm">Average Rating</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                <FaStar size={24} className="text-accent-success" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{ratingCounts[5]}</h3>
                                <p className="text-muted text-sm">5-Star Reviews</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-danger bg-opacity-10 p-3 rounded-lg">
                                <FaStar size={24} className="text-accent-danger" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">
                                    {ratingCounts[1] + ratingCounts[2]}
                                </h3>
                                <p className="text-muted text-sm">Low Ratings (1-2⭐)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-card rounded-xl shadow-soft p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 min-w-0 w-full">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by ID, patient, doctor, or comment..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg
                                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                             text-body placeholder-muted"
                                />
                            </div>
                        </div>

                        {/* Filter */}
                        <div className="flex gap-4 flex-shrink-0">
                            <select
                                value={filterRating}
                                onChange={(e) => setFilterRating(e.target.value)}
                                className="px-4 py-2 border border-input rounded-lg
                                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                         text-body bg-card"
                            >
                                <option value="all">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Comments Table */}
                <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full table-fixed">
                            <thead className="bg-primary border-b border-color">
                            <tr>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm w-32 text-ondark">
                                    Review ID
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm text-ondark">
                                    Patient
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm hidden lg:table-cell text-ondark">
                                    Doctor
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm text-ondark">
                                    Comment
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm text-ondark">
                                    Ratings
                                </th>
                                <th className="text-center py-4 px-6 text-ondark font-semibold text-sm text-ondark">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredComments.length > 0 ? (
                                filteredComments.map((comment, index) => (
                                    <tr
                                        key={comment.id}
                                        className={`hover:bg-main border-t border-color transition-colors ${
                                            index % 2 === 0 ? '' : 'bg-main bg-opacity-30'
                                        }`}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-heading text-sm font-bold">{comment.id}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-heading font-medium text-sm flex items-center gap-1">
                                                    {comment.patientName}
                                                </p>
                                                <p className="text-muted text-xs">{comment.patientId}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden lg:table-cell">
                                            <div>
                                                <p className="text-heading font-medium text-sm flex items-center gap-1">
                                                    {comment.doctorName}
                                                </p>
                                                <p className="text-muted text-xs">{comment.doctorId}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-body text-sm break-all">
                                                {comment.commentText}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted w-16">Overall:</span>
                                                    {renderStars(comment.overallRating)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted w-16">Doctor:</span>
                                                    {renderStars(comment.doctorRating)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted w-16">Staff:</span>
                                                    {renderStars(comment.staffRating)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2 overflow-x-hidden lg:overflow-x-visible">
                                                <button
                                                    onClick={() => handleView(comment.id)}
                                                    className="p-2 hover:bg-accent-sky hover:bg-opacity-10 rounded-lg
                                                                 text-accent-sky transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye size={22} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
                                                    className="p-2 hover:bg-accent-danger hover:bg-opacity-10 rounded-lg
                                                                 text-accent-danger transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash size={22} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <FaCommentAlt size={48} className="text-muted opacity-50" />
                                            <p className="text-muted text-lg">No reviews found</p>
                                            <p className="text-muted text-sm">Try adjusting your search or filter</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-muted text-sm">
                        Showing <span className="font-semibold text-heading">{filteredComments.length}</span> of{' '}
                        <span className="font-semibold text-heading">{comments.length}</span> reviews
                    </p>
                </div>
            </div>
        </Layout>
    );
}