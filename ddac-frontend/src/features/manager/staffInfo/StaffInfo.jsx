import '../../../index.css';
import Layout from '../../../components/Layout.jsx';
import { useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaEye, FaUserTie, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function StaffInfo() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const navigate = useNavigate();

    // Sample staff data (replace with API call later)
    const staffMembers = [
        {
            id: 12489234934130,
            firstName: "Alice",
            lastName: "Johnson",
            role: "Nurse",
            email: "alice.johnson@hospital.com",
            phone: "+60 12-111 2222",
            department: "Emergency",
            status: "active",
            avatar: "AJ",
            yearsOfExperience: 8
        },
        {
            id: 2,
            firstName: "Bob",
            lastName: "Martinez",
            role: "Receptionist",
            email: "bob.martinez@hospital.com",
            phone: "+60 12-222 3333",
            department: "Outpatient",
            status: "active",
            avatar: "BM",
            yearsOfExperience: 3
        },
        {
            id: 3,
            firstName: "Carol",
            lastName: "Lee",
            role: "Lab Technician",
            email: "carol.lee@hospital.com",
            phone: "+60 12-333 4444",
            department: "Laboratory",
            status: "active",
            avatar: "CL",
            yearsOfExperience: 5
        },
        {
            id: 4,
            firstName: "David",
            lastName: "Kim",
            role: "Pharmacist",
            email: "david.kim@hospital.com",
            phone: "+60 12-444 5555",
            department: "Pharmacy",
            status: "on-leave",
            avatar: "DK",
            yearsOfExperience: 6
        },
        {
            id: 5,
            firstName: "Emma",
            lastName: "Wilson",
            role: "Nurse",
            email: "emma.wilson@hospital.com",
            phone: "+60 12-555 6666",
            department: "ICU",
            status: "active",
            avatar: "EW",
            yearsOfExperience: 12
        },
        {
            id: 6,
            firstName: "Frank",
            lastName: "Garcia",
            role: "Administrator",
            email: "frank.garcia@hospital.com",
            phone: "+60 12-666 7777",
            department: "Administration",
            status: "active",
            avatar: "FG",
            yearsOfExperience: 15
        },
    ];

    // Get unique roles for filter
    const roles = [...new Set(staffMembers.map(staff => staff.role))];

    // Filter staff
    const filteredStaff = staffMembers.filter(staff => {
        const matchesSearch = staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || staff.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleView = (id) => {
        console.log('View staff:', id);
        navigate(`/managerViewStaff/${id}`);
    };

    const handleEdit = (id) => {
        console.log('Edit staff:', id);
        navigate(`/managerEditStaff/${id}`);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            console.log('Delete staff:', id);
            // Call delete API
        }
    };

    return (
        <Layout role="manager">
            <div className="w-full max-w-full overflow-hidden">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-heading">Staff Information</h1>
                    <p className="text-muted mt-1">Manage and view all staff records</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                <FaUserTie size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{staffMembers.length}</h3>
                                <p className="text-muted text-sm">Total Staff</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                                <FaUserTie size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">
                                    {staffMembers.filter(s => s.status === 'active').length}
                                </h3>
                                <p className="text-muted text-sm">Active Staff</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-warning bg-opacity-10 p-3 rounded-lg">
                                <FaUserTie size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">
                                    {staffMembers.filter(s => s.status === 'on-leave').length}
                                </h3>
                                <p className="text-muted text-sm">On Leave</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-soft p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                                <FaUserTie size={24} className="text-ondark" />
                            </div>
                            <div>
                                <h3 className="text-heading text-2xl font-bold">{roles.length}</h3>
                                <p className="text-muted text-sm">Staff Roles</p>
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
                                    placeholder="Search by name, email, role, or department..."
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
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-4 py-2 border border-input rounded-lg
                                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                                         text-body bg-card"
                            >
                                <option value="all">All Roles</option>
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>

                            <button
                                className="btn-primary whitespace-nowrap"
                                onClick={() => navigate("/managerAddNewStaff")}
                            >
                                + Add Staff
                            </button>
                        </div>
                    </div>
                </div>

                {/* Staff Table */}
                <div className="bg-card rounded-xl shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full table-fixed">
                            <thead className="bg-primary border-b border-color">
                            <tr>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Staff Member
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Role
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm hidden md:table-cell break-all">
                                    Contact
                                </th>
                                <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">
                                    Department
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
                            {filteredStaff.length > 0 ? (
                                filteredStaff.map((staff, index) => (
                                    <tr
                                        key={staff.id}
                                        className={`hover:bg-main border-t border-color transition-colors ${
                                            index % 2 === 0 ? '' : 'bg-main bg-opacity-30'
                                        }`}
                                    >
                                        <td className="py-4 px-4 md:px-6 align-top">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-full bg-primary text-ondark flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                                    {staff.firstName.charAt(0).toUpperCase()}{staff.lastName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-heading text-sm font-bold">{`${staff.firstName} ${staff.lastName}`}</p>
                                                    <p className="text-muted text-xs">{staff.id} years exp.</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-2 bg-primary bg-opacity-10 
                                                               text-ondark px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                                                    {staff.role}
                                                </span>
                                        </td>
                                        <td className="py-4 px-6 hidden md:table-cell md:min-w-[200px]">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-body text-sm">
                                                    <FaEnvelope className="text-muted flex-shrink-0" size={12} />
                                                    <span className="text-xs break-all">{staff.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-body text-sm">
                                                    <FaPhone className="text-muted flex-shrink-0" size={12} />
                                                    <span className="text-xs">{staff.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-body text-sm font-medium">{staff.department}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                                    staff.status === 'active'
                                                        ? 'bg-accent-success bg-opacity-10 text-body'
                                                        : 'bg-accent-warning bg-opacity-10 text-body'
                                                }`}>
                                                    {staff.status === 'active' ? 'Active' : 'On Leave'}
                                                </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center gap-2 overflow-x-hidden lg:overflow-x-visible">
                                                <button
                                                    onClick={() => handleView(staff.id)}
                                                    className="p-2 hover:bg-accent-sky hover:bg-opacity-10 rounded-lg
                                                                 text-accent-sky transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye size={22} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(staff.id)}
                                                    className="p-2 hover:bg-primary hover:bg-opacity-10 rounded-lg
                                                                 text-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit size={22} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(staff.id)}
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
                                            <FaUserTie size={48} className="text-muted opacity-50" />
                                            <p className="text-muted text-lg">No staff members found</p>
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
                        Showing <span className="font-semibold text-heading">{filteredStaff.length}</span> of{' '}
                        <span className="font-semibold text-heading">{staffMembers.length}</span> staff members
                    </p>
                </div>
            </div>
        </Layout>
    );
}