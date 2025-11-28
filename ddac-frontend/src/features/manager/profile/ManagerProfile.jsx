import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaBriefcase, FaEdit, FaIdCard, FaMoneyBillWave, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function ManagerProfile() {
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch manager profile data on component mount
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setIsLoading(true);

            // Simulate API call - Replace with your actual API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data - Replace with actual API response from logged-in manager
            const mockData = {
                id: 'MG000001',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@hospital.com',
                phone: '+60 12-345 6789',
                dateOfBirth: '1985-05-15',
                gender: 'male',
                address: '123 Manager Street, Kuala Lumpur, 50000',
                bloodGroup: 'O+',
                emergencyContact: '+60 13-456 7890',
                position: 'Operations Manager',
                joiningDate: '2020-03-15',
                yearsOfExperience: 10,
                salary: 12000,
                status: 'active'
            };

            setProfileData(mockData);
        } catch (error) {
            console.error('Error fetching profile data:', error);
            alert('Failed to load profile data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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

    if (!profileData) {
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

    const statusDisplay = getStatusDisplay(profileData.status);
    const tenure = calculateTenure(profileData.joiningDate);

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Page Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-heading">My Profile</h1>
                        <p className="text-muted mt-1">View and manage your personal information</p>
                    </div>
                    <button
                        onClick={() => handleEditProfile(profileData.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-ondark rounded-lg font-medium hover:bg-primary-hover transition-colors"
                    >
                        <FaEdit size={18} />
                        <span>Edit Profile</span>
                    </button>
                </div>

                {/* Profile Header Card */}
                <div className="bg-gradient-to-r from-primary to-primary-hover rounded-xl shadow-soft p-8 mb-6 text-ondark">
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-primary text-ondark flex items-center justify-center text-3xl font-bold flex-shrink-0">
                            {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-2 text-primary">
                                {profileData.firstName} {profileData.lastName}
                            </h2>
                            <p className="text-xl mb-3 opacity-90 text-primary">{profileData.position}</p>
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2 text-primary">
                                    <FaIdCard size={16} />
                                    <span className="text-sm font-medium">{profileData.id}</span>
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
                                <p className="text-3xl font-bold">{profileData.yearsOfExperience}</p>
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
                            <p className="text-body font-medium">{profileData.email}</p>
                        </div>

                        {/* Phone */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaPhone size={12} />
                                Phone Number
                            </p>
                            <p className="text-body font-medium">{profileData.phone}</p>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaCalendar size={12} />
                                Date of Birth
                            </p>
                            <p className="text-body font-medium">
                                {formatDate(profileData.dateOfBirth)} ({calculateAge(profileData.dateOfBirth)} years)
                            </p>
                        </div>

                        {/* Gender */}
                        <div>
                            <p className="text-xs text-muted mb-2">Gender</p>
                            <p className="text-body font-medium capitalize">{profileData.gender}</p>
                        </div>

                        {/* Blood Group */}
                        <div>
                            <p className="text-xs text-muted mb-2">Blood Group</p>
                            <p className="text-body font-medium">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-danger bg-opacity-10 text-ondark font-semibold">
                                    {profileData.bloodGroup}
                                </span>
                            </p>
                        </div>

                        {/* Emergency Contact */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaPhone size={12} />
                                Emergency Contact
                            </p>
                            <p className="text-body font-medium">{profileData.emergencyContact}</p>
                        </div>
                    </div>

                    {/* Address - Full Width */}
                    <div className="mt-6 pt-6 border-t border-color">
                        <p className="text-xs text-muted mb-2 flex items-center gap-2">
                            <FaMapMarkerAlt size={12} />
                            Residential Address
                        </p>
                        <p className="text-body font-medium">{profileData.address}</p>
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
                            <p className="text-body font-medium">{profileData.position}</p>
                        </div>

                        {/* Joining Date */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaCalendar size={12} />
                                Joining Date
                            </p>
                            <p className="text-body font-medium">
                                {formatDate(profileData.joiningDate)} ({tenure} years)
                            </p>
                        </div>

                        {/* Years of Experience */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaClock size={12} />
                                Total Experience
                            </p>
                            <p className="text-body font-medium">{profileData.yearsOfExperience} years</p>
                        </div>

                        {/* Salary */}
                        <div>
                            <p className="text-xs text-muted mb-2 flex items-center gap-2">
                                <FaMoneyBillWave size={12} />
                                Monthly Salary
                            </p>
                            <p className="text-body font-medium">RM {profileData.salary.toLocaleString()}</p>
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
        </Layout>
    );
}