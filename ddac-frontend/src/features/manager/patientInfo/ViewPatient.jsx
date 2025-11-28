import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft, FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone,
    FaIdCard, FaCalendar, FaMapMarkerAlt, FaTint, FaUserCircle,
    FaCheckCircle, FaHeartbeat, FaAllergies, FaPills, FaExclamationTriangle,
    FaUserInjured, FaHospital, FaStethoscope, FaNotesMedical
} from 'react-icons/fa';

export default function ViewPatient() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('personal');

    // Mock data - Replace with actual API call
    const patient = {
        id: id || 'PT000001',
        firstName: 'Ahmad',
        lastName: 'Ibrahim',
        email: 'ahmad.ibrahim@email.com',
        phone: '+60 12-345 6789',
        dateOfBirth: '1990-03-15',
        gender: 'Male',
        address: '123 Patient Street, Petaling Jaya, Selangor, Malaysia 46000',
        bloodType: 'O+',
        allergies: 'Penicillin, Shellfish',
        conditions: 'Hypertension, Type 2 Diabetes',
        medications: 'Lisinopril 10mg daily, Metformin 500mg twice daily',
        emergencyName: 'Siti Ibrahim',
        emergencyRelationship: 'Spouse',
        emergencyContact: '+60 13-456 7890',
        totalVisits: 12,
        upcomingAppointments: 2,
        registrationDate: '2023-01-15'
    };

    const handleEdit = () => {
        navigate(`/managerEditPatient/${id}`);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${patient.firstName} ${patient.lastName}'s record?`)) {
            console.log('Delete patient:', id);
            navigate('/managerPatientInfo');
        }
    };

    const handleBack = () => {
        navigate('/managerPatientInfo');
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: FaUserCircle },
        { id: 'medical', label: 'Medical Records', icon: FaHeartbeat },
        { id: 'emergency', label: 'Emergency Contact', icon: FaUserInjured }
    ];

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
                        <span>Back to Patients</span>
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
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-5 py-2.5 bg-accent-danger bg-opacity-10 text-accent-danger rounded-lg font-medium hover:bg-opacity-20 transition-colors"
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
                                    {patient.firstName.charAt(0).toUpperCase()}{patient.lastName.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            {/* Patient Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-heading mb-2">{patient.fullName}</h1>
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary bg-opacity-10 text-ondark rounded-full text-sm font-medium">
                                                <FaUserCircle size={14} />
                                                Patient
                                            </span>
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent-danger bg-opacity-10 text-ondark rounded-full text-sm font-medium">
                                                <FaTint size={14} />
                                                {patient.bloodType}
                                            </span>
                                        </div>
                                        <p className="text-muted text-sm">Patient ID: {patient.id}</p>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="bg-main rounded-lg p-4">
                                        <p className="text-muted text-xs mb-1">Total Visits</p>
                                        <p className="text-heading text-2xl font-bold">{patient.totalVisits}</p>
                                    </div>
                                    <div className="bg-main rounded-lg p-4">
                                        <p className="text-muted text-xs mb-1">Upcoming</p>
                                        <p className="text-heading text-2xl font-bold">{patient.upcomingAppointments}</p>
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
                                <InfoItem icon={FaUser} label="Full Name" value={`${patient.firstName} ${patient.lastName}`} />
                                <InfoItem icon={FaIdCard} label="Patient ID" value={patient.id} />
                                <InfoItem icon={FaCalendar} label="Date of Birth" value={patient.dateOfBirth} />
                                <InfoItem icon={FaUserCircle} label="Gender" value={patient.gender} />
                                <InfoItem icon={FaTint} label="Blood Type" value={patient.bloodType} valueColor="text-accent-danger" />
                                <InfoItem icon={FaCalendar} label="Registration Date" value={patient.registrationDate} />
                                <InfoItem icon={FaEnvelope} label="Email Address" value={patient.email} />
                                <InfoItem icon={FaPhone} label="Phone Number" value={patient.phone} />
                                <div className="md:col-span-2">
                                    <InfoItem icon={FaMapMarkerAlt} label="Address" value={patient.address} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'medical' && (
                            <div className="space-y-6">
                                    {/* Allergies Card */}
                                    <div className={`rounded-xl p-6 border-2 ${
                                        patient.allergies
                                            ? 'bg-main bg-opacity-5 border border-color'
                                            : 'bg-main border border-color'
                                    }`}>
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={`p-3 rounded-lg ${
                                                patient.allergies
                                                    ? 'bg-accent-danger bg-opacity-10'
                                                    : 'bg-accent-success bg-opacity-10'
                                            }`}>
                                                <FaAllergies className={patient.allergies ? 'text-ondark' : 'text-ondark'} size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-heading font-semibold text-lg mb-1">Allergies</h3>
                                                {patient.allergies ? (
                                                    <div className="space-y-2 mt-3">
                                                        {patient.allergies.split(',').map((allergy, index) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <FaExclamationTriangle className="text-accent-danger flex-shrink-0" size={14} />
                                                                <span className="text-body font-medium">{allergy.trim()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-muted mt-2">No known allergies</p>
                                                )}
                                            </div>
                                        </div>
                                </div>

                                {/* Medical Conditions */}
                                <div className="bg-main rounded-xl p-6 border border-color">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                            <FaNotesMedical className="text-ondark" size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-heading font-semibold text-lg mb-1">Medical Conditions</h3>
                                            {patient.conditions ? (
                                                <div className="mt-3 space-y-2">
                                                    {patient.conditions.split(',').map((condition, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <span className="text-accent-warning mt-1">•</span>
                                                            <span className="text-body">{condition.trim()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted mt-2">No recorded medical conditions</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Current Medications */}
                                <div className="bg-main rounded-xl p-6 border border-color">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                            <FaPills className="text-ondark" size={24}/>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-heading font-semibold text-lg mb-1">Current Medications</h3>
                                            {patient.medications ? (
                                                <div className="mt-3 space-y-2">
                                                    {patient.medications.split(',').map((medication, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <FaPills className="text-accent-sky mt-1 flex-shrink-0" size={14} />
                                                            <span className="text-body">{medication.trim()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted mt-2">No current medications</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'emergency' && (
                            <div className="space-y-6">
                                {/* Emergency Contact Alert */}
                                <div className="bg-main bg-opacity-5 border-2 border-accent-danger rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-accent-danger bg-opacity-10 p-3 rounded-lg">
                                            <FaUserInjured className="text-ondark" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-heading font-semibold text-lg">Emergency Contact Information</h3>
                                            <p className="text-muted text-sm">Contact in case of medical emergency</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                        <div className="bg-card rounded-lg p-4">
                                            <p className="text-muted text-xs mb-2 flex items-center gap-2">
                                                <FaUser size={12} />
                                                <span>Contact Name</span>
                                            </p>
                                            <p className="text-heading font-semibold text-lg">
                                                {patient.emergencyName || 'Not provided'}
                                            </p>
                                        </div>

                                        <div className="bg-card rounded-lg p-4">
                                            <p className="text-muted text-xs mb-2 flex items-center gap-2">
                                                <FaUserCircle size={12} />
                                                <span>Relationship</span>
                                            </p>
                                            <p className="text-heading font-semibold text-lg">
                                                {patient.emergencyRelationship || 'Not provided'}
                                            </p>
                                        </div>

                                        <div className="bg-card rounded-lg p-4">
                                            <p className="text-muted text-xs mb-2 flex items-center gap-2">
                                                <FaPhone size={12} />
                                                <span>Phone Number</span>
                                            </p>
                                            <p className="text-heading font-semibold text-lg">
                                                {patient.emergencyContact || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Emergency Info */}
                                <div className="bg-main rounded-xl p-6 border border-color">
                                    <h3 className="text-heading font-semibold text-lg mb-4 flex items-center gap-2">
                                        <FaStethoscope className="text-primary" />
                                        <span>Critical Medical Information</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                                            <FaTint className="text-accent-danger" size={20} />
                                            <div>
                                                <p className="text-muted text-xs">Blood Type</p>
                                                <p className="text-heading font-semibold">{patient.bloodType}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                                            <FaAllergies className="text-accent-danger" size={20} />
                                            <div>
                                                <p className="text-muted text-xs">Known Allergies</p>
                                                <p className="text-heading font-semibold">{patient.allergies || 'None'}</p>
                                            </div>
                                        </div>
                                    </div>
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
                <p className={`${valueColor} font-medium break-words`}>{value || 'Not provided'}</p>
            </div>
        </div>
    );
}