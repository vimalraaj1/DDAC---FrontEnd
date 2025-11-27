import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft, FaEdit, FaTrash, FaUserTie, FaEnvelope, FaPhone,
    FaIdCard, FaCalendar, FaMapMarkerAlt, FaBriefcase, FaDollarSign,
    FaTint, FaHospital, FaUserCircle, FaCheckCircle, FaClock, FaUsers
} from 'react-icons/fa';

export default function ViewStaff() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('personal');

    // Mock data - Replace with actual API call
    const staff = {
        id: id || 'ST000006',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@hospital.com',
        phone: '+60 12-111 2222',
        role: 'Nurse',
        dateOfBirth: '1990-03-15',
        gender: 'Female',
        address: '456 Staff Avenue, Petaling Jaya, Selangor, Malaysia 46000',
        yearsOfExperience: '8',
        department: 'Emergency',
        joiningDate: '2016-05-10',
        salary: '5000',
        emergencyContact: '+60 12-999 8888',
        bloodGroup: 'A+',
        status: 'active',
        shiftsThisMonth: 22,
        overtimeHours: 15,
        performanceRating: 4.6
    };

    const handleEdit = () => {
        navigate(`/managerEditStaff/${id}`);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${staff.firstName} ${staff.lastName}?`)) {
            console.log('Delete staff:', id);
            navigate('/managerStaffInfo');
        }
    };

    const handleBack = () => {
        navigate('/managerStaffInfo');
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: FaUserCircle },
        { id: 'employment', label: 'Employment', icon: FaBriefcase },
        { id: 'performance', label: 'Performance', icon: FaUsers }
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
                        <span>Back to Staff</span>
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
                                    {staff.firstName.charAt(0).toUpperCase()}{staff.lastName.charAt(0).toUpperCase()}
                                </div>
                                <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-card ${
                                    staff.status === 'active' ? 'bg-accent-success' : 'bg-accent-warning'
                                }`}></div>
                            </div>

                            {/* Staff Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-heading mb-2">{staff.firstName} {staff.lastName}</h1>
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary bg-opacity-10 text-ondark rounded-full text-sm font-medium">
                                                <FaUserTie size={14} />
                                                  {staff.role}
                                            </span>
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent-sky bg-opacity-10 text-ondark rounded-full text-sm font-medium">
                                                <FaHospital size={14} />
                                                {staff.department}
                                            </span>
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                                staff.status === 'active'
                                                    ? 'bg-accent-success bg-opacity-10 text-ondark'
                                                    : 'bg-accent-warning bg-opacity-10 text-ondark'
                                            }`}>
                                            {staff.status === 'active' ? (
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
                                        <p className="text-muted text-sm">Staff ID: {staff.id}</p>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="bg-main rounded-lg p-4">
                                        <p className="text-muted text-xs mb-1">Experience</p>
                                        <p className="text-heading text-2xl font-bold">{staff.yearsOfExperience} yrs</p>
                                    </div>
                                    <div className="bg-main rounded-lg p-4">
                                        <p className="text-muted text-xs mb-1">Shifts (Month)</p>
                                        <p className="text-heading text-2xl font-bold">{staff.shiftsThisMonth}</p>
                                    </div>
                                    <div className="bg-main rounded-lg p-4">
                                        <p className="text-muted text-xs mb-1">Rating</p>
                                        <p className="text-heading text-2xl font-bold">{staff.performanceRating}</p>
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
                                <InfoItem icon={FaUserTie} label="Full Name" value={`${staff.firstName} ${staff.lastName}`} />
                                <InfoItem icon={FaIdCard} label="Staff ID" value={staff.id} />
                                <InfoItem icon={FaCalendar} label="Date of Birth" value={staff.dateOfBirth} />
                                <InfoItem icon={FaUserCircle} label="Gender" value={staff.gender} />
                                <InfoItem icon={FaTint} label="Blood Group" value={staff.bloodGroup} />
                                <InfoItem icon={FaEnvelope} label="Email Address" value={staff.email} />
                                <InfoItem icon={FaPhone} label="Phone Number" value={staff.phone} />
                                <InfoItem icon={FaPhone} label="Emergency Contact" value={staff.emergencyContact} />
                                <div className="md:col-span-2">
                                    <InfoItem icon={FaMapMarkerAlt} label="Address" value={staff.address} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'employment' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InfoItem icon={FaUserTie} label="Role/Position" value={staff.role} />
                                <InfoItem icon={FaHospital} label="Department" value={staff.department} />
                                <InfoItem icon={FaBriefcase} label="Years of Experience" value={`${staff.yearsOfExperience} years`} />
                                <InfoItem icon={FaCalendar} label="Joining Date" value={staff.joiningDate} />
                                <InfoItem icon={FaDollarSign} label="Monthly Salary" value={`RM ${parseInt(staff.salary).toLocaleString()}`} />
                                <InfoItem
                                    icon={FaCheckCircle}
                                    label="Employment Status"
                                    value={staff.status === 'active' ? 'Active' : 'On Leave'}
                                    valueColor={staff.status === 'active' ? 'text-accent-success' : 'text-accent-warning'}
                                />
                            </div>
                        )}

                        {activeTab === 'performance' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Performance Metrics Cards */}
                                    <div className="bg-main rounded-xl p-6 border border-color">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                                <FaCheckCircle className="text-ondark" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-muted text-xs">Performance Rating</p>
                                                <p className="text-heading text-2xl font-bold">{staff.performanceRating}/5.0</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-main rounded-full h-2 mt-2">
                                            <div
                                                className="bg-accent-success h-2 rounded-full"
                                                style={{ width: `${(staff.performanceRating / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="bg-main rounded-xl p-6 border border-color">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                                <FaClock className="text-ondark" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-muted text-xs">Shifts This Month</p>
                                                <p className="text-heading text-2xl font-bold">{staff.shiftsThisMonth}</p>
                                            </div>
                                        </div>
                                        <p className="text-muted text-xs mt-2">Out of 24 scheduled shifts</p>
                                    </div>

                                    <div className="bg-main rounded-xl p-6 border border-color">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                                <FaClock className="text-ondark" size={20} />
                                            </div>
                                            <div>
                                                <p className="text-muted text-xs">Overtime Hours</p>
                                                <p className="text-heading text-2xl font-bold">{staff.overtimeHours}h</p>
                                            </div>
                                        </div>
                                        <p className="text-muted text-xs mt-2">This month</p>
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