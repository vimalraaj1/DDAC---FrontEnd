import "../../../index.css";
import Layout from "../../../components/Layout.jsx";
import { useEffect, useState } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserInjured,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  deletePatient,
  getPatients,
} from "../../../services/patientManagementService.js";
import { HasAppointment } from "../../../services/appointmentManagementService.js";
import LoadingOverlay from "../../customer/components/LoadingOverlay.js";

export default function PatientInfo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("all");
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    getPatientsInfo();
  }, []);

  const getPatientsInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPatients();
      console.log("Fetched patients:", data);
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError(err.message || "Failed to fetch patients");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique blood types for filter
  const bloodTypes = [...new Set(patients.map((p) => p.bloodType))];

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodType =
      filterBloodType === "all" || patient.bloodType === filterBloodType;
    return matchesSearch && matchesBloodType;
  });

  const handleView = (id) => {
    console.log("View patient:", id);
    navigate(`/managerViewPatient/${id}`);
  };

  const handleEdit = (id) => {
    console.log("Edit patient:", id);
    navigate(`/managerEditPatient/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        setIsLoadingDelete(true);

        const hasAppointment = await HasAppointment(id);
        if (hasAppointment === false) {
          await deletePatient(id);
          console.log("Delete patient successful:", id);
          setIsLoadingDelete(false);
          alert("Patient record deleted successfully");
          try {
            await getPatientsInfo();
          } catch (refreshErr) {
            console.error("Error refreshing patient list:", refreshErr);
          }
        } else {
          console.log(
            "Deletion blocked: Patient has associated appointments.",
            id
          );
          alert(
            "Patient record cannot be deleted as it is associated with appointments!"
          );
        }
      } catch (err) {
        console.error("Error deleting patient:", err);
        alert("Failed to delete patient");
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
            <p className="text-muted">Loading patients...</p>
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
            <FaUserInjured
              size={64}
              className="text-accent-danger mx-auto mb-4"
            />
            <h2 className="text-heading text-xl font-bold mb-2">
              Error Loading Patients
            </h2>
            <p className="text-muted mb-4">{error}</p>
            <button onClick={getPatientsInfo} className="btn-primary">
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
            Patient Information
          </h1>
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
                <h3 className="text-heading text-2xl font-bold">
                  {patients.length}
                </h3>
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
                  {
                    patients.filter(
                      (p) => p.conditions && p.conditions !== "None"
                    ).length
                  }
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
                <h3 className="text-heading text-2xl font-bold">
                  {bloodTypes.length}
                </h3>
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
                <FaSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                  size={16}
                />
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
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
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
                    Blood Group
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
                        index % 2 === 0 ? "" : "bg-main bg-opacity-30"
                      }`}
                    >
                      <td className="py-4 px-4 md:px-6 align-top">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-primary text-ondark flex items-center justify-center font-semibold text-xs flex-shrink-0">
                            {patient.firstName.charAt(0).toUpperCase()}
                            {patient.lastName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-heading text-sm font-bold">
                              {`${patient.firstName} ${patient.lastName}`}
                            </p>
                            <p className="text-muted text-xs break-all">
                              {patient.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-heading font-semibold">
                            {calculateAge(patient.dateOfBirth)} yrs
                          </p>
                          <p className="text-muted text-xs capitalize">
                            {patient.gender}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 hidden md:table-cell md:min-w-[200px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-body text-sm">
                            <FaEnvelope
                              className="text-muted flex-shrink-0"
                              size={12}
                            />
                            <span className="text-xs break-all">
                              {patient.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-body text-sm">
                            <FaPhone
                              className="text-muted flex-shrink-0"
                              size={12}
                            />
                            <span className="text-xs">{patient.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className="inline-flex items-center gap-2 bg-accent-danger bg-opacity-10 
                                                               text-ondark px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap"
                        >
                          {patient.bloodGroup || "None"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-sm ${
                            patient.conditions === null ||
                            patient.conditions === "" ||
                            patient.conditions === "None"
                              ? "text-accent-success font-medium break-all"
                              : "text-accent-warning break-all"
                          }`}
                        >
                          {patient.conditions || "None"}
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
              {filteredPatients.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-heading">
              {patients.length}
            </span>{" "}
            patients
          </p>
        </div>

        <LoadingOverlay
          isLoading={isLoadingDelete}
          message="Deleting patient, please wait..."
        />
      </div>
    </Layout>
  );
}
