import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaEye, FaUserMd, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function DoctorInfo() { 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('all');
    const navigate = useNavigate();
    
    const doctors = [
        {
            id: 12457245972459724579,
            firstName: "Sarah",
            lastName: "Wilson",
            specialization: "Cardiology",
            email: "sarah.wilson@hospital.com",
            phone: "+60 12-345 6789",
            patients: 45,
            status: "active",
        },
        {
            id: 2,
            firstName: "Michael",
            lastName: "Chen",
            specialization: "Neurology",
            email: "michael.chen@hospital.com",
            phone: "+60 12-345 6790",
            patients: 38,
            status: "active",
        },
        {
            id: 3,
            firstName: "Emily",
            lastName: "Rodriguez",
            specialization: "Pediatrics",
            email: "emily.rodriguez@hospital.com",
            phone: "+60 12-345 6791",
            patients: 52,
            status: "active",
        },
        {
            id: 4,
            firstName: "James",
            lastName: "Kumar",
            specialization: "Orthopedics",
            email: "james.kumar@hospital.com",
            phone: "+60 12-345 6792",
            patients: 41,
            status: "on-leave",
        },
        {
            id: 5,
            firstName: "Lisa",
            lastName: "Thompson",
            specialization: "Dermatology",
            email: "lisa.thompson@hospital.com",
            phone: "+60 12-345 6793",
            patients: 35,
            status: "active",
        },
        {
            id: 6,
            firstName: "Ahmed",
            lastName: "Hassan",
            specialization: "Cardiology",
            email: "ahmed.hassan@hospital.com",
            phone: "+60 12-345 6794",
            patients: 48,
            status: "active",
        },
    ];
    
    const getDoctors = async () => {
        
    }

    // Get unique specialties for filter
    const specialties = [...new Set(doctors.map(doc => doc.specialization))];

    // Filter doctors
    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = filterSpecialty === 'all' || doctor.specialty === filterSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    const handleView = (id) => {
        console.log('View doctor:', id);
        navigate(`/managerViewDoctor/${id}`);
    };

    const handleEdit = (id) => {
        console.log('Edit doctor:', id);
        navigate(`/managerEditDoctor/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            console.log('Delete doctor:', id);
            // Call delete API
        }
    };

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-heading">Doctors Information</h1>
                    <p className="text-muted mt-1">Manage and view all doctor records</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl shadow-soft p-6 ">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaUserMd size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{doctors.length}</h3>
                                <p className="text-muted text-sm">Total Doctors</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6 ">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                <FaUserMd size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">
                                    {doctors.filter(d => d.status === 'active').length}
                                </h3>
                                <p className="text-muted text-sm">Active Doctors</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6 ">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                <FaUserMd size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">
                                    {doctors.filter(d => d.status === 'on-leave').length}
                                </h3>
                                <p className="text-muted text-sm">On Leave</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6 ">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                <FaUserMd size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{specialties.length}</h3>
                                <p className="text-muted text-sm">Specialties</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-card rounded-xl shadow-soft p-6  mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 min-w-0">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or specialization..."
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
                                value={filterSpecialty}
                                onChange={(e) => setFilterSpecialty(e.target.value)}
                                className="px-4 py-2 border border-input rounded-lg
                                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                         text-body bg-card"
                            >
                                <option value="all">All Specialization</option>
                                {specialties.map(specialty => (
                                    <option key={specialty} value={specialty}>{specialty}</option>
                                ))}
                            </select>
                            {/* Add New Doctor */}
                            <button className="btn-primary whitespace-nowrap"
                                onClick={() => navigate("/managerAddNewDoctor")}>
                                + Add Doctor
                            </button>
                        </div>
                    </div>
                </div>

                {/* Doctors Table */}
                <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                    <div className="overflow-x-auto"> 
                        <table className="w-full min-w-full table-fixed">
                            <thead className="bg-primary border-b border-color">
                            <tr>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Doctor
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Specialization
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm hidden md:table-cell">
                                    Contact
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Patients
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Status
                                </th>
                                <th className="text-center py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doctor, index) => (
                                    <tr
                                        key={doctor.id}
                                        className={` hover:bg-main border-t border-color transition-colors ${
                                            index % 2 === 0 ? '' : 'bg-main bg-opacity-30'
                                        }`}
                                    >
                                        <td className="py-4 px-4 md:px-6 align-top">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-primary text-ondark flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                                    {doctor.firstName.charAt(0).toUpperCase()}{doctor.lastName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-heading text-sm font-bold">{`Dr. ${doctor.firstName} ${doctor.lastName}`}</p>
                                                    <p className="text-muted text-xs break-all">{doctor.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-2 bg-primary bg-opacity-10 
                                                               text-ondark px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                                                    {doctor.specialization}
                                                </span>
                                        </td>
                                        <td className="py-4 px-6 hidden md:table-cell md:min-w-[200px]">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-body text-sm">
                                                    <FaEnvelope className="text-muted flex-shrink-0" size={12} />
                                                    <span className="text-xs break-all">{doctor.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-body text-sm">
                                                    <FaPhone className="text-muted flex-shrink-0" size={12} />
                                                    <span className="text-xs break-all">{doctor.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <span className="text-heading font-semibold">{doctor.patients}</span>
                                            <span className="text-muted text-sm ml-1">patients</span>
                                        </td>
                                        <td className="py-4 px-6">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                                    doctor.status === 'active'
                                                        ? 'bg-accent-success bg-opacity-10 text-body'
                                                        : 'bg-accent-warning bg-opacity-10 text-body'
                                                }`}>
                                                    {doctor.status === 'active' ? 'Active' : 'On Leave'}
                                                </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2 overflow-x-hidden lg:overflow-x-visible ">
                                                <button
                                                    onClick={() => handleView(doctor.id)}
                                                    className="p-2 hover:bg-accent-sky hover:bg-opacity-10 rounded-lg
                                                                 text-accent-sky transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye size={22} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(doctor.id)}
                                                    className="p-2 hover:bg-primary hover:bg-opacity-10 rounded-lg
                                                                 text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={22} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doctor.id)}
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
                                            <FaUserMd size={48} className="text-muted opacity-50" />
                                            <p className="text-muted text-lg">No doctors found</p>
                                            <p className="text-muted text-sm">Try adjusting your search or filter</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination (Optional) */}
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-muted text-sm">
                        Showing <span className="font-semibold text-heading">{filteredDoctors.length}</span> of{' '}
                        <span className="font-semibold text-heading">{doctors.length}</span> doctors
                    </p>
                    {/* Add pagination controls here if needed */}
                </div>
            </div>
        </Layout>
    );
}