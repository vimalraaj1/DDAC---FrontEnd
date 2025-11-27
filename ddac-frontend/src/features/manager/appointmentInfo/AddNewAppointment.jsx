import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUserMd, FaUser, FaUserTie, FaIdCard, FaArrowLeft, FaStethoscope, FaNotesMedical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AddNewAppointment() {
    const navigate = useNavigate();

    const [generatedId, setGeneratedId] = useState('');
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        status: 'scheduled',
        patientId: '',
        doctorId: '',
        staffId: '',
        purpose: '',
        cancellationReason: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingId, setIsGeneratingId] = useState(true);

    // Mock data for dropdowns (replace with API calls)
    const patients = [
        { id: 'PT000001', name: 'Ahmad Ibrahim' },
        { id: 'PT000002', name: 'Siti Abdullah' },
        { id: 'PT000003', name: 'Raj Kumar' },
        { id: 'PT000004', name: 'Mei Wong' },
        { id: 'PT000005', name: 'Hassan Ali' },
        { id: 'PT000006', name: 'Lakshmi Devi' }
    ];

    const doctors = [
        { id: 'DR000001', name: 'Dr. Sarah Wilson', specialization: 'Cardiology' },
        { id: 'DR000002', name: 'Dr. Michael Chen', specialization: 'Neurology' },
        { id: 'DR000003', name: 'Dr. Emily Rodriguez', specialization: 'Pediatrics' },
        { id: 'DR000004', name: 'Dr. James Kumar', specialization: 'Orthopedics' },
        { id: 'DR000005', name: 'Dr. Lisa Thompson', specialization: 'Dermatology' }
    ];

    const staff = [
        { id: 'ST000001', name: 'Alice Johnson', role: 'Nurse' },
        { id: 'ST000002', name: 'Bob Martinez', role: 'Receptionist' },
        { id: 'ST000003', name: 'Carol Lee', role: 'Lab Technician' },
        { id: 'ST000004', name: 'David Kim', role: 'Pharmacist' },
        { id: 'ST000005', name: 'Emma Wilson', role: 'Nurse' }
    ];

    const appointmentStatuses = [
        'scheduled',
        'completed',
        'cancelled',
        'no-show'
    ];

    // Generate Appointment ID on component mount
    useEffect(() => {
        generateAppointmentId();
    }, []);

    const generateAppointmentId = async () => {
        try {
            setIsGeneratingId(true);

            // Simulate API call to get last appointment ID
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock: Get last appointment ID from database
            const lastAppointmentId = 'APT000006'; // This should come from your API

            // Extract number from last ID
            const lastNumber = parseInt(lastAppointmentId.replace('APT', ''));
            // Generate new ID
            const newNumber = lastNumber + 1;
            const newId = `APT${String(newNumber).padStart(6, '0')}`;
            setGeneratedId(newId);
        } catch (error) {
            console.error('Error generating appointment ID:', error);
            // Fallback to default if API fails
            setGeneratedId('APT000001');
        } finally {
            setIsGeneratingId(false);
        }
    };

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

        if (!formData.date) newErrors.date = 'Appointment date is required';
        if (!formData.time) newErrors.time = 'Appointment time is required';
        if (!formData.status) newErrors.status = 'Status is required';
        if (!formData.patientId) newErrors.patientId = 'Patient selection is required';
        if (!formData.doctorId) newErrors.doctorId = 'Doctor selection is required';
        if (!formData.staffId) newErrors.staffId = 'Staff selection is required';
        if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';

        // Validate cancellation reason if status is cancelled
        if (formData.status === 'cancelled' && !formData.cancellationReason.trim()) {
            newErrors.cancellationReason = 'Cancellation reason is required when status is cancelled';
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
            // Prepare data with generated ID
            const appointmentData = {
                id: generatedId,
                ...formData
            };
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Form submitted:', appointmentData);
            // Show success message
            alert(`Appointment created successfully! ID: ${generatedId}`);
            // Navigate back to appointments list
            navigate('/managerAppointmentInfo');
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('Failed to create appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
            navigate('/managerAppointmentInfo');
        }
    };

    const SimpleLoadingSpinner = ({ loadingText = "Loading..." }) => (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="h-12 w-12 border-4 border-t-4 border-gray-200 border-t-[var-(--primary)] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted text-lg">{loadingText}</p>
            </div>
        </div>
    );

    // Loading state while generating ID
    if (isGeneratingId) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <SimpleLoadingSpinner loadingText="Generating Appointment ID..."/>
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
                        <h1 className="text-3xl font-bold text-heading">Schedule New Appointment</h1>
                        <p className="text-muted mt-1">Fill in the details to create a new appointment</p>
                    </div>
                    <button
                        onClick={() => navigate('/managerAppointmentInfo')}
                        className="flex items-center gap-2 px-4 py-2 text-muted hover:text-heading transition-colors"
                    >
                        <FaArrowLeft size={16} />
                        <span>Back to Appointments</span>
                    </button>
                </div>

                {/* Generated Appointment ID Display */}
                <div className="bg-primary bg-opacity-10 border border-primary rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <FaIdCard className="text-primary" size={24} />
                        <div>
                            <p className="text-sm text-ondark">Auto-Generated Appointment ID</p>
                            <p className="text-2xl font-bold text-ondark">{generatedId}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Appointment Details Card */}
                    <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaCalendarAlt className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-heading">Appointment Details</h2>
                                <p className="text-sm text-muted">Date, time, and status information</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Appointment Date <span className="text-accent-danger">*</span>
                                </label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                                            errors.date ? 'border-accent-danger' : 'border-input'
                                        }`}
                                    />
                                </div>
                                {errors.date && <p className="text-accent-danger text-xs mt-1">{errors.date}</p>}
                            </div>

                            {/* Time */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Appointment Time <span className="text-accent-danger">*</span>
                                </label>
                                <div className="relative">
                                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                                            errors.time ? 'border-accent-danger' : 'border-input'
                                        }`}
                                    />
                                </div>
                                {errors.time && <p className="text-accent-danger text-xs mt-1">{errors.time}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Status <span className="text-accent-danger">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card ${
                                        errors.status ? 'border-accent-danger' : 'border-input'
                                    }`}
                                >
                                    <option value="">Select status</option>
                                    {appointmentStatuses.map(status => (
                                        <option key={status} value={status}>
                                            {status.split('-').map(word =>
                                                word.charAt(0).toUpperCase() + word.slice(1)
                                            ).join(' ')}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && <p className="text-accent-danger text-xs mt-1">{errors.status}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Patient & Doctor Information Card */}
                    <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                <FaStethoscope className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-heading">Patient & Doctor Information</h2>
                                <p className="text-sm text-muted">Select patient and assigned doctor</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Patient */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Patient <span className="text-accent-danger">*</span>
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <select
                                        name="patientId"
                                        value={formData.patientId}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card ${
                                            errors.patientId ? 'border-accent-danger' : 'border-input'
                                        }`}
                                    >
                                        <option value="">Select patient</option>
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.name} ({patient.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.patientId && <p className="text-accent-danger text-xs mt-1">{errors.patientId}</p>}
                            </div>

                            {/* Doctor */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Doctor <span className="text-accent-danger">*</span>
                                </label>
                                <div className="relative">
                                    <FaUserMd className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <select
                                        name="doctorId"
                                        value={formData.doctorId}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card ${
                                            errors.doctorId ? 'border-accent-danger' : 'border-input'
                                        }`}
                                    >
                                        <option value="">Select doctor</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.id} value={doctor.id}>
                                                {doctor.name} - {doctor.specialization}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.doctorId && <p className="text-accent-danger text-xs mt-1">{errors.doctorId}</p>}
                            </div>

                            {/* Staff */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Assigned Staff <span className="text-accent-danger">*</span>
                                </label>
                                <div className="relative">
                                    <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                    <select
                                        name="staffId"
                                        value={formData.staffId}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card ${
                                            errors.staffId ? 'border-accent-danger' : 'border-input'
                                        }`}
                                    >
                                        <option value="">Select staff</option>
                                        {staff.map(member => (
                                            <option key={member.id} value={member.id}>
                                                {member.name} - {member.role}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.staffId && <p className="text-accent-danger text-xs mt-1">{errors.staffId}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Purpose & Additional Information Card */}
                    <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                <FaNotesMedical className="text-ondark" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-heading">Purpose & Additional Information</h2>
                                <p className="text-sm text-muted">Appointment details and notes</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Purpose */}
                            <div>
                                <label className="block text-sm font-medium text-heading mb-2">
                                    Purpose of Visit <span className="text-accent-danger">*</span>
                                </label>
                                <textarea
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    rows="3"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                                        errors.purpose ? 'border-accent-danger' : 'border-input'
                                    }`}
                                    placeholder="e.g., General Checkup, Follow-up Consultation, Cardiac Screening"
                                />
                                {errors.purpose && <p className="text-accent-danger text-xs mt-1">{errors.purpose}</p>}
                            </div>

                            {/* Cancellation Reason - Only show if status is cancelled */}
                            {formData.status === 'cancelled' && (
                                <div>
                                    <label className="block text-sm font-medium text-heading mb-2">
                                        Cancellation Reason <span className="text-accent-danger">*</span>
                                    </label>
                                    <textarea
                                        name="cancellationReason"
                                        value={formData.cancellationReason}
                                        onChange={handleChange}
                                        rows="2"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                                            errors.cancellationReason ? 'border-accent-danger' : 'border-input'
                                        }`}
                                        placeholder="Please provide a reason for cancellation"
                                    />
                                    {errors.cancellationReason && <p className="text-accent-danger text-xs mt-1">{errors.cancellationReason}</p>}
                                </div>
                            )}
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
                                    <span>Creating Appointment...</span>
                                </>
                            ) : (
                                <>
                                    <FaCalendarAlt size={18} />
                                    <span>Create Appointment</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}