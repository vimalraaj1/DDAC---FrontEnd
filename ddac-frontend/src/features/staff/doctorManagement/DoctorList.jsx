import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import * as doctorService from "../services/doctorService";
import { FaSearch, FaEye, FaUserMd, FaEnvelope, FaPhone } from "react-icons/fa";
import { toast } from "sonner";

export default function DoctorList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getAllDoctors();
      setDoctors(data || []);
    } catch (error) {
      console.error("Error loading doctors:", error);
      toast.error("Failed to load doctors. Please try again.");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique specialties for filter
  const specialties = [...new Set(doctors.map((doc) => doc.specialization || doc.specialty).filter(Boolean))];

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const firstName = (doctor.firstName || "").toLowerCase();
    const lastName = (doctor.lastName || "").toLowerCase();
    const email = (doctor.email || "").toLowerCase();
    const specialization = (doctor.specialization || doctor.specialty || "").toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      firstName.includes(searchLower) ||
      lastName.includes(searchLower) ||
      email.includes(searchLower) ||
      specialization.includes(searchLower);

    const doctorSpecialty = doctor.specialization || doctor.specialty;
    const matchesSpecialty = filterSpecialty === "all" || doctorSpecialty === filterSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  const handleView = (id) => {
    navigate(`/staff/doctors/${id}`);
  };

  return (
    <Layout role="staff">
      <div className="w-full max-w-full overflow-hidden">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading">Doctor Management</h1>
          <p className="text-muted mt-1">View all doctor information</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl shadow-soft p-6">
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

          <div className="bg-card rounded-xl shadow-soft p-6">
            <div className="flex items-center gap-4">
              <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                <FaUserMd size={24} className="text-ondark" />
              </div>
              <div>
                <h3 className="text-heading text-2xl font-bold">
                  {doctors.filter((d) => (d.status || "active").toLowerCase() === "active").length}
                </h3>
                <p className="text-muted text-sm">Active Doctors</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-soft p-6">
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
        <div className="bg-card rounded-xl shadow-soft p-6 mb-6">
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
            <div className="flex gap-4 flex-shrink-0">
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
            </div>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-muted">Loading doctors...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full table-fixed">
                <thead className="bg-primary border-b border-color">
                  <tr>
                    <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Doctor</th>
                    <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Specialization</th>
                    <th className="text-left py-4 px-6 text-ondark font-semibold text-sm hidden md:table-cell">
                      Contact
                    </th>
                    <th className="text-left py-4 px-6 text-ondark font-semibold text-sm break-all">Status</th>
                    <th className="text-center py-4 px-6 text-ondark font-semibold text-sm break-all">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor, index) => {
                      const firstName = doctor.firstName || "";
                      const lastName = doctor.lastName || "";
                      const specialization = doctor.specialization || doctor.specialty || "N/A";
                      const status = (doctor.status || "active").toLowerCase();
                      const isActive = status === "active";

                      return (
                        <tr
                          key={doctor.id || doctor.doctorId}
                          className={`hover:bg-main border-t border-color transition-colors ${
                            index % 2 === 0 ? "" : "bg-main bg-opacity-30"
                          }`}
                        >
                          <td className="py-4 px-4 md:px-6 align-top">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-primary text-ondark flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                {firstName.charAt(0).toUpperCase()}
                                {lastName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-heading text-sm font-bold">{`Dr. ${firstName} ${lastName}`}</p>
                                <p className="text-muted text-xs break-all">{doctor.id || doctor.doctorId || "N/A"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-2 bg-primary bg-opacity-10 text-ondark px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                              {specialization}
                            </span>
                          </td>
                          <td className="py-4 px-6 hidden md:table-cell md:min-w-[200px]">
                            <div className="space-y-1">
                              {doctor.email && (
                                <div className="flex items-center gap-2 text-body text-sm">
                                  <FaEnvelope className="text-muted flex-shrink-0" size={12} />
                                  <span className="text-xs break-all">{doctor.email}</span>
                                </div>
                              )}
                              {doctor.phone && (
                                <div className="flex items-center gap-2 text-body text-sm">
                                  <FaPhone className="text-muted flex-shrink-0" size={12} />
                                  <span className="text-xs break-all">{doctor.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                isActive
                                  ? "bg-accent-success bg-opacity-10 text-body"
                                  : "bg-accent-warning bg-opacity-10 text-body"
                              }`}
                            >
                              {isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2 overflow-x-hidden lg:overflow-x-visible">
                              <button
                                onClick={() => handleView(doctor.id || doctor.doctorId)}
                                className="p-2 hover:bg-accent-sky hover:bg-opacity-10 rounded-lg text-accent-sky transition-colors"
                                title="View Details"
                              >
                                <FaEye size={22} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center">
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
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-muted text-sm">
            Showing <span className="font-semibold text-heading">{filteredDoctors.length}</span> of{" "}
            <span className="font-semibold text-heading">{doctors.length}</span> doctors
          </p>
        </div>
      </div>
    </Layout>
  );
}

