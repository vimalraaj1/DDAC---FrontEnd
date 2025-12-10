import "../../../index.css";
import Layout from "../../../components/Layout.jsx";
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaUserMd,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  deleteStaff,
  getStaffs,
} from "../../../services/staffManagementService.js";
import LoadingOverlay from "../../customer/components/LoadingOverlay.js";

export default function StaffInfo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getStaffsInfo();
  }, []);

  const getStaffsInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getStaffs();
      console.log("Fetched staffs:", data);
      if (Array.isArray(data)) {
        setStaffs(data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching staffs:", err);
      setError(err.message || "Failed to fetch staffs");
      setStaffs([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique roles for filter
  const roles = [...new Set(staffs.map((staff) => staff.role))];

  // Filter staff
  const filteredStaff = staffs.filter((staff) => {
    const matchesSearch =
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || staff.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleView = (id) => {
    console.log("View staff:", id);
    navigate(`/managerViewStaff/${id}`);
  };

  const handleEdit = (id) => {
    console.log("Edit staff:", id);
    navigate(`/managerEditStaff/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      try {
        setIsLoadingDelete(true);
        await deleteStaff(id);
        console.log("Delete staff successful:", id);
        setIsLoadingDelete(false);
        alert("Staff record deleted successfully");
        try {
          await getStaffsInfo();
        } catch (refreshErr) {
          console.error("Error refreshing staff list:", refreshErr);
        }
      } catch (err) {
        console.error("Error deleting staff:", err);
        alert("Failed to delete staff");
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <Layout role="manager">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted">Loading staffs...</p>
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
            <h2 className="text-heading text-xl font-bold mb-2">
              Error Loading Staffs
            </h2>
            <p className="text-muted mb-4">{error}</p>
            <button onClick={getStaffsInfo} className="btn-primary">
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
                <h3 className="text-heading text-2xl font-bold">
                  {staffs.length}
                </h3>
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
                  {
                    staffs.filter((s) => s.status.toLowerCase() === "active")
                      .length
                  }
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
                  {
                    staffs.filter((s) => s.status.toLowerCase() === "on leave")
                      .length
                  }
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
                <h3 className="text-heading text-2xl font-bold">
                  {roles.length}
                </h3>
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
                <FaSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                  size={16}
                />
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
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
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
                        index % 2 === 0 ? "" : "bg-main bg-opacity-30"
                      }`}
                    >
                      <td className="py-4 px-4 md:px-6 align-top">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-primary text-ondark flex items-center justify-center font-semibold text-xs flex-shrink-0">
                            {staff.firstName.charAt(0).toUpperCase()}
                            {staff.lastName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-heading text-sm font-bold">{`${staff.firstName} ${staff.lastName}`}</p>
                            <p className="text-muted text-xs">{staff.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className="inline-flex items-center gap-2 bg-primary bg-opacity-10 
                                                               text-ondark px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap"
                        >
                          {staff.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 hidden md:table-cell md:min-w-[200px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-body text-sm">
                            <FaEnvelope
                              className="text-muted flex-shrink-0"
                              size={12}
                            />
                            <span className="text-xs break-all">
                              {staff.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-body text-sm">
                            <FaPhone
                              className="text-muted flex-shrink-0"
                              size={12}
                            />
                            <span className="text-xs">{staff.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-body text-sm font-medium">
                          {staff.department}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            staff.status.toLowerCase() === "active"
                              ? "bg-accent-success bg-opacity-10 text-body"
                              : "bg-accent-warning bg-opacity-10 text-body"
                          }`}
                        >
                          {staff.status.toLowerCase() === "active"
                            ? "Active"
                            : "On Leave"}
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
                        <FaUserTie
                          size={48}
                          className="text-muted opacity-50"
                        />
                        <p className="text-muted text-lg">
                          No staff members found
                        </p>
                        <p className="text-muted text-sm">
                          Try adjusting your search or filter
                        </p>
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
            Showing{" "}
            <span className="font-semibold text-heading">
              {filteredStaff.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-heading">{staffs.length}</span>{" "}
            staff members
          </p>
        </div>

              <LoadingOverlay
          isLoading={isLoadingDelete}
          message="Deleting staff, please wait..."
        />
      </div>
    </Layout>
  );
}
