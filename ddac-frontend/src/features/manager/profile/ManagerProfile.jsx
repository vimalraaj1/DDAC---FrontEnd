import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState, useEffect } from 'react';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCalendar,
    FaMapMarkerAlt,
    FaBriefcase,
    FaEdit,
    FaIdCard,
    FaMoneyBillWave,
    FaClock,
    FaCheckCircle,
    FaUserCircle, FaLock, FaQuestionCircle
} from 'react-icons/fa';
import {useNavigate, useParams} from 'react-router-dom';
import {getManagerById} from "../../../services/managerManagementService.js";
import { useManager } from '../ManagerProvider.jsx';
import ChangePasswordModal from './ChangePasswordModal.jsx';

export default function ManagerProfile() {
    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const navigate = useNavigate();
    const { manager, loading: contextLoading } = useManager();

    useEffect(() => {
        if (contextLoading) {
            return;
        }
        if (!manager) {
            setError('Authentication failed. Please log in again.');
            setLoading(false);
            return;
        }
        getProfileInfo(manager.id);
    }, [manager, contextLoading]);

    const getProfileInfo = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const data = await getManagerById(id);
            console.log('Fetched profile info:', data);
            if (data && typeof data === 'object') {
                setProfile(data);
            } else {
                throw new Error('Manager profile not found or invalid data format.');
            }
        }
        catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.message || 'Failed to fetch profile');
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Calculate tenure (years with company)
    const calculateTenure = (joiningDate) => {
        const joinDate = new Date(joiningDate);
        const today = new Date();
        let years = today.getFullYear() - joinDate.getFullYear();
        const monthDiff = today.getMonth() - joinDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < joinDate.getDate())) {
            years--;
        }
        return years;
    };

    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get status color and text
    const getStatusDisplay = (status) => {
        if (!status || String(status).trim() === '') {
            return {
                color: 'bg-btn-secondary bg-opacity-50 text-text-body',
                text: 'N/A',
                icon: <FaQuestionCircle />
            };
        }
        switch(status.toLowerCase()) {
            case 'active':
                return {
                    color: 'bg-accent-success bg-opacity-10 text-ondark',
                    text: 'Active',
                    icon: <FaCheckCircle />
                };
            case 'on leave':
                return {
                    color: 'bg-accent-warning bg-opacity-10 text-ondark',
                    text: 'On Leave',
                    icon: <FaClock />
                };
            default:
                return {
                    color: 'bg-primary bg-opacity-10 text-ondark',
                    text: status,
                    icon: <FaCheckCircle />
                };
        }
    };

    const handleEditProfile = (id) => {
        navigate(`/managerEditProfile/${id}`);
    };
    const handlePasswordChangeSuccess = () => {
        setIsPasswordModalOpen(false); 
    }

    // Loading state
    if (contextLoading || loading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted">Loading profile...</p>
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
                        <FaUserCircle size={64} className="text-accent-danger mx-auto mb-4" />
                        <h2 className="text-heading text-xl font-bold mb-2">Error Loading Profile</h2>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            onClick={getProfileInfo}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!profile) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <FaUser size={64} className="text-muted opacity-50 mx-auto mb-4" />
                        <p className="text-heading text-xl font-semibold">Profile not found</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const statusDisplay = getStatusDisplay(profile.status);
    const tenure = calculateTenure(profile.joiningDate);

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Page Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-heading">My Profile</h1>
                        <p className="text-muted mt-1">View and manage your personal information</p>
                    </div>
                    <div className="flex items-center justify end gap-3">
                        {manager && (
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-ondark rounded-lg font-medium hover:bg-primary-hover transition-colors"
                    >
                        <FaLock size={18} />
                        <span>Change Password</span>
                    </button>
                        )}
                    <button
                        onClick={() => handleEditProfile(profile.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-ondark rounded-lg font-medium hover:bg-primary-hover transition-colors"
                    >
                        <FaEdit size={18} />
                        <span>Edit Profile</span>
                    </button>
                    </div>
                </div>

                {/* Profile Header Card */}
                <div className="bg-gradient-to-r from-primary to-primary-hover rounded-xl shadow-soft p-8 mb-6 text-ondark">
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-primary text-ondark flex items-center justify-center text-3xl font-bold flex-shrink-0">
                            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-2 text-primary">
                                {profile.firstName} {profile.lastName}
                            </h2>
                            <p className="text-xl mb-3 opacity-90 text-primary">{profile.position}</p>
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2 text-primary">
                                    <FaIdCard size={16} />
                                    <span className="text-sm font-medium">{profile.id}</span>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusDisplay.color.replace('text-', 'text-ondark ')}`}>
                                    {statusDisplay.icon}
                                    <span className="text-sm font-semibold">{statusDisplay.text}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden lg:flex gap-6">
                            <div className="text-center text-primary">
                                <p className="text-3xl font-bold">{tenure}</p>
                                <p className="text-sm opacity-80">Years Here</p>
                            </div>
                            <div className="text-center text-primary">
                                <p className="text-3xl font-bold">{profile.yearsOfExperience}</p>
                                <p className="text-sm opacity-80">Total Experience</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information Card */}
                <div className="bg-card rounded-xl shadow-soft p-6 border border-color mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                            <FaUser className="text-ondark" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-heading">Personal Information</h2>
                            <p className="text-sm text-muted">Basic details and contact information</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Email */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaEnvelope size={12} />
                                Email Address
                            </p>
                            <p className="text-body font-medium">{profile.email}</p>
                        </div>

                        {/* Phone */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaPhone size={12} />
                                Phone Number
                            </p>
                            <p className="text-body font-medium">{profile.phone}</p>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaCalendar size={12} />
                                Date of Birth
                            </p>
                            <p className="text-body font-medium">
                                {formatDate(profile.dateOfBirth)} ({calculateAge(profile.dateOfBirth)} years)
                            </p>
                        </div>

                        {/* Gender */}
                        <div>
                            <p className="text-xs text-muted mb-2">Gender</p>
                            <p className="text-body font-medium capitalize">{profile.gender}</p>
                        </div>

                        {/* Blood Group */}
                        <div>
                            <p className="text-xs text-muted mb-2">Blood Group</p>
                            <p className="text-body font-medium">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-danger bg-opacity-10 text-ondark font-semibold">
                                    {profile.bloodGroup}
                                </span>
                            </p>
                        </div>

                        {/* Emergency Contact */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaPhone size={12} />
                                Emergency Contact
                            </p>
                            <p className="text-body font-medium">{profile.emergencyContact}</p>
                        </div>
                    </div>

                    {/* Address - Full Width */}
                    <div className="mt-6 pt-6 border-t border-color">
                        <p className="text-xs text-muted mb-2 flex items-center gap-2">
                            <FaMapMarkerAlt size={12} />
                            Residential Address
                        </p>
                        <p className="text-body font-medium">{profile.address}</p>
                    </div>
                </div>

                {/* Professional Information Card */}
                <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                            <FaBriefcase className="text-ondark" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-heading">Professional Information</h2>
                            <p className="text-sm text-muted">Employment details and credentials</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Position */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaBriefcase size={12} />
                                Position
                            </p>
                            <p className="text-body font-medium">{profile.position}</p>
                        </div>

                        {/* Joining Date */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaCalendar size={12} />
                                Joining Date
                            </p>
                            <p className="text-body font-medium">
                                {formatDate(profile.joiningDate)} ({tenure} years)
                            </p>
                        </div>

                        {/* Years of Experience */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaClock size={12} />
                                Total Experience
                            </p>
                            <p className="text-body font-medium">{profile.yearsOfExperience} years</p>
                        </div>

                        {/* Salary */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaMoneyBillWave size={12} />
                                Monthly Salary
                            </p>
                            <p className="text-body font-medium">RM {profile.salary.toLocaleString('en-MY', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}</p>
                        </div>

                        {/* Status */}
                        <div>
                            <p className="text-xs text-muted mb-2">Employment Status</p>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusDisplay.color} font-semibold`}>
                                {statusDisplay.icon}
                                <span className="text-ondark">{statusDisplay.text}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isPasswordModalOpen && manager && (
                <ChangePasswordModal
                    id={manager.id}
                    onClose={() => setIsPasswordModalOpen(false)}
                    onSuccess={handlePasswordChangeSuccess}
                />
            )}
        </Layout>
    );
}