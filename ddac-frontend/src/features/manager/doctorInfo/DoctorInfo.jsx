import "../../../index.css";
import Layout from "../../../components/Layout.jsx";
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaUserMd,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  deleteDoctor,
  getActiveDoctors,
  getDoctors,
  getOnLeaveDoctors,
} from "../../../services/doctorManagementService.js";
import { CountNumberOfUniquePatientsByDoctorId } from "../../../services/appointmentManagementService.js";
import LoadingOverlay from "../../customer/components/LoadingOverlay.js";

export default function DoctorInfo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [doctors, setDoctors] = useState([]);
  const [numOfPatients, setNumOfPatients] = useState({});
  // const [activeDoctor, setActiveDoctor] = useState(0);
  // const [onLeaveDoctor, setOnLeaveDoctor] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  // Fetch doctors on component mount
  useEffect(() => {
    getDoctorsInfo();
  }, []);

  const getDoctorsInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getDoctors();
      console.log("Fetched doctors:", data);
      if (Array.isArray(data)) {
        setDoctors(data);
        const counts = {};
        await Promise.all(
          data.map(async (doctor) => {
            try {
              const count = await CountNumberOfUniquePatientsByDoctorId(
                doctor.id
              );
              counts[doctor.id] = count;
            } catch (err) {
              console.error(
                `Error fetching patient count for doctor ${doctor.id}:`,
                err
              );
              counts[doctor.id] = 0;
            }
          })
        );
        setNumOfPatients(counts);
        console.log("Patient counts:", counts);
        // await getActiveDoctors();
        // await getOnLeaveDoctors();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError(err.message || "Failed to fetch doctors");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique specialties for filter
  const specialties = [...new Set(doctors.map((doc) => doc.specialization))];

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      filterSpecialty === "all" || doctor.specialization === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleView = (id) => {
    console.log("View doctor:", id);
    navigate(`/managerViewDoctor/${id}`);
  };

  const handleEdit = (id) => {
    console.log("Edit doctor:", id);
    navigate(`/managerEditDoctor/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        setIsLoadingDelete(true);
        await deleteDoctor(id);
        console.log("Delete doctor successful:", id);

        setIsLoadingDelete(false);
        alert("Doctor record deleted successfully");
        try {
          await getDoctorsInfo();
        } catch (refreshErr) {
          console.error("Error refreshing doctor list:", refreshErr);
        }
      } catch (err) {
        console.error("Error deleting doctor:", err);
        alert("Failed to delete doctor");
      }
    }
  };

  const normalizeStatus = (status) => {
    return status?.toLowerCase() || "inactive";
  };

  // Loading state
  if (loading) {
    return (
      <Layout role="manager">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted">Loading doctors...</p>
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
            <FaUserMd size={64} className="text-accent-danger mx-auto mb-4" />
            <h2 className="text-heading text-xl font-bold mb-2">
              Error Loading Doctors
            </h2>
            <p className="text-muted mb-4">{error}</p>
            <button onClick={getDoctorsInfo} className="btn-primary">
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
          <h1 className="text-3xl font-bold text-heading">
            Doctors Information
          </h1>
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
                <h3 className="text-heading text-2xl font-bold">
                  {doctors.length}
                </h3>
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
                  {
                    doctors.filter((d) => d.status.toLowerCase() === "active")
                      .length
                  }
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
                  {
                    doctors.filter((d) => d.status.toLowerCase() === "on-leave")
                      .length
                  }
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
                <h3 className="text-heading text-2xl font-bold">
                  {specialties.length}
                </h3>
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
                <FaSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                  size={16}
                />
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
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              {/* Add New Doctor */}
              <button
                className="btn-primary whitespace-nowrap"
                onClick={() => navigate("/managerAddNewDoctor")}
              >
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
                        index % 2 === 0 ? "" : "bg-main bg-opacity-30"
                      }`}
                    >
                      <td className="py-4 px-4 md:px-6 align-top">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-primary text-ondark flex items-center justify-center font-semibold text-xs flex-shrink-0">
                            {doctor.firstName.charAt(0).toUpperCase()}
                            {doctor.lastName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-heading text-sm font-bold">{`Dr. ${doctor.firstName} ${doctor.lastName}`}</p>
                            <p className="text-muted text-xs break-all">
                              {doctor.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className="inline-flex items-center gap-2 bg-primary bg-opacity-10 
                                                               text-ondark px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap"
                        >
                          {doctor.specialization}
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
                              {doctor.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-body text-sm">
                            <FaPhone
                              className="text-muted flex-shrink-0"
                              size={12}
                            />
                            <span className="text-xs break-all">
                              {doctor.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="text-heading font-semibold">
                          {numOfPatients[doctor.id] ?? 0}
                        </span>
                        <span className="text-muted text-sm ml-1">
                          patients
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            normalizeStatus(doctor.status) === "active"
                              ? "bg-accent-success bg-opacity-10 text-body"
                              : "bg-accent-warning bg-opacity-10 text-body"
                          }`}
                        >
                          {doctor.status.toLowerCase() === "active"
                            ? "Active"
                            : "On Leave"}
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

        {/* Pagination (Optional) */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-muted text-sm">
            Showing{" "}
            <span className="font-semibold text-heading">
              {filteredDoctors.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-heading">{doctors.length}</span>{" "}
            doctors
          </p>
          {/* Add pagination controls here if needed */}
        </div>

        <LoadingOverlay
          isLoading={isLoadingDelete}
          message="Deleting doctor, please wait..."
        />
      </div>
    </Layout>
  );
}
