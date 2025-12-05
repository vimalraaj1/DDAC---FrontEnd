import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import {useState, useEffect, useMemo, useCallback} from 'react';
import { FaCalendarAlt, FaClock, FaUserMd, FaUser, FaUserTie, FaIdCard, FaArrowLeft, FaStethoscope, FaNotesMedical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {registerAppointment} from "../../../services/appointmentManagementService.js";
import {bookAppointment, getDateAndTimeAfterSelectDoctor} from "../../../services/availabilityManagementService.js";
import {getPatients} from "../../../services/patientManagementService.js";
import {getStaffs} from "../../../services/staffManagementService.js";
import {getDoctors} from "../../../services/doctorManagementService.js";

export default function AddNewAppointment() {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        status: 'Approved',
        patientId: '',
        doctorId: '',
        staffId: '',
        purpose: '',
        cancellationReason: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [dateLoading, setDateLoading] = useState(true);
    const [patientsList, setPatientsList] = useState([]);
    const [doctorsList, setDoctorsList] = useState([]);
    const [staffsList, setStaffsList] = useState([]);
    const [doctorAvailability, setDoctorAvailability] = useState([]);

    const appointmentStatuses = [
        'Scheduled',
        'Approved',
        'Rejected',
        'Completed',
        'Cancelled',
        'No show'
    ];

    const fetchInitialData = useCallback(async () => {
        try {
            setDataLoading(true);

            const [patientsData, doctorsData, staffData] = await Promise.all([
                getPatients(),
                getDoctors(),
                getStaffs()
            ]);

            // Assuming your service returns objects that need formatting for the dropdowns
            setPatientsList(patientsData.map(p => ({
                id: p.id,
                name: `${p.firstName} ${p.lastName}`
            })));
            setDoctorsList(doctorsData.map(d => ({
                id: d.id,
                name: `Dr. ${d.firstName} ${d.lastName}`,
                specialization: d.specialization
            })));
            setStaffsList(staffData.map(s => ({
                id: s.id,
                name: `${s.firstName} ${s.lastName}`,
                role: s.role
            })));

        } catch (error) {
            console.error('Error fetching initial data:', error);
            alert('Failed to load required data (Patients, Doctors, Staff). Please check the console.');
        } finally {
            setDataLoading(false);
        }
    }, []);
    
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // Effect to fetch dates when doctor changes
    useEffect(() => {
        const fetchAvailability = async () => {
            const doctorId = formData.doctorId;
            if (doctorId) {
                setDateLoading(true);
                try {
                    const data = await getDateAndTimeAfterSelectDoctor(doctorId);
                    setDoctorAvailability(data);
                } catch (error) {
                    console.error('Error fetching doctor availability:', error);
                    setDoctorAvailability([]);
                    alert('Failed to load doctor availability.');
                }
                finally {
                    setDateLoading(false);
                }
            } else {
                setDoctorAvailability([]);
            }
        };
        fetchAvailability();
    }, [formData.doctorId]);


    const availableDates = useMemo(() => {
        const uniqueDates = [...new Set (doctorAvailability.map(item => item.date))];
        return uniqueDates.sort();
    }, [doctorAvailability]);

    const availableTimes = useMemo(() => {
        if (!formData.date) return [];
        return doctorAvailability.filter(item => item.date === formData.date)
            .map(item => ({id: item.id, time: item.time}))
            .sort((a, b) => a.time.localeCompare(b.time));
    }, [doctorAvailability, formData.date]);

    const getSelectedAvailabilityId = useCallback(() => {
        if (!formData.date || !formData.time) return null;
        const availability = doctorAvailability.find(
            item => item.date === formData.date && item.time === formData.time
        );
        return availability?.id || null;
    }, [doctorAvailability, formData.date, formData.time]);
    
    const handleDoctorChange = (e) => {
        const newDoctorId = e.target.value;
        setFormData(prev => ({
            ...prev,
            doctorId: newDoctorId,
            date: '',
            time: ''
        }));
        setErrors(prev => ({
            ...prev,
            doctorId: '',
            date: '',
            time: ''
        }));
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setFormData(prev => ({
            ...prev,
            date: newDate,
            time: ''
        }));
        setErrors(prev => ({
            ...prev,
            date: '',
            time: ''
        }));
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
            const availabilityId = getSelectedAvailabilityId();
            if (!availabilityId) {
                alert('Unable to find availability slot. Please try again.');
                return;
            }
            const payload = {
                ...formData,
            };
            console.log('Submitting appointment data: ', payload);
            console.log('Booking availability ID:', availabilityId);
            
            const appointmentResponse = await registerAppointment(payload);
            console.log('Appointment created successfully:', appointmentResponse);
            await bookAppointment(availabilityId, appointmentResponse.id);
            console.log('Availability booked successfully');
            alert('Appointment added successfully!');
            navigate('/managerAppointmentInfo');
        } catch (error) {
            console.error('Error adding appointment:', error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                console.error('Backend Validation Errors:', error.response.data.errors);
                alert('Failed to add appointment. Please try again.');
            } else {
                alert(error.response?.data?.message || 'Failed to add appointment. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
            navigate('/managerAppointmentInfo');
        }
    };
    
    if (dataLoading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted">Loading required data...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const isDoctorSelected = !!formData.doctorId;
    const isDateSelected = !!formData.date;
    const disabledClass = 'bg-gray-100 text-gray-500 cursor-not-allowed';
    
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
                
                <form onSubmit={handleSubmit} className="space-y-6">
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
                                        {patientsList.map(patient => (
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
                                        onChange={handleDoctorChange}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card ${
                                            errors.doctorId ? 'border-accent-danger' : 'border-input'
                                        }`}
                                    >
                                        <option value="">Select doctor</option>
                                        {doctorsList.map(doctor => (
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
                                        {staffsList.map(staff => (
                                            <option key={staff.id} value={staff.id}>
                                                {staff.name} - {staff.role}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.staffId && <p className="text-accent-danger text-xs mt-1">{errors.staffId}</p>}
                            </div>
                        </div>
                    </div>
                    
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
                                    <select
                                        name="date"
                                        value={formData.date}
                                        onChange={handleDateChange}
                                        disabled={dateLoading || !isDoctorSelected || availableDates.length === 0}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card ${
                                            errors.date ? 'border-accent-danger' : 'border-input'
                                        } ${!isDoctorSelected || availableDates.length === 0 ? disabledClass : ''}`}
                                    >
                                        <option value="">
                                            {!isDoctorSelected ? 'Select a doctor first' : 
                                                dateLoading ? "Loading the available dates..." :
                                                availableDates.length === 0 ? 'No availability found' : 'Select available date'}
                                        </option>
                                        {availableDates.map(date => (
                                            <option key={date} value={date}>
                                                {date}
                                            </option>
                                        ))}
                                    </select>
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
                                    <select
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        disabled={!isDateSelected || availableTimes.length === 0}
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card ${
                                            errors.time ? 'border-accent-danger' : 'border-input'
                                        } ${!isDateSelected || availableTimes.length === 0 ? disabledClass : ''}`}
                                    >
                                        <option value="">
                                            {!isDateSelected ? 'Select a date first' :
                                                availableTimes.length === 0 ? 'No times found' : 'Select available time'}
                                        </option>
                                        {availableTimes.map(timeSlot => (
                                            <option key={timeSlot.id} value={timeSlot.time}>
                                                {timeSlot.time}
                                            </option>
                                        ))}
                                    </select>
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