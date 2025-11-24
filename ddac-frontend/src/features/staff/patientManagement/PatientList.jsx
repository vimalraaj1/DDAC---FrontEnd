import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import * as patientService from "../services/patientService";
import { FaPlus, FaSearch, FaEye, FaEdit } from "react-icons/fa";

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
      // Mock data for UI
      setPatients([
        { patientId: 1, firstName: "John", lastName: "Doe", email: "john@example.com", phone: "123-456-7890", dateOfBirth: "1990-01-01", status: "Active" },
        { patientId: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", phone: "123-456-7891", dateOfBirth: "1985-05-15", status: "Active" },
      ]);
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
    } catch (error) {
      console.error("Error searching patients:", error);
    }
  };

  const columns = [
    {
      key: "firstName",
      label: "First Name",
      render: (value, row) => (
        <div className="font-medium text-gray-900">{value || row.fullName}</div>
      ),
    },
    {
      key: "lastName",
      label: "Last Name",
      render: (value, row) => (
        <div className="font-medium text-gray-900">{value || row.fullName}</div>
      ),
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      render: (value) => value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value || "Active"} />,
    },
  ];

  const actions = (row) => (
    <div className="flex items-center gap-8">
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/staff/patients/${row.patientId}`);
        }}
        className="text-blue-600 hover:text-blue-800"
        title="View Details"
      >
        <FaEye size={20} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/staff/patients/${row.patientId}/edit`);
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
      (patient.name || patient.fullName || "").toLowerCase().includes(query) ||
      (patient.email || "").toLowerCase().includes(query) ||
      (patient.phone || "").includes(query)
    );
  });

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Management</h1>
              <p className="text-gray-600">View and manage all patient records</p>
            </div>
            <Link
              to="/staff/patients/new"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover flex items-center gap-2"
            >
              <FaPlus size={16} />
              Register New Patient
            </Link>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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

          {/* Patients Table */}
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

