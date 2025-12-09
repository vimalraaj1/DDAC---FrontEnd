import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import {useEffect, useState} from 'react';
import { FaUser, FaEnvelope, FaPhone, FaStethoscope, FaIdCard, FaCalendar, FaMapMarkerAlt, FaUserMd, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {registerDoctor} from "../../../services/doctorManagementService.js";
import {toast, Toaster} from "sonner";

export default function AddNewDoctor() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: '',
        licenseNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        yearsOfExperience: '',
        department: '',
        joiningDate: null,
        salary: '',
        emergencyContact: '',
        bloodGroup: '',
        status: 'Active',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const specializations = [
        'Cardiology',
        'Neurology',
        'Pediatrics',
        'Orthopedics',
        'Dermatology',
        'Psychiatry',
        'Oncology',
        'Radiology',
        'General Medicine',
        'Surgery'
    ];

    const departments = [
        'Emergency',
        'Outpatient',
        'Inpatient',
        'ICU',
        'Surgery',
        'Radiology',
        'Laboratory'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
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

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number';
        }
        if (!formData.specialization) newErrors.specialization = 'Specialization is required';
        if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.address) newErrors.address = 'Address is required';

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
            setIsSubmitting(true);
            const payload = {
                ...formData,
                yearsOfExperience: parseInt(formData.yearsOfExperience, 10),
                salary: parseFloat(formData.salary),
            };
            console.log('Submitting doctor data: ', payload);
            const response = await registerDoctor(payload);
            console.log('Doctor created successfully:', response);
            toast.success('Doctor added successfully!');
            navigate('/managerDoctorInfo');
        } catch (error) {
            console.error('Error adding doctor:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                console.error('Backend Validation Errors:', error.response.data.errors);
                toast.error('Failed to add doctor. Please try again.');
            } else {
                toast.error(error.response?.data?.message || 'Failed to add doctor. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
            navigate('/managerDoctorInfo');
        }
    };

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Page Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-heading">Add New Doctor</h1>
                        <p className="text-muted mt-1">Fill in the details to register a new doctor</p>
                    </div>
                    <button
                        onClick={() => navigate('/managerDoctorInfo')}
                        className="flex items-center gap-2 px-4 py-2 text-muted hover:text-heading transition-colors"
                    >
                        <FaArrowLeft size={16} />
                        <span>Back to Doctors</span>
                    </button>
                </div>

                {/* Generated Doctor ID Display */}
                {/*<div className="bg-primary bg-opacity-10 border border-primary rounded-xl p-4 mb-6">*/}
                {/*    <div className="flex items-center gap-3">*/}
                {/*        <FaIdCard className="text-primary" size={24} />*/}
                {/*        <div>*/}
                {/*            <p className="text-sm text-ondark">Auto-Generated Doctor ID</p>*/}
                {/*            <p className="text-2xl font-bold text-ondark">{generatedId}</p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information Card */}
                    <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaUserMd className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-heading">Personal Information</h2>
                                <p className="text-sm text-muted">Basic details about the doctor</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    First Name <span className="text-accent-danger">*</span>
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                                            errors.firstName ? 'border-accent-danger' : 'border-input'
                                        }`}
                                        placeholder="Enter first name"
                                    />
                                </div>
                                {errors.firstName && <p className="text-accent-danger text-xs mt-1">{errors.firstName}</p>}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Last Name <span className="text-accent-danger">*</span>
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                                            errors.lastName ? 'border-accent-danger' : 'border-input'
                                        }`}
                                        placeholder="Enter last name"
                                    />
                                </div>
                                {errors.lastName && <p className="text-accent-danger text-xs mt-1">{errors.lastName}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Email Address <span className="text-accent-danger">*</span>
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                                            errors.email ? 'border-accent-danger' : 'border-input'
                                        }`}
                                        placeholder="doctor@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-accent-danger text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Phone Number <span className="text-accent-danger">*</span>
                                </label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                                            errors.phone ? 'border-accent-danger' : 'border-input'
                                        }`}
                                        placeholder="+60 12-345 6789"
                                    />
                                </div>
                                {errors.phone && <p className="text-accent-danger text-xs mt-1">{errors.phone}</p>}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Date of Birth <span className="text-accent-danger">*</span>
                                </label>
                                <div className="relative">
                                    <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                                            errors.dateOfBirth ? 'border-accent-danger' : 'border-input'
                                        }`}
                                    />
                                </div>
                                {errors.dateOfBirth && <p className="text-accent-danger text-xs mt-1">{errors.dateOfBirth}</p>}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Gender <span className="text-accent-danger">*</span>
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card ${
                                        errors.gender ? 'border-accent-danger' : 'border-input'
                                    }`}
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.gender && <p className="text-accent-danger text-xs mt-1">{errors.gender}</p>}
                            </div>

                            {/* Blood Group */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Blood Group
                                </label>
                                <select
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card"
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
                            </div>

                            {/* Emergency Contact */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Emergency Contact
                                </label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <input
                                        type="tel"
                                        name="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        placeholder="+60 12-345 6789"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information Card */}
                    <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                <FaStethoscope className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-heading">Professional Information</h2>
                                <p className="text-sm text-muted">Medical credentials and specialization</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Specialization */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Specialization <span className="text-accent-danger">*</span>
                                </label>
                                <select
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card ${
                                        errors.specialization ? 'border-accent-danger' : 'border-input'
                                    }`}
                                >
                                    <option value="">Select specialization</option>
                                    {specializations.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                                {errors.specialization && <p className="text-accent-danger text-xs mt-1">{errors.specialization}</p>}
                            </div>

                            {/* License Number */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    License Number <span className="text-accent-danger">*</span>
                                </label>
                                <div className="relative">
                                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <input
                                        type="text"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                                            errors.licenseNumber ? 'border-accent-danger' : 'border-input'
                                        }`}
                                        placeholder="MD-12345"
                                    />
                                </div>
                                {errors.licenseNumber && <p className="text-accent-danger text-xs mt-1">{errors.licenseNumber}</p>}
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Years of Experience
                                </label>
                                <input
                                    type="number"
                                    name="yearsOfExperience"
                                    value={formData.yearsOfExperience}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="5"
                                    min="0"
                                />
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Department
                                </label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card"
                                >
                                    <option value="">Select department</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Joining Date */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Joining Date
                                </label>
                                <div className="relative">
                                    <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <input
                                        type="date"
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    />
                                </div>
                            </div>

                            {/* Salary */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Monthly Salary (RM)
                                </label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="15000"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Information Card */}
                    <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                <FaMapMarkerAlt className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-heading">Address Information</h2>
                                <p className="text-sm text-muted">Current residential address</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Address <span className="text-accent-danger">*</span>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                                    placeholder="Enter street address"
                                />
                                {errors.address && <p className="text-accent-danger text-xs mt-1">{errors.address}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 border border-color rounded-lg text-heading font-medium hover:bg-main transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-primary text-ondark rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Adding Doctor...</span>
                                </>
                            ) : (
                                <>
                                    <FaUserMd size={18} />
                                    <span>Add Doctor</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}