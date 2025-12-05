import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft, FaEdit, FaTrash, FaUserTie, FaEnvelope, FaPhone,
    FaIdCard, FaCalendar, FaMapMarkerAlt, FaBriefcase, FaDollarSign,
    FaTint, FaHospital, FaUserCircle, FaCheckCircle, FaClock, FaUsers
} from 'react-icons/fa';
import {deleteStaff, getStaffById} from "../../../services/staffManagementService.js";
import {averageStaffRating} from "../../../services/commentManagementService.js";

export default function ViewStaff() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('personal');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState(null);
    const [averageRating, setAverageRating] = useState(0.00);

    useEffect(() => {
        getStaffInfo();
    }, []);

    const getStaffInfo = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getStaffById(id);
            console.log('Fetched doctor:', data);
            if (data && typeof data === 'object') {
                setStaff(data);
                const staffId = data.id;
                let averageRating = 0.00;
                try {
                    const rating = await averageStaffRating(staffId);
                    averageRating = rating;
                } catch (err) {
                    console.error(`Error fetching average rating for staff ${staffId}:`, err);
                }
                setAverageRating(averageRating);
            } else {
                throw new Error('Staff not found or invalid data format.');
            }
        }
        catch (err) {
            console.error('Error fetching staff:', err);
            setError(err.message || 'Failed to fetch staff');
            setStaff(null);
        } finally {
            setLoading(false);
        }
    }

    const getRatingColor = (rating) => {
        if (!rating || rating === 0) {
            return {
                bgColor: 'bg-muted', // Gray/Neutral for no rating
                barColor: 'bg-muted'
            };
        }
        if (rating < 2.5) {
            return {
                bgColor: 'bg-accent-danger',
                barColor: 'bg-accent-danger'
            };
        }
        if (rating >= 2.5 && rating < 4.0) {
            return {
                bgColor: 'bg-accent-warning',
                barColor: 'bg-accent-warning'
            };
        }
        return {
            bgColor: 'bg-accent-success',
            barColor: 'bg-accent-success'
        };
    };
    
    const handleEdit = () => {
        navigate(`/managerEditStaff/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff?')) {
            try {
                await deleteStaff(id);
                console.log('Delete staff successful:', id);
                alert('Staff record deleted successfully');
                navigate(`/managerStaffInfo`);
            } catch (err) {
                console.error('Error deleting staff:', err);
                alert('Failed to delete staff');
            }
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

    // Loading state
    if (loading) {
        return (
            <Layout role="manager">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted">Loading staff...</p>
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
                        <FaUserTie size={64} className="text-accent-danger mx-auto mb-4" />
                        <h2 className="text-heading text-xl font-bold mb-2">Error Loading Staff</h2>
                        <p className="text-muted mb-4">{error}</p>
                        <button
                            onClick={getStaffInfo}
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
                                    {staff.firstName.charAt(0).toUpperCase()}{staff.lastName.charAt(0).toUpperCase()}
                                </div>
                                <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-card ${
                                    staff.status.toLowerCase() === 'active' ? 'bg-accent-success' : 'bg-accent-warning'
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
                                                staff.status.toLowerCase() === 'active'
                                                    ? 'bg-accent-success bg-opacity-10 text-ondark'
                                                    : 'bg-accent-warning bg-opacity-10 text-ondark'
                                            }`}>
                                            {staff.status.toLowerCase() === 'active' ? (
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
                                    {/*<div className="bg-main rounded-lg p-4">*/}
                                    {/*    <p className="text-muted text-xs mb-1">Shifts (Month)</p>*/}
                                    {/*    <p className="text-heading text-2xl font-bold">{staff.shiftsThisMonth}</p>*/}
                                    {/*</div>*/}
                                    {/*<div className="bg-main rounded-lg p-4">*/}
                                    {/*    <p className="text-muted text-xs mb-1">Rating</p>*/}
                                    {/*    <p className="text-heading text-2xl font-bold">{staff.performanceRating}</p>*/}
                                    {/*</div>*/}
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
                                    value={staff.status.toLowerCase() === 'active' ? 'Active' : 'On Leave'}
                                    valueColor={staff.status.toLowerCase() === 'active' ? 'text-accent-success' : 'text-accent-warning'}
                                />
                            </div>
                        )}

                        {activeTab === 'performance' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Performance Metrics Cards */}
                                    {(() => {
                                        const colors = getRatingColor(averageRating);
                                        const ratingDisplay = averageRating?.toFixed(2) || 'N/A';
                                        const ratingPercentage = (averageRating / 5) * 100;

                                        return (
                                            /* Performance Metrics Card */
                                            <div className="bg-main rounded-xl p-6 border border-color">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`${colors.bgColor} bg-opacity-10 p-3 rounded-lg`}>
                                                        <FaCheckCircle className="text-ondark" size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-muted text-xs">Performance Rating</p>
                                                        <p className="text-heading text-2xl font-bold">{ratingDisplay}/5.0</p>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-main rounded-full h-2 mt-2">
                                                    <div
                                                        className={`${colors.barColor} h-2 rounded-full`}
                                                        style={{ width: `${ratingPercentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/*<div className="bg-main rounded-xl p-6 border border-color">*/}
                                    {/*    <div className="flex items-center gap-3 mb-3">*/}
                                    {/*        <div className="bg-primary bg-opacity-10 p-3 rounded-lg">*/}
                                    {/*            <FaClock className="text-ondark" size={20} />*/}
                                    {/*        </div>*/}
                                    {/*        <div>*/}
                                    {/*            <p className="text-muted text-xs">Shifts This Month</p>*/}
                                    {/*            <p className="text-heading text-2xl font-bold">{staff.shiftsThisMonth}</p>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*    <p className="text-muted text-xs mt-2">Out of 24 scheduled shifts</p>*/}
                                    {/*</div>*/}
                                    
                                    {/*<div className="bg-main rounded-xl p-6 border border-color">*/}
                                    {/*    <div className="flex items-center gap-3 mb-3">*/}
                                    {/*        <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">*/}
                                    {/*            <FaClock className="text-ondark" size={20} />*/}
                                    {/*        </div>*/}
                                    {/*        <div>*/}
                                    {/*            <p className="text-muted text-xs">Overtime Hours</p>*/}
                                    {/*            <p className="text-heading text-2xl font-bold">{staff.overtimeHours}h</p>*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*    <p className="text-muted text-xs mt-2">This month</p>*/}
                                    {/*</div>*/}
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