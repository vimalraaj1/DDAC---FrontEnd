import DoctorSidebar from "../components/DoctorSidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import appointmentService from "./appointmentService";
import consultationService from "../consultations/consultationService";
import commentService from "../services/commentService";

export default function DoctorAppointments() {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName") || "Dr. Sarah Wilson";
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showConsultationModal, setShowConsultationModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [consultationForm, setConsultationForm] = useState({
        feedbackNotes: '',
        prescriptions: [{ medication: '', dosage: '', frequency: '', duration: '' }]
    });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await appointmentService.getDoctorAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            // Show error message to user
            alert('Failed to load appointments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (appointmentId) => {
        try {
            await appointmentService.approveAppointment(appointmentId);
            // Refresh appointments list
            fetchAppointments();
            alert('Appointment approved successfully!');
        } catch (error) {
            console.error('Error approving appointment:', error);
            alert('Failed to approve appointment. Please try again.');
        }
    };

    const handleReject = async (appointmentId) => {
        const reason = prompt('Please enter rejection reason:');
        if (reason) {
            try {
                await appointmentService.rejectAppointment(appointmentId, reason);
                // Refresh appointments list
                fetchAppointments();
                alert('Appointment rejected successfully!');
            } catch (error) {
                console.error('Error rejecting appointment:', error);
                alert('Failed to reject appointment. Please try again.');
            }
        }
    };

    const handleViewAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setShowConsultationModal(true);
    };

    const addPrescriptionRow = () => {
        setConsultationForm({
            ...consultationForm,
            prescriptions: [...consultationForm.prescriptions, { medication: '', dosage: '', frequency: '', duration: '' }]
        });
    };

    const removePrescriptionRow = (index) => {
        const newPrescriptions = consultationForm.prescriptions.filter((_, i) => i !== index);
        setConsultationForm({ ...consultationForm, prescriptions: newPrescriptions });
    };

    const updatePrescription = (index, field, value) => {
        const newPrescriptions = [...consultationForm.prescriptions];
        newPrescriptions[index][field] = value;
        setConsultationForm({ ...consultationForm, prescriptions: newPrescriptions });
    };

    const handleSubmitConsultation = async () => {
        try {
            // Format prescriptions: "MedicationName Dosage, frequency, duration | ..."
            const prescriptionNotes = consultationForm.prescriptions
                .filter(p => p.medication && p.dosage)
                .map(p => `${p.medication}, ${p.dosage}, ${p.frequency}, ${p.duration}`)
                .join(' | ');

            const consultationData = {
                appointmentId: selectedAppointment.id,
                feedbackNotes: consultationForm.feedbackNotes,
                prescriptionNotes: prescriptionNotes
            };

            // Save consultation
            await consultationService.createConsultation(consultationData);

            // Create empty comment entry for patient feedback
            const userId = localStorage.getItem('userId') || 'DR000001';
            const commentData = {
                patientId: selectedAppointment.patientId,
                doctorId: userId,
                staffId: selectedAppointment.staffId || 'ST000001',
                appointmentId: selectedAppointment.id,
                commentText: null,
                doctorRating: null,
                staffRating: null,
                overallRating: null,
                time: new Date().toISOString(),
                tags: null
            };

            await commentService.createComment(commentData);

            alert('Consultation notes saved successfully! Patient can now provide feedback.');
            setShowConsultationModal(false);
            setConsultationForm({
                feedbackNotes: '',
                prescriptions: [{ medication: '', dosage: '', frequency: '', duration: '' }]
            });
            fetchAppointments();
        } catch (error) {
            console.error('Error saving consultation:', error);
            alert('Failed to save consultation notes. Please try again.');
        }
    };

    const closeModal = () => {
        setShowConsultationModal(false);
        setSelectedAppointment(null);
        setConsultationForm({
            feedbackNotes: '',
            prescriptions: [{ medication: '', dosage: '', frequency: '', duration: '' }]
        });
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            scheduled: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800"
        };

        return `px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <DoctorSidebar />
                <div className="flex-1">
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading appointments...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DoctorSidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                            <p className="text-gray-500 text-sm">Manage your patient appointments and schedule</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Search Bar
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div> */}
                            

                            {/* User Profile */}
                            <div className="relative">
                                <div 
                                    className="flex items-center space-x-3 cursor-pointer group"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <img
                                        src="https://ui-avatars.com/api/?name=Sarah+Wilson&background=4f46e5&color=fff"
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                                        <p className="text-xs text-gray-500">Doctor</p>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                navigate('/doctorProfile');
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span>Edit Profile</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                navigate('/doctorProfile');
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>View Profile</span>
                                        </button>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                navigate('/doctorSettings');
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>Settings</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {/* Logout Button */}
                            <button 
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-auto">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Total Today</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{appointments.length}</h3>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Completed</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{appointments.filter(a => a.status === 'completed').length}</h3>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Scheduled</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{appointments.filter(a => a.status === 'scheduled').length}</h3>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Cancelled</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{appointments.filter(a => a.status === 'cancelled').length}</h3>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointments Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
                                {/* <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm">
                                    <span className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Add Appointment</span>
                                    </span>
                                </button> */}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-blue-600 font-semibold text-sm">
                                                                {appointment.patientName.split(' ').map(n => n[0]).join('')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {appointment.patientName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {appointment.patientId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{appointment.date}</div>
                                                <div className="text-sm text-gray-500">{appointment.time}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{appointment.type}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{appointment.department}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={getStatusBadge(appointment.status)}>
                                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button 
                                                    onClick={() => handleViewAppointment(appointment)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                                                >
                                                    View
                                                </button>
                                                {appointment.status === 'scheduled' && (
                                                    <button className="text-green-600 hover:text-green-800 font-medium">
                                                        Complete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {appointments.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-4 text-gray-500">No appointments scheduled for today.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Consultation Modal */}
            {showConsultationModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Consultation Notes</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Patient: {selectedAppointment.patientName} | Date: {selectedAppointment.date} {selectedAppointment.time}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Appointment Details */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Appointment Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Appointment ID:</span>
                                        <span className="ml-2 font-medium">{selectedAppointment.id}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Patient ID:</span>
                                        <span className="ml-2 font-medium">{selectedAppointment.patientId}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Type:</span>
                                        <span className="ml-2 font-medium">{selectedAppointment.type}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Department:</span>
                                        <span className="ml-2 font-medium">{selectedAppointment.department}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Notes */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Feedback Notes
                                </label>
                                <textarea
                                    value={consultationForm.feedbackNotes}
                                    onChange={(e) => setConsultationForm({ ...consultationForm, feedbackNotes: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter feedback notes for the patient (e.g., lifestyle recommendations, follow-up advice...)"
                                />
                            </div>

                            {/* Prescriptions */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-semibold text-gray-900">
                                        Prescriptions
                                    </label>
                                    <button
                                        onClick={addPrescriptionRow}
                                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Add Medication</span>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {consultationForm.prescriptions.map((prescription, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                                            {consultationForm.prescriptions.length > 1 && (
                                                <button
                                                    onClick={() => removePrescriptionRow(index)}
                                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Medication Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={prescription.medication}
                                                        onChange={(e) => updatePrescription(index, 'medication', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        placeholder="e.g., Atorvastatin"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Dosage *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={prescription.dosage}
                                                        onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        placeholder="e.g., 20mg"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Frequency
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={prescription.frequency}
                                                        onChange={(e) => updatePrescription(index, 'frequency', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        placeholder="e.g., 1 tablet after dinner"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Duration
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={prescription.duration}
                                                        onChange={(e) => updatePrescription(index, 'duration', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        placeholder="e.g., 30 days"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Preview of formatted prescription */}
                            {consultationForm.prescriptions.some(p => p.medication && p.dosage) && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Prescription Preview:</h4>
                                    <p className="text-sm text-gray-700 font-mono">
                                        {consultationForm.prescriptions
                                            .filter(p => p.medication && p.dosage)
                                            .map(p => `${p.medication} ${p.dosage}, ${p.frequency}, ${p.duration}`)
                                            .join(' | ')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitConsultation}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                            >
                                Save Consultation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}