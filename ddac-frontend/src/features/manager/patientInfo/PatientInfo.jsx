import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaEye, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function PatientInfo() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBloodType, setFilterBloodType] = useState('all');
    const navigate = useNavigate();

    // Sample patient data (replace with API call later)
    const patients = [
        {
            id: 'PT000001',
            firstName: "Ahmad",
            lastName: "Ibrahim",
            dateOfBirth: "1990-03-15",
            gender: "male",
            phone: "+60 12-345 6789",
            email: "ahmad.ibrahim@email.com",
            bloodType: "O+",
            conditions: "Hypertension",
            lastVisit: "2024-11-15",
        },
        {
            id: 'PT000002',
            firstName: "Siti",
            lastName: "Abdullah",
            dateOfBirth: "1985-07-22",
            gender: "female",
            phone: "+60 13-456 7890",
            email: "siti.abdullah@email.com",
            bloodType: "A+",
            conditions: "Diabetes",
            lastVisit: "2024-11-18",
        },
        {
            id: 'PT000003',
            firstName: "Raj",
            lastName: "Kumar",
            dateOfBirth: "1978-11-08",
            gender: "male",
            phone: "+60 14-567 8901",
            email: "raj.kumar@email.com",
            bloodType: "B+",
            conditions: "None",
            lastVisit: "2024-10-30",
        },
        {
            id: 'PT000004',
            firstName: "Mei",
            lastName: "Wong",
            dateOfBirth: "1995-05-12",
            gender: "female",
            phone: "+60 15-678 9012",
            email: "mei.wong@email.com",
            bloodType: "AB+",
            conditions: "Asthma",
            lastVisit: "2024-11-20",
        },
        {
            id: 'PT000005',
            firstName: "Hassan",
            lastName: "Ali",
            dateOfBirth: "1982-09-25",
            gender: "male",
            phone: "+60 16-789 0123",
            email: "hassan.ali@email.com",
            bloodType: "O-",
            conditions: "Hypertension, Diabetes",
            lastVisit: "2024-09-15",
        },
        {
            id: 'PT000006',
            firstName: "Lakshmi",
            lastName: "Devi",
            dateOfBirth: "1992-02-18",
            gender: "female",
            phone: "+60 17-890 1234",
            email: "lakshmi.devi@email.com",
            bloodType: "A-",
            conditions: "None",
            lastVisit: "2024-11-22",
        }
    ];

    // Get unique blood types for filter
    const bloodTypes = [...new Set(patients.map(p => p.bloodType))];

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Filter patients
    const filteredPatients = patients.filter(patient => {
        const matchesSearch =
            patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBloodType = filterBloodType === 'all' || patient.bloodType === filterBloodType;
        return matchesSearch && matchesBloodType;
    });

    const handleView = (id) => {
        console.log('View patient:', id);
        navigate(`/managerViewPatient/${id}`);
    };

    const handleEdit = (id) => {
        console.log('Edit patient:', id);
        navigate(`/managerEditPatient/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this patient record?')) {
            console.log('Delete patient:', id);
            // Call delete API
        }
    };

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-heading">Patient Information</h1>
                    <p className="text-muted mt-1">Manage and view all patient records</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaUser size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{patients.length}</h3>
                                <p className="text-muted text-sm">Total Patients</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                <FaUser size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">
                                    {patients.filter(p => p.conditions && p.conditions !== 'None').length}
                                </h3>
                                <p className="text-muted text-sm">With Conditions</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                <FaUser size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{bloodTypes.length}</h3>
                                <p className="text-muted text-sm">Blood Types</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-card rounded-xl shadow-soft p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 min-w-0">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, ID, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg
                                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                             text-body placeholder-muted"
                                />
                            </div>
                        </div>

                        {/* Filter */}
                        <div className="flex gap-4 flex-shrink-4">
                            <select
                                value={filterBloodType}
                                onChange={(e) => setFilterBloodType(e.target.value)}
                                className="px-4 py-2 border border-input rounded-lg
                                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                         text-body bg-card"
                            >
                                <option value="all">All Blood Types</option>
                                {bloodTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            <button
                                className="btn-primary whitespace-nowrap"
                                onClick={() => navigate("/managerAddNewPatient")}
                            >
                                + Add Patient
                            </button>
                        </div>
                    </div>
                </div>

                {/* Patients Table */}
                <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full table-fixed">
                            <thead className="bg-primary border-b border-color">
                            <tr>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Patient
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Age/Gender
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm hidden md:table-cell break-all">
                                    Contact
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Blood Type
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Conditions
                                </th>
                                <th className="text-center py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient, index) => (
                                    <tr
                                        key={patient.id}
                                        className={`hover:bg-main border-t border-color transition-colors ${
                                            index % 2 === 0 ? '' : 'bg-main bg-opacity-30'
                                        }`}
                                    >
                                        <td className="py-4 px-4 md:px-6 align-top">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-primary text-ondark flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                                    {patient.firstName.charAt(0).toUpperCase()}{patient.lastName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-heading text-sm font-bold">
                                                        {`${patient.firstName} ${patient.lastName}`}
                                                    </p>
                                                    <p className="text-muted text-xs break-all">{patient.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-heading font-semibold">{calculateAge(patient.dateOfBirth)} yrs</p>
                                                <p className="text-muted text-xs capitalize">{patient.gender}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden md:table-cell md:min-w-[200px]">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-body text-sm">
                                                    <FaEnvelope className="text-muted flex-shrink-0" size={12} />
                                                    <span className="text-xs break-all">{patient.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-body text-sm">
                                                    <FaPhone className="text-muted flex-shrink-0" size={12} />
                                                    <span className="text-xs">{patient.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-2 bg-accent-danger bg-opacity-10 
                                                               text-ondark px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                                                    {patient.bloodType}
                                                </span>
                                        </td>
                                        <td className="py-4 px-6">
                                                <span className={`text-sm ${
                                                    patient.conditions === 'None'
                                                        ? 'text-accent-success font-medium break-all'
                                                        : 'text-accent-warning break-all'
                                                }`}>
                                                    {patient.conditions}
                                                </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2 overflow-x-hidden lg:overflow-x-visible">
                                                <button
                                                    onClick={() => handleView(patient.id)}
                                                    className="p-2 hover:bg-accent-sky hover:bg-opacity-10 rounded-lg
                                                                 text-accent-sky transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye size={22} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(patient.id)}
                                                    className="p-2 hover:bg-primary hover:bg-opacity-10 rounded-lg
                                                                 text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={22} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(patient.id)}
                                                    className="p-2 hover:bg-accent-danger hover:bg-opacity-10 rounded-lg
                                                                 text-accent-danger transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash size={22} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <FaUser size={48} className="text-muted opacity-50" />
                                            <p className="text-muted text-lg">No patients found</p>
                                            <p className="text-muted text-sm">Try adjusting your search or filter</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-muted text-sm">
                        Showing <span className="font-semibold text-heading">{filteredPatients.length}</span> of{' '}
                        <span className="font-semibold text-heading">{patients.length}</span> patients
                    </p>
                </div>
            </div>
        </Layout>
    );
}