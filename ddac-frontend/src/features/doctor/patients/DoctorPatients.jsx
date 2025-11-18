import DoctorSidebar from "../components/DoctorSidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorPatients() {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName") || "Dr. Sarah Wilson";
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        // Mock data for patients
        const mockPatients = [
            {
                id: 1,
                patientId: "#1247",
                name: "John Smith",
                age: 45,
                gender: "Male",
                bloodType: "O+",
                phone: "+1 234 567 8900",
                email: "john.smith@email.com",
                lastVisit: "2025-11-15",
                nextAppointment: "2025-11-20",
                status: "active",
                condition: "Hypertension"
            },
            {
                id: 2,
                patientId: "#1156",
                name: "Sarah Johnson",
                age: 32,
                gender: "Female",
                bloodType: "A+",
                phone: "+1 234 567 8901",
                email: "sarah.j@email.com",
                lastVisit: "2025-11-10",
                nextAppointment: "2025-11-25",
                status: "active",
                condition: "Regular Checkup"
            },
            {
                id: 3,
                patientId: "#1089",
                name: "Mike Davis",
                age: 58,
                gender: "Male",
                bloodType: "B+",
                phone: "+1 234 567 8902",
                email: "mike.d@email.com",
                lastVisit: "2025-11-12",
                nextAppointment: "2025-11-22",
                status: "active",
                condition: "Diabetes"
            },
            {
                id: 4,
                patientId: "#1302",
                name: "Emily Brown",
                age: 28,
                gender: "Female",
                bloodType: "AB+",
                phone: "+1 234 567 8903",
                email: "emily.b@email.com",
                lastVisit: "2025-11-08",
                nextAppointment: "2025-11-28",
                status: "active",
                condition: "Allergies"
            },
            {
                id: 5,
                patientId: "#0987",
                name: "Robert Wilson",
                age: 62,
                gender: "Male",
                bloodType: "O-",
                phone: "+1 234 567 8904",
                email: "robert.w@email.com",
                lastVisit: "2025-10-30",
                nextAppointment: null,
                status: "inactive",
                condition: "Post-surgery"
            }
        ];

        // Simulate API call
        setTimeout(() => {
            setPatients(mockPatients);
            setLoading(false);
        }, 800);
    }, []);

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-gray-100 text-gray-800",
            critical: "bg-red-100 text-red-800"
        };

        return `px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;
    };

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || patient.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

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
                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search patients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            

                            {/* User Profile */}
                            <div className="flex items-center space-x-3 cursor-pointer group">
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
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Patient Records</h2>
                                <div className="flex items-center space-x-3">
                                    <select 
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm">
                                        <span className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span>Add Patient</span>
                                        </span>
                                    </button>
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
                                            Last Visit
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Condition
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
                                                    {patient.bloodType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {patient.lastVisit}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {patient.condition}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={getStatusBadge(patient.status)}>
                                                    {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">
                                                    View
                                                </button>
                                                <button className="text-green-600 hover:text-green-800 font-medium">
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
        </div>
    );
}
