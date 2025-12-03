import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import * as patientService from "../services/patientService";
import {
  FaEdit,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaMapMarkerAlt,
  FaTint,
  FaHeartbeat,
} from "react-icons/fa";
import { formatStaffDate } from "../utils/dateFormat";

export default function PatientDetails() {
  const { id } = useParams();
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
      setPatient(null);
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

  const formatDate = (value) => formatStaffDate(value);

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex justify-between items-center">
            <Link
              to="/staff/patients"
              className="text-primary hover:underline flex items-center gap-2"
            >
              <FaArrowLeft size={16} />
              Back to Patients
            </Link>

            <Link
              to={`/staff/patients/${id}/edit`}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover flex items-center gap-2"
            >
              <FaEdit size={16} />
              Edit Patient
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Patient ID",
                    value: patient.id || "N/A",
                    icon: FaUser,
                  },
                  {
                    label: "First Name",
                    value: patient.firstName || "N/A",
                    icon: FaUser,
                  },
                  {
                    label: "Last Name",
                    value: patient.lastName || "N/A",
                    icon: FaUser,
                  },
                  {
                    label: "Email",
                    value: patient.email || "N/A",
                    icon: FaEnvelope,
                  },
                  {
                    label: "Phone",
                    value: patient.phone || "N/A",
                    icon: FaPhone,
                  },
                  {
                    label: "Date of Birth",
                    value: formatDate(patient.dateOfBirth),
                    icon: FaCalendar,
                  },
                  {
                    label: "Gender",
                    value: patient.gender || "N/A",
                    icon: FaUser,
                  },
                  {
                    label: "Address",
                    value: patient.address || "N/A",
                    icon: FaMapMarkerAlt,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">{label}</p>
                      <p className="text-gray-900 font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Medical & Emergency Info
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaTint className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Blood Group</p>
                    <p className="text-gray-900 font-medium">
                      {patient.bloodGroup || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhone className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Emergency Contact</p>
                    <p className="text-gray-900 font-medium">
                      {patient.emergencyContact || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {patient.emergencyName
                        ? `${patient.emergencyName} (${patient.emergencyRelationship || "Relationship N/A"})`
                        : ""}
                    </p>
                  </div>
                </div>
                <br />
                {[
                  { label: "Allergies", value: patient.allergies },
                  { label: "Conditions", value: patient.conditions },
                  { label: "Medications", value: patient.medications },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-gray-900 font-medium">
                      {item.value || "None"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
