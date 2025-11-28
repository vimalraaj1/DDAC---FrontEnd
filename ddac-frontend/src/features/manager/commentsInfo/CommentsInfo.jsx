import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState } from 'react';
import { FaSearch, FaTrash, FaEye, FaStar, FaRegStar, FaCommentAlt, FaUserMd, FaUser, FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function CommentsInfo() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('all');
    const navigate = useNavigate();

    // Sample comments data (replace with API call later)
    const comments = [
        {
            id: 'CM000001',
            patientId: 'PT000001',
            patientName: 'Ahmad Ibrahim',
            doctorId: 'DR000001',
            doctorName: 'Dr. Sarah Wilson',
            staffId: 'ST000001',
            staffName: 'Alice Johnson',
            appointmentId: 'APT000001',
            comment: 'Excellent service! Dr. Wilson was very professional and attentive. The staff was friendly and helpful.',
            doctorRating: 5,
            staffRating: 5,
            overallRating: 5,
            time: '2024-11-20T14:30:00'
        },
        {
            id: 'CM000002',
            patientId: 'PT000002',
            patientName: 'Siti Abdullah',
            doctorId: 'DR000002',
            doctorName: 'Dr. Michael Chen',
            staffId: 'ST000002',
            staffName: 'Bob Martinez',
            appointmentId: 'APT000002',
            comment: 'Good experience overall. Doctor was knowledgeable but waiting time was a bit long.',
            doctorRating: 4,
            staffRating: 3,
            overallRating: 4,
            time: '2024-11-19T10:15:00'
        },
        {
            id: 'CM000003',
            patientId: 'PT000003',
            patientName: 'Raj Kumar',
            doctorId: 'DR000001',
            doctorName: 'Dr. Sarah Wilson',
            staffId: 'ST000001',
            staffName: 'Alice Johnson',
            appointmentId: 'APT000003',
            comment: 'Very satisfied with the cardiac screening. Dr. Wilson explained everything clearly.',
            doctorRating: 5,
            staffRating: 4,
            overallRating: 5,
            time: '2024-11-18T16:45:00'
        },
        {
            id: 'CM000004',
            patientId: 'PT000004',
            patientName: 'Mei Wong',
            doctorId: 'DR000003',
            doctorName: 'Dr. Emily Rodriguez',
            staffId: 'ST000003',
            staffName: 'Carol Lee',
            appointmentId: 'APT000004',
            comment: 'The consultation was okay, but I felt rushed. Staff was helpful though.',
            doctorRating: 3,
            staffRating: 4,
            overallRating: 3,
            time: '2024-11-17T11:20:00'
        },
        {
            id: 'CM000005',
            patientId: 'PT000005',
            patientName: 'Hassan Ali',
            doctorId: 'DR000004',
            doctorName: 'Dr. James Kumar',
            staffId: 'ST000004',
            staffName: 'David Kim',
            appointmentId: 'APT000005',
            comment: 'Outstanding care! Both doctor and staff exceeded my expectations. Highly recommend.',
            tags: 'Professional, Friendly, Great Service',
            doctorRating: 5,
            staffRating: 5,
            overallRating: 5,
            time: '2024-11-16T09:00:00'
        },
        {
            id: 'CM000006',
            patientId: 'PT000006',
            patientName: 'Lakshmi Devi',
            doctorId: 'DR000005',
            doctorName: 'Dr. Lisa Thompson',
            staffId: 'ST000005',
            staffName: 'Emma Wilson',
            appointmentId: 'APT000006',
            comment: 'Not satisfied with the service. Long wait and doctor seemed distracted.',
            doctorRating: 2,
            staffRating: 2,
            overallRating: 2,
            time: '2024-11-15T13:30:00'
        }
    ];

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
        const matchesSearch =
            comment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.comment.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRating = filterRating === 'all' ||
            comment.overallRating === parseInt(filterRating);

        return matchesSearch && matchesRating;
    });

    const handleView = (id) => {
        console.log('View comment:', id);
        navigate(`/managerViewComments/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
            console.log('Delete comment:', id);
            // Call delete API
        }
    };

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
                                                {comment.comment}
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