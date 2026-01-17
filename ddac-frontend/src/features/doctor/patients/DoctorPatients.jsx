import DoctorSidebar from "../components/DoctorSidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOutDialog } from "../../customer/components/LogoutDialog";
import patientService from "./patientService";
import appointmentService from "../appointments/appointmentService";

export default function DoctorPatients() {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName");
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterGender, setFilterGender] = useState("all");
    const [filterBloodType, setFilterBloodType] = useState("all");
    const [showDropdown, setShowDropdown] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [modalView, setModalView] = useState('details'); // 'details' or 'records'

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const [patientData, appointmentData] = await Promise.all([
                patientService.getDoctorPatients(),
                appointmentService.getDoctorAppointments()
            ]);
            
            // Calculate age from dateOfBirth, add full name, and determine last visit from appointments
            const patientsWithDetails = patientData.map(patient => {
                // Find the most recent completed appointment for this patient
                const patientAppointments = appointmentData.filter(
                    apt => apt.patientId === patient.id && apt.status === 'Completed'
                );
                
                // Sort by date descending and get the most recent
                const sortedAppointments = patientAppointments.sort((a, b) => 
                    new Date(b.appointmentDate) - new Date(a.appointmentDate)
                );
                
                const lastVisitDate = sortedAppointments.length > 0 
                    ? sortedAppointments[0].appointmentDate 
                    : null;
                
                return {
                    ...patient,
                    name: `${patient.firstName} ${patient.lastName}`,
                    age: calculateAge(patient.dateOfBirth),
                    status: 'active', // Default status
                    lastVisitDate: lastVisitDate
                };
            });
            
            setPatients(patientsWithDetails);
        } catch (error) {
            console.error('Error fetching patients:', error);
            alert('Failed to load patients. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 0;
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSearch = async (term) => {
        setSearchTerm(term);
        if (term.trim() === '') {
            fetchPatients();
        } else {
            try {
                const [results, appointmentData] = await Promise.all([
                    patientService.searchPatients(term),
                    appointmentService.getDoctorAppointments()
                ]);
                
                const patientsWithDetails = results.map(patient => {
                    // Find the most recent completed appointment for this patient
                    const patientAppointments = appointmentData.filter(
                        apt => apt.patientId === patient.id && apt.status === 'Completed'
                    );
                    
                    const sortedAppointments = patientAppointments.sort((a, b) => 
                        new Date(b.appointmentDate) - new Date(a.appointmentDate)
                    );
                    
                    const lastVisitDate = sortedAppointments.length > 0 
                        ? sortedAppointments[0].appointmentDate 
                        : null;
                    
                    return {
                        ...patient,
                        name: `${patient.firstName} ${patient.lastName}`,
                        age: calculateAge(patient.dateOfBirth),
                        status: 'active',
                        lastVisitDate: lastVisitDate
                    };
                });
                
                setPatients(patientsWithDetails);
            } catch (error) {
                console.error('Error searching patients:', error);
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-gray-100 text-gray-800",
            critical: "bg-red-100 text-red-800"
        };

        return `px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;
    };

    const handleViewPatient = (patient, view = 'details') => {
        setSelectedPatient(patient);
        setModalView(view);
        setShowPatientModal(true);
    };

    const closeModal = () => {
        setShowPatientModal(false);
        setSelectedPatient(null);
    };

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            patient.patientId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || patient.status === filterStatus;
        const matchesGender = filterGender === "all" || patient.gender?.toLowerCase() === filterGender.toLowerCase();
        const matchesBloodType = filterBloodType === "all" || patient.bloodGroup === filterBloodType;
        return matchesSearch && matchesStatus && matchesGender && matchesBloodType;
    });

    const confirmedLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("userName");
        localStorage.removeItem("role");
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
                            <p className="mt-4 text-gray-600">Loading patients...</p>
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
                            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                            <p className="text-gray-500 text-sm">Manage patient records and medical history</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* User Profile */}
                                {/* </svg> */}
                            {/* </div> */} 
                            

                            {/* User Profile */}
                            <div className="relative">
                                <div 
                                    className="flex items-center space-x-3 cursor-pointer group"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${userName}&background=4f46e5&color=fff`}
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
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setLogoutDialogOpen(true);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
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
                                    <p className="text-gray-500 text-sm mb-1">Total Patients</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{patients.length}</h3>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Active Patients</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{patients.filter(p => p.status === 'active').length}</h3>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">New This Month</p>
                                    <h3 className="text-2xl font-bold text-gray-900">12</h3>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Critical Cases</p>
                                    <h3 className="text-2xl font-bold text-gray-900">3</h3>
                                </div>
                                <div className="p-3 bg-red-50 rounded-lg">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Patients Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Patient Records</h2>
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search patients..."
                                            value={searchTerm}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                        />
                                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <select 
                                        value={filterGender}
                                        onChange={(e) => setFilterGender(e.target.value)}
                                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Genders</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    <select 
                                        value={filterBloodType}
                                        onChange={(e) => setFilterBloodType(e.target.value)}
                                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Blood Types</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                    <select 
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
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
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Age/Gender
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Blood Type
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
                                    {filteredPatients.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <span className="text-blue-600 font-semibold text-sm">
                                                                {patient.name.split(' ').map(n => n[0]).join('')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {patient.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {patient.patientId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{patient.phone}</div>
                                                <div className="text-sm text-gray-500">{patient.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{patient.age} years</div>
                                                <div className="text-sm text-gray-500">{patient.gender}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                                                    {patient.bloodGroup || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={getStatusBadge(patient.status)}>
                                                    {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button 
                                                    onClick={() => handleViewPatient(patient, 'details')}
                                                    className="text-blue-600 hover:text-blue-800 font-medium mr-3 transition-colors"
                                                >
                                                    View
                                                </button>
                                                <button 
                                                    onClick={() => handleViewPatient(patient, 'records')}
                                                    className="text-green-600 hover:text-green-800 font-medium transition-colors"
                                                >
                                                    Records
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredPatients.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="mt-4 text-gray-500">No patients found matching your search.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Patient Details Modal */}
            {showPatientModal && selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-white font-semibold text-lg">
                                        {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
                                    <p className="text-blue-100 text-sm">{selectedPatient.patientId}</p>
                                </div>
                            </div>
                            <button onClick={closeModal} className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Tabs */}
                        <div className="flex border-b">
                            <button
                                onClick={() => setModalView('details')}
                                className={`px-6 py-3 font-medium transition-colors ${
                                    modalView === 'details' 
                                        ? 'text-blue-600 border-b-2 border-blue-600' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Patient Details
                            </button>
                            <button
                                onClick={() => setModalView('records')}
                                className={`px-6 py-3 font-medium transition-colors ${
                                    modalView === 'records' 
                                        ? 'text-blue-600 border-b-2 border-blue-600' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Medical Records
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {modalView === 'details' ? (
                                <div className="space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-500">Full Name</label>
                                                <p className="text-gray-900 font-medium">{selectedPatient.name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Patient ID</label>
                                                <p className="text-gray-900 font-medium">{selectedPatient.patientId}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Age</label>
                                                <p className="text-gray-900 font-medium">{selectedPatient.age} years</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Gender</label>
                                                <p className="text-gray-900 font-medium">{selectedPatient.gender}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Blood Type</label>
                                                <p className="text-gray-900 font-medium">{selectedPatient.bloodGroup || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Date of Birth</label>
                                                <p className="text-gray-900 font-medium">
                                                    {new Date(selectedPatient.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-500">Phone Number</label>
                                                <p className="text-gray-900 font-medium">{selectedPatient.phone}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Email Address</label>
                                                <p className="text-gray-900 font-medium">{selectedPatient.email}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-sm text-gray-500">Address</label>
                                                <p className="text-gray-900 font-medium">{selectedPatient.address || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visit Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-500">Last Visit</label>
                                                <p className="text-gray-900 font-medium">
                                                    {selectedPatient.lastVisitDate 
                                                        ? new Date(selectedPatient.lastVisitDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
                                                        : 'No visits yet'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500">Status</label>
                                                <p>
                                                    <span className={getStatusBadge(selectedPatient.status)}>
                                                        {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Records</h3>
                                    
                                    {/* Medical History */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-700 mb-2">Medical History</h4>
                                        <p className="text-sm text-gray-600">
                                            {selectedPatient.medicalHistory || 'No medical history recorded yet.'}
                                        </p>
                                    </div>

                                    {/* Allergies */}
                                    <div className="bg-red-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-red-700 mb-2">Allergies</h4>
                                        <p className="text-sm text-red-600">
                                            {selectedPatient.allergies || 'No known allergies'}
                                        </p>
                                    </div>

                                    {/* Current Medications */}
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-blue-700 mb-2">Current Medications</h4>
                                        <p className="text-sm text-blue-600">
                                            {selectedPatient.medications || 'No current medications'}
                                        </p>
                                    </div>

                                    {/* Previous Diagnoses */}
                                    <div className="bg-yellow-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-yellow-700 mb-2">Previous Diagnoses</h4>
                                        <p className="text-sm text-yellow-600">
                                            {selectedPatient.diagnoses || 'No previous diagnoses on record'}
                                        </p>
                                    </div>

                                    {/* Notes */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-700 mb-2">Additional Notes</h4>
                                        <p className="text-sm text-gray-600">
                                            {selectedPatient.notes || 'No additional notes available'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => navigate(`/doctorAppointments?patientId=${selectedPatient.id}`)}
                                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                View Appointments
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <LogOutDialog
                open={logoutDialogOpen}
                onOpenChange={setLogoutDialogOpen}
                onConfirmLogout={confirmedLogout}
            />
        </div>
    );
}
