import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaClock,
    FaIdCard, FaCheckCircle, FaUserMd, FaUser, FaUserTie,
    FaStethoscope, FaNotesMedical, FaExclamationTriangle,
    FaTimesCircle, FaBan, FaHospital, FaPhone, FaEnvelope, FaCalendarCheck, FaThumbsUp
} from 'react-icons/fa';
import {deleteDoctor, getDoctorById} from "../../../services/doctorManagementService.js";
import {
    CountNumberOfAppointmentsByDoctorId,
    CountNumberOfUniquePatientsByDoctorId, deleteAppointment, getAppointmentById, GetAppointmentWithDetailsById
} from "../../../services/appointmentManagementService.js";
import {FaThumbsDown} from "react-icons/fa6";
import {unbookAppointment} from "../../../services/availabilityManagementService.js";

export default function ViewAppointment() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('details');
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        getAppointmentInfo();
    }, []);

    const getAppointmentInfo = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await GetAppointmentWithDetailsById(id);
            console.log('Fetched appointment:', data);
            if (data && typeof data === 'object') {
                setAppointment(data);
            } else {
                throw new Error('Appointment not found or invalid data format.');
            }
        }
        catch (err) {
            console.error('Error fetching appointment:', err);
            setError(err.message || 'Failed to fetch appointment');
            setAppointment(null);
        } finally {
            setLoading(false);
        }
    }
    
    // Status configuration
    const statusConfig = {
        scheduled: {
            color: 'bg-primary bg-opacity-10 text-ondark border-primary',
            icon: FaCalendarAlt,
            label: 'Scheduled'
        },
        approved: {
            color: 'bg-accent-success bg-opacity-10 text-ondark border-accent-success',
            icon: FaThumbsUp,
            label: 'Approved'
        },
        rejected: {
            color: 'bg-accent-danger bg-opacity-10 text-ondark border-accent-success',
            icon: FaThumbsDown,
            label: 'Rejected'
        },
        completed: {
            color: 'bg-accent-success bg-opacity-10 text-ondark border-accent-success',
            icon: FaCheckCircle,
            label: 'Completed'
        },
        cancelled: {
            color: 'bg-accent-danger bg-opacity-10 text-ondark border-accent-danger',
            icon: FaTimesCircle,
            label: 'Cancelled'
        },
        'no-show': {
            color: 'bg-accent-warning bg-opacity-10 text-ondark border-accent-warning',
            icon: FaBan,
            label: 'No-Show'
        }
    };

    let currentStatus = statusConfig.scheduled; // Default safe value
    let StatusIcon = currentStatus.icon;
    if(appointment) {
        currentStatus = statusConfig[appointment.status.toLowerCase()] || statusConfig.scheduled;
        StatusIcon = currentStatus.icon;
    }

    const handleEdit = () => {
        navigate(`/managerEditAppointment/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                try {
                    await unbookAppointment(id);
                    console.log('Unbook timeslot successful:', id);
                } catch (unbookError) {
                    if (unbookError.response && unbookError.response.status === 404) {
                        console.warn(`Old slot was already unbooked (404 Not Found) for Appointment ID: ${id}. Proceeding with deletion.`);
                    } else {
                        console.error('Critical unbook error, stopping deletion:', unbookError);
                        alert('Failed to free the time slot due to a server error. Deletion aborted.');
                        return;
                    }
                }
                await deleteAppointment(id);
                console.log('Delete appointment successful:', id);
                alert('Appointment record deleted successfully');
                navigate(`/managerAppointmentInfo`);
            } catch (err) {
                console.error('Error deleting appointment:', err);
                alert('Failed to delete appointment');
            }
        }
    };

    const handleBack = () => {
        navigate('/managerAppointmentInfo');
    };

    const tabs = [
        { id: 'details', label: 'Appointment Details', icon: FaCalendarAlt },
        { id: 'people', label: 'People Involved', icon: FaUserMd }
    ];

    // Loading state
    if (loading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted">Loading appointment...</p>
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
                        <FaCalendarCheck size={64} className="text-accent-danger mx-auto mb-4" />
                        <h2 className="text-heading text-xl font-bold mb-2">Error Loading Appointment</h2>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            onClick={getAppointmentInfo}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Header Actions */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-4 py-2 text-muted hover:text-heading transition-colors"
                    >
                        <FaArrowLeft size={16} />
                        <span>Back to Appointments</span>
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-ondark rounded-lg font-medium hover:bg-primary-hover transition-colors"
                        >
                            <FaEdit size={16} />
                            <span>Edit</span>
                        </button>
                        <button
                            onClick={() => handleDelete(id)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-accent-danger bg-opacity-10 text-ondark rounded-lg font-medium hover:bg-opacity-20 transition-colors"
                        >
                            <FaTrash size={16} />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>

                {/* Appointment Header Card */}
                <div className="bg-card rounded-xl shadow-soft overflow-hidden mb-6">
                    {/* Cover Background */}
                    <div className="h-32 bg-gradient-to-r from-primary to-primary-light"></div>

                    {/* Appointment Content */}
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                            {/* Icon */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center text-primary">
                                    <FaCalendarAlt size={48} />
                                </div>
                                <div className={`absolute bottom-2 right-2 p-2 rounded-full border-4 border-card ${
                                    appointment.status === 'completed' ? 'bg-accent-success' :
                                        appointment.status === 'cancelled' ? 'bg-accent-danger' :
                                            appointment.status === 'no-show' ? 'bg-accent-warning' :
                                                'bg-primary'
                                }`}>
                                    <StatusIcon className="text-white" size={16} />
                                </div>
                            </div>

                            {/* Appointment Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-heading mb-2">Appointment Details</h1>
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border-2 ${currentStatus.color}`}>
                                                <StatusIcon size={14} />
                                                  {currentStatus.label}
                                            </span>
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent-sky bg-opacity-10 text-ondark rounded-full text-sm font-medium">
                                                 <FaCalendarAlt size={14} />
                                                {appointment.date}
                                            </span>
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent-teal bg-opacity-10 text-ondark rounded-full text-sm font-medium">
                                                 <FaClock size={14} />
                                                {appointment.time}
                                            </span>
                                        </div>
                                        <p className="text-muted text-sm">Appointment ID: {appointment.id}</p>
                                    </div>
                                </div>

                                {/* Quick Info Cards */}
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="bg-main rounded-lg p-4">
                                        <p className="text-muted text-xs mb-1">Patient</p>
                                        <p className="text-heading text-sm font-bold">{appointment.patient.firstName} {appointment.patient.lastName}</p>
                                        <p className="text-muted text-xs">{appointment.patient.id}</p>
                                    </div>
                                    <div className="bg-main rounded-lg p-4">
                                        <p className="text-muted text-xs mb-1">Doctor</p>
                                        <p className="text-heading text-sm font-bold">Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
                                        <p className="text-muted text-xs">{appointment.doctor.specialization}</p>
                                    </div>
                                    <div className="bg-main rounded-lg p-4">
                                        <p className="text-muted text-xs mb-1">Assigned Staff</p>
                                        <p className="text-heading text-sm font-bold">{`${appointment.staff?.firstName} ${appointment.staff?.lastName}` || "No staff"}</p>
                                        <p className="text-muted text-xs">{appointment.staff?.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                    <div className="border-b border-color">
                        <div className="flex gap-1 px-6">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                                            activeTab === tab.id
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-muted hover:text-heading'
                                        }`}
                                    >
                                        <Icon size={16} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                {/* Appointment Information */}
                                <div className="bg-main rounded-xl p-6 border border-color">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                            <FaCalendarAlt className="text-ondark" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-heading font-semibold text-lg">Appointment Information</h3>
                                            <p className="text-muted text-sm">Basic appointment details</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoItem icon={FaIdCard} label="Appointment ID" value={appointment.id} />
                                        <InfoItem
                                            icon={StatusIcon}
                                            label="Status"
                                            value={currentStatus.label}
                                            valueColor={
                                                appointment.status.toLowerCase() === 'completed' ? 'text-accent-success' :
                                                    appointment.status.toLowerCase() === 'cancelled' ? 'text-accent-danger' :
                                                        appointment.status.toLowerCase() === 'no-show' ? 'text-accent-warning' :
                                                            appointment.status.toLowerCase() === 'approved' ? 'text-accent-success' :
                                                                appointment.status.toLowerCase() === 'rejected' ? 'text-accent-danger' :
                                                                    'text-primary'
                                            }
                                        />
                                        <InfoItem icon={FaCalendarAlt} label="Date" value={appointment.date} />
                                        <InfoItem icon={FaClock} label="Time" value={appointment.time} />
                                    </div>
                                </div>

                                {/* Purpose of Visit */}
                                <div className="bg-main rounded-xl p-6 border border-color">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                            <FaNotesMedical className="text-ondark" size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-heading font-semibold text-lg mb-2">Purpose of Visit</h3>
                                            <p className="text-body leading-relaxed">{appointment.purpose}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cancellation Reason (if cancelled) */}
                                {appointment.status.toLowerCase() === 'cancelled' && appointment.cancellationReason && (
                                    <div className="bg-accent-danger bg-opacity-5 rounded-xl p-6 border-2 border-accent-danger">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-accent-danger bg-opacity-10 p-3 rounded-lg">
                                                <FaExclamationTriangle className="text-ondark" size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-ondark font-semibold text-lg mb-2 flex items-center gap-2">
                                                    <span>Cancellation Reason</span>
                                                </h3>
                                                <p className="text-ondark leading-relaxed">{appointment.cancellationReason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'people' && (
                            <div className="space-y-6">
                                {/* Patient Information */}
                                <div className="bg-main rounded-xl p-6 border border-color">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                            <FaUser className="text-ondark" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-heading font-semibold text-lg">Patient Information</h3>
                                            <p className="text-muted text-sm">Details about the patient</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoItem icon={FaUser} label="Patient Name" value={`${appointment.patient.firstName} ${appointment.patient.lastName}`}/>
                                        <InfoItem icon={FaIdCard} label="Patient ID" value={appointment.patient.id} />
                                        <InfoItem icon={FaPhone} label="Phone Number" value={appointment.patient.phone} />
                                        <InfoItem icon={FaEnvelope} label="Email Address" value={appointment.patient.email} />
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-color">
                                        <button
                                            onClick={() => navigate(`/managerViewPatient/${appointment.patient.id}`)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary bg-opacity-10 text-ondark rounded-lg font-medium hover:bg-opacity-20 transition-colors"
                                        >
                                            <FaUser size={14} />
                                            <span>View Full Patient Profile</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Doctor Information */}
                                <div className="bg-main rounded-xl p-6 border border-color">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                            <FaUserMd className="text-ondark" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-heading font-semibold text-lg">Doctor Information</h3>
                                            <p className="text-muted text-sm">Assigned medical professional</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoItem icon={FaUserMd} label="Doctor Name" value={`Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`}/>
                                        <InfoItem icon={FaStethoscope} label="Specialization" value={appointment.doctor.doctorSpecialization} />
                                        <InfoItem icon={FaIdCard} label="Doctor ID" value={appointment.doctor.id} />
                                        <InfoItem icon={FaPhone} label="Phone Number" value={appointment.doctor.phone} />
                                        <div className="md:col-span-2">
                                            <InfoItem icon={FaEnvelope} label="Email Address" value={appointment.doctor.email} />
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-color">
                                        <button
                                            onClick={() => navigate(`/managerViewDoctor/${appointment.doctor.id}`)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-success bg-opacity-10 text-ondark rounded-lg font-medium hover:bg-opacity-20 transition-colors"
                                        >
                                            <FaUserMd size={14} />
                                            <span>View Full Doctor Profile</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Staff Information */}
                                <div className="bg-main rounded-xl p-6 border border-color">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                            <FaUserTie className="text-ondark" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-heading font-semibold text-lg">Assigned Staff Information</h3>
                                            <p className="text-muted text-sm">Supporting medical staff</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoItem icon={FaUserTie} label="Staff Name" value={`${appointment.staff?.firstName} ${appointment.staff?.lastName}`}/>
                                        <InfoItem icon={FaHospital} label="Role" value={appointment.staff?.role} />
                                        <InfoItem icon={FaIdCard} label="Staff ID" value={appointment.staff?.id} />
                                        <InfoItem icon={FaPhone} label="Phone Number" value={appointment.staff?.phone} />
                                    </div>

                                    {appointment.staff && (
                                        <div className="mt-6 pt-6 border-t border-color">
                                            <button
                                                onClick={() => navigate(`/managerViewStaff/${appointment.staff?.id}`)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-sky bg-opacity-10 text-ondark rounded-lg font-medium hover:bg-opacity-20 transition-colors"
                                            >
                                                <FaUserTie size={14} />
                                                <span>View Full Staff Profile</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

// Reusable Info Item Component
function InfoItem({ icon: Icon, label, value, valueColor = 'text-heading' }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <Icon className="text-ondark" size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-muted text-sm mb-1">{label}</p>
                <p className={`${valueColor} font-medium break-words`}>{value || 'No information'}</p>
            </div>
        </div>
    );
}