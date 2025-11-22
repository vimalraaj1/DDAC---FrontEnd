import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import StatusBadge from "../components/StatusBadge";
import * as patientService from "../services/patientService";
import { FaEdit, FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const data = await patientService.getPatientById(id);
      setPatient(data);
    } catch (error) {
      console.error("Error loading patient:", error);
      // Mock data for UI
      setPatient({
        id: id,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        dateOfBirth: "1990-01-01",
        address: "123 Main St, City, State 12345",
        status: "active",
        createdAt: "2024-01-01",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout role="staff">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Loading patient details...</p>
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout role="staff">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Patient not found</p>
            <Link to="/staff/patients" className="text-primary hover:underline">
              Back to Patients
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              to="/staff/patients"
              className="text-primary hover:underline flex items-center gap-2 mb-4"
            >
              <FaArrowLeft size={16} />
              Back to Patients
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {patient.name || patient.fullName}
                </h1>
                <StatusBadge status={patient.status || "active"} />
              </div>
              <Link
                to={`/staff/patients/${id}/edit`}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover flex items-center gap-2"
              >
                <FaEdit size={16} />
                Edit Patient
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaUser className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-900 font-medium">{patient.name || patient.fullName || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{patient.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhone className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900 font-medium">{patient.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCalendar className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="text-gray-900 font-medium">
                      {patient.dateOfBirth
                        ? new Date(patient.dateOfBirth).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900 font-medium">{patient.address || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Patient ID</p>
                  <p className="text-gray-900 font-medium">{patient.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <StatusBadge status={patient.status || "active"} />
                </div>
                {patient.createdAt && (
                  <div>
                    <p className="text-sm text-gray-500">Registered On</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

