import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft, FaEdit, FaTrash, FaUserMd, FaEnvelope, FaPhone,
    FaStethoscope, FaIdCard, FaCalendar, FaMapMarkerAlt,
    FaBriefcase, FaDollarSign, FaTint, FaHospital, FaUserCircle,
    FaCheckCircle, FaClock
} from 'react-icons/fa';
import {deleteDoctor, getDoctorById, getDoctors} from "../../../services/doctorManagementService.js";
import {
    CountNumberOfAppointmentsByDoctorId,
    CountNumberOfUniquePatientsByDoctorId
} from "../../../services/appointmentManagementService.js";

export default function ViewDoctor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('personal');
    const [numOfPatients, setNumOfPatients] = useState(0);
    const [numOfAppointments, setNumOfAppointments] = useState(0);
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getDoctorInfo();
    }, []);

    const getDoctorInfo = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getDoctorById(id);
            console.log('Fetched doctor:', data);
            if (data && typeof data === 'object') {
                setDoctor(data);
                const doctorId = data.id
                let patientCount = 0;
                let appointmentCount = 0;
                try {
                    const count = await CountNumberOfUniquePatientsByDoctorId(doctorId);
                    patientCount = count;
                    const countA = await CountNumberOfAppointmentsByDoctorId(doctorId);
                    appointmentCount = countA;
                } catch (err) {
                    console.error(`Error fetching patient and appointment count for doctor ${doctor.id}:`, err);
                }
                setNumOfPatients(patientCount);
                setNumOfAppointments(appointmentCount);
            } else {
                throw new Error('Doctor not found or invalid data format.');
            }
        }
        catch (err) {
            console.error('Error fetching doctor:', err);
            setError(err.message || 'Failed to fetch doctor');
            setDoctor(null);
            setNumOfPatients(0);
            setNumOfAppointments(0);
        } finally {
            setLoading(false);
        }
    }
    
    const handleEdit = () => {
        navigate(`/managerEditDoctor/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await deleteDoctor(id);
                console.log('Delete doctor successful:', id);
                alert('Doctor record deleted successfully');
                navigate(`/managerDoctorInfo`);
            } catch (err) {
                console.error('Error deleting doctor:', err);
                alert('Failed to delete doctor');
            }
        }
    };

    const handleBack = () => {
        navigate('/managerDoctorInfo');
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: FaUserCircle },
        { id: 'professional', label: 'Professional', icon: FaStethoscope },
        { id: 'employment', label: 'Employment', icon: FaBriefcase }
    ];

    // Loading state
    if (loading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted">Loading doctor...</p>
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
                        <FaUserMd size={64} className="text-accent-danger mx-auto mb-4" />
                        <h2 className="text-heading text-xl font-bold mb-2">Error Loading Doctor</h2>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            onClick={getDoctorInfo}
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
                        <span>Back to Doctors</span>
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

                {/* Profile Header Card */}
                <div className="bg-card rounded-xl shadow-soft overflow-hidden mb-6">
                    {/* Cover Background */}
                    <div className="h-32 bg-gradient-to-r from-primary to-primary-light"></div>

                    {/* Profile Content */}
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center text-primary text-4xl font-bold">
                                    {doctor.firstName.charAt(0).toUpperCase()}{doctor.lastName.charAt(0).toUpperCase()}
                                </div>
                                <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-card ${
                                    doctor.status.toLowerCase() === 'active' ? 'bg-accent-success' : 'bg-accent-warning'
                                }`}></div>
                            </div>

                            {/* Doctor Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-heading mb-2">Dr. {doctor.firstName} {doctor.lastName}</h1>
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary bg-opacity-10 text-ondark rounded-full text-sm font-medium">
                                                <FaStethoscope size={14} />
                                                  {doctor.specialization}
                                            </span>
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                                doctor.status.toLowerCase() === 'active'
                                                    ? 'bg-accent-success bg-opacity-10 text-ondark'
                                                    : 'bg-accent-warning bg-opacity-10 text-ondark'
                                            }`}>
                                            {doctor.status.toLowerCase() === 'active' ? (
                                                <>
                                                    <FaCheckCircle size={12} />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <FaClock size={12} />
                                                    On Leave
                                                </>
                                            )}
                                          </span>
                                        </div>
                                        <p className="text-muted text-sm">Doctor ID: {doctor.id}</p>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="bg-main rounded-lg p-4">
                                        <p className="text-muted text-xs mb-1">Total Patients</p>
                                        <p className="text-heading text-2xl font-bold">{numOfPatients}</p>
                                    </div>
                                    <div className="bg-main rounded-lg p-4">
                                        <p className="text-muted text-xs mb-1">Experience</p>
                                        <p className="text-heading text-2xl font-bold">{doctor.yearsOfExperience} yrs</p>
                                    </div>
                                    <div className="bg-main rounded-lg p-4">
                                        <p className="text-muted text-xs mb-1">Total Appointments</p>
                                        <p className="text-heading text-2xl font-bold">{numOfAppointments}</p>
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
                        {activeTab === 'personal' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InfoItem icon={FaUserMd} label="Full Name" value={`Dr. ${doctor.firstName} ${doctor.lastName}`} />
                                <InfoItem icon={FaCalendar} label="Date of Birth" value={`${doctor.dateOfBirth}`} />
                                <InfoItem icon={FaUserCircle} label="Gender" value={doctor.gender} />
                                <InfoItem icon={FaTint} label="Blood Group" value={doctor.bloodGroup} />
                                <InfoItem icon={FaEnvelope} label="Email Address" value={doctor.email} />
                                <InfoItem icon={FaPhone} label="Phone Number" value={doctor.phone} />
                                <InfoItem icon={FaPhone} label="Emergency Contact" value={doctor.emergencyContact} />
                                <div className="md:col-span-2">
                                    <InfoItem icon={FaMapMarkerAlt} label="Address" value={doctor.address} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'professional' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InfoItem icon={FaStethoscope} label="Specialization" value={doctor.specialization} />
                                <InfoItem icon={FaIdCard} label="License Number" value={doctor.licenseNumber} />
                                <InfoItem icon={FaBriefcase} label="Years of Experience" value={`${doctor.yearsOfExperience} years`} />
                                <InfoItem icon={FaHospital} label="Department" value={doctor.department} />
                                <InfoItem icon={FaUserMd} label="Total Patients Treated" value={numOfPatients} />
                                <InfoItem icon={FaCalendar} label="Total Appointments" value={numOfAppointments} />
                            </div>
                        )}

                        {activeTab === 'employment' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InfoItem icon={FaCalendar} label="Joining Date" value={doctor.joiningDate} />
                                <InfoItem icon={FaBriefcase} label="Department" value={doctor.department} />
                                <InfoItem icon={FaDollarSign} label="Monthly Salary" value={`RM ${parseInt(doctor.salary).toLocaleString()}`} />
                                <InfoItem
                                    icon={FaCheckCircle}
                                    label="Employment Status"
                                    value={doctor.status.toLowerCase() === 'active' ? 'Active' : 'On Leave'}
                                    valueColor={doctor.status.toLowerCase() === 'active' ? 'text-accent-success' : 'text-accent-warning'}
                                />
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