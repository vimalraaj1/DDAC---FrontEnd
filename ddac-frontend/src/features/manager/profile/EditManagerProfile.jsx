import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaBriefcase, FaSave, FaTimes, FaIdCard, FaMoneyBillWave, FaClock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import Layout from '../../../components/Layout.jsx';
import {Navigate, useNavigate} from 'react-router-dom';

export default function EditManagerProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'male',
        address: '',
        bloodGroup: '',
        emergencyContact: '',
        position: '',
        joiningDate: '',
        yearsOfExperience: '',
        salary: '',
        status: 'active'
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const positions = [
        'Operations Manager',
        'HR Manager',
        'Finance Manager',
        'Medical Services Manager',
        'Administrative Manager',
        'Facilities Manager',
        'IT Manager',
        'Quality Assurance Manager'
    ];

    const statusOptions = [
        'Active',
        'On Leave',
        'Inactive'
    ];

    // Fetch manager profile data on component mount
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setIsLoading(true);

            // Simulate API call - Replace with your actual API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data - Replace with actual API response
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
                status: 'Active'
            };

            setFormData(mockData);
        } catch (error) {
            console.error('Error fetching profile data:', error);
            alert('Failed to load profile data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+?[\d\s-]{10,15}$/;

        // Required field validation
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number';
        }

        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.emergencyContact.trim()) {
            newErrors.emergencyContact = 'Emergency contact is required';
        } else if (!phoneRegex.test(formData.emergencyContact)) {
            newErrors.emergencyContact = 'Invalid phone number';
        }
        if (!formData.position) newErrors.position = 'Position is required';
        if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood Group is required';

        // Numeric validations
        if (formData.salary && (isNaN(formData.salary) || Number(formData.salary) < 0)) {
            newErrors.salary = 'Invalid salary amount';
        }

        if (formData.yearsOfExperience && (isNaN(formData.yearsOfExperience) || Number(formData.yearsOfExperience) < 0)) {
            newErrors.yearsOfExperience = 'Invalid years of experience';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call - Replace with your actual API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Convert salary and experience to numbers
            const dataToSave = {
                ...formData,
                salary: Number(formData.salary),
                yearsOfExperience: Number(formData.yearsOfExperience)
            };

            console.log('Saving profile data:', dataToSave);

            alert('Profile updated successfully!');
            // Navigate back or reload - Replace with your navigation logic
            navigate('/managerProfile');

        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
            // Navigate back - Replace with your navigation logic
            navigate('/managerProfile');
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <Layout role="manager">
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-900 mx-auto mb-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-gray-600 text-lg">Loading profile...</p>
                </div>
            </div>
        </Layout>
        );
    }

    return (
        <Layout role="manager">
        <div className="w-full max-w-full overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                        <p className="text-gray-600 mt-1">Update your personal and professional information</p>
                    </div>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FaArrowLeft size={16} />
                        <span>Back to Profile</span>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Manager ID Display (Read-only) */}
                    <div className="bg-blue-900 text-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-3">
                            <FaIdCard size={24} />
                            <div>
                                <p className="text-sm opacity-80">Manager ID</p>
                                <p className="text-xl font-bold">{formData.id}</p>
                            </div>
                        </div>
                        <p className="text-xs mt-2 opacity-70 flex items-center gap-1">
                            <span>🔒</span>
                            <span>Manager ID cannot be modified</span>
                        </p>
                    </div>

                    {/* Personal Information Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <FaUser className="text-blue-900" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                                <p className="text-sm text-gray-600">Basic details and contact information</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all ${
                                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter first name"
                                    />
                                </div>
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all ${
                                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter last name"
                                    />
                                </div>
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all ${
                                            errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="+60 12-345 6789"
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all ${
                                            errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                </div>
                                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all bg-white ${
                                        errors.gender ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                            </div>

                            {/* Blood Group */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Blood Group <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all bg-white ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select blood group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="Golden Blood">Golden Blood</option>
                                </select>
                                {errors.bloodGroup && <p className="text-red-500 text-xs mt-1">{errors.bloodGroup}</p>}
                            </div>

                            {/* Emergency Contact */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Emergency Contact <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="tel"
                                        name="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all ${
                                            errors.emergencyContact ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="+60 13-456 7890"
                                    />
                                </div>
                                {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact}</p>}
                            </div>
                        </div>

                        {/* Address - Full Width */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                <FaMapMarkerAlt className="inline mr-2" size={12} />
                                Residential Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all resize-none ${
                                    errors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter full address"
                            />
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>
                    </div>

                    {/* Professional Information Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <FaBriefcase className="text-green-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
                                <p className="text-sm text-gray-600">Employment details and credentials</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Position */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Position <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all bg-white ${
                                        errors.position ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select position</option>
                                    {positions.map(pos => (
                                        <option key={pos} value={pos}>{pos}</option>
                                    ))}
                                </select>
                                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                            </div>

                            {/* Joining Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Joining Date
                                </label>
                                <div className="relative">
                                    <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="date"
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Years of Experience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    <FaClock className="inline mr-2" size={12} />
                                    Total Experience (Years)
                                </label>
                                <input
                                    type="number"
                                    name="yearsOfExperience"
                                    value={formData.yearsOfExperience}
                                    onChange={handleChange}
                                    min="0"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all ${
                                        errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., 10"
                                />
                                {errors.yearsOfExperience && <p className="text-red-500 text-xs mt-1">{errors.yearsOfExperience}</p>}
                            </div>

                            {/* Salary */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    <FaMoneyBillWave className="inline mr-2" size={12} />
                                    Monthly Salary (RM)
                                </label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    min="0"
                                    step="100"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all ${
                                        errors.salary ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., 12000"
                                />
                                {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    <FaCheckCircle className="inline mr-2" size={12} />
                                    Employment Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all bg-white"
                                >
                                    {statusOptions.map(stat => (
                                        <option key={stat} value={stat}>{stat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            <FaTimes className="inline mr-2" size={16} />
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <FaSave size={18} />
                                    <span>Update Profile</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </Layout>
    );
}