import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import DataTable from "../components/DataTable";
import * as patientService from "../services/patientService";
import { FaPlus, FaSearch, FaEye, FaEdit, FaUserFriends, FaMars, FaTint, FaVenus } from "react-icons/fa";
import { toast } from "sonner";
import { formatStaffDate } from "../utils/dateFormat";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getAllPatients();
      setPatients(data || []);
    } catch (error) {
      console.error("Error loading patients:", error);
      toast.error("Failed to load patients. Please try again.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPatients();
      return;
    }
    try {
      const results = await patientService.searchPatients(searchQuery);
      setPatients(results || []);
      if (!results || results.length === 0) {
        toast.info("No patients found matching your search.");
      }
    } catch (error) {
      console.error("Error searching patients:", error);
      toast.error("Failed to search patients. Please try again.");
    }
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (value) => <div className="font-medium text-gray-900">{value}</div>,
    },
    {
      key: "firstName",
      label: "First Name",
      render: (value, row) => (
        <div className="font-medium text-gray-900">
          {value || row.fullName || "N/A"}
        </div>
      ),
    },
    {
      key: "lastName",
      label: "Last Name",
      render: (value, row) => (
        <div className="font-medium text-gray-900">
          {value || row.fullName || "N/A"}
        </div>
      ),
    },
    { key: "gender", label: "Gender" },
    { key: "bloodGroup", label: "Blood Group" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      render: (value) => formatStaffDate(value),
    },
  ];

  const actions = (row) => (
    <div className="flex items-center gap-8">
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/staff/patients/${row.id}`);
        }}
        className="text-blue-600 hover:text-blue-800"
        title="View Details"
      >
        <FaEye size={20} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/staff/patients/${row.id}/edit`);
        }}
        className="text-green-600 hover:text-green-800"
        title="Edit"
      >
        <FaEdit size={20} />
      </button>
    </div>
  );

  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      `${patient.firstName || ""} ${patient.lastName || ""}`
        .toLowerCase()
        .includes(query) ||
      (patient.email || "").toLowerCase().includes(query) ||
      (patient.phone || "").includes(query) ||
      (patient.id || "").toLowerCase().includes(query)
    );
  });

  const malePatients = patients.filter((patient) => (patient.gender || "").toLowerCase() === "male").length;
  const femalePatients = patients.filter((patient) => (patient.gender || "").toLowerCase() === "female").length;
  const uniqueBloodGroups = new Set(patients.map((patient) => patient.bloodGroup || "").filter(Boolean)).size;

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Patient Management
              </h1>
              <p className="text-gray-600">
                View and manage all patient records
              </p>
            </div>
            <Link
              to="/staff/patients/new"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover flex items-center gap-2"
            >
              <FaPlus size={16} />
              Register New Patient
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                  <FaUserFriends size={24} className="text-ondark" />
                </div>
                <div>
                  <h3 className="text-heading text-2xl font-bold">{patients.length}</h3>
                  <p className="text-muted text-sm">Total Patients</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                  <FaMars size={24} className="text-ondark" />
                </div>
                <div>
                  <h3 className="text-heading text-2xl font-bold">{malePatients}</h3>
                  <p className="text-muted text-sm">Male Patients</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                  <FaVenus size={24} className="text-ondark" />
                </div>
                <div>
                  <h3 className="text-heading text-2xl font-bold">{femalePatients}</h3>
                  <p className="text-muted text-sm">Female Patients</p>
                </div>
              </div>
            </div>


            {/* <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                  <FaTint size={24} className="text-ondark" />
                </div>
                <div>
                  <h3 className="text-heading text-2xl font-bold">{uniqueBloodGroups}</h3>
                  <p className="text-muted text-sm">Blood Groups</p>
                </div>
              </div>
            </div> */}
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover"
              >
                Search
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Loading patients...</p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredPatients}
              onRowClick={(row) => navigate(`/staff/patients/${row.id}`)}
              actions={actions}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

