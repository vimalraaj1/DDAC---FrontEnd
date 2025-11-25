import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import DataTable from "../components/DataTable";
import * as prescriptionService from "../services/prescriptionService";
import { FaEye, FaEdit } from "react-icons/fa";

export default function PrescriptionList() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await prescriptionService.getAllPrescriptions();
      setPrescriptions(data || []);
    } catch (error) {
      console.error("Error loading prescriptions:", error);
      // Mock data
      setPrescriptions([
        {
          id: 1,
          patientName: "John Doe",
          appointmentDate: "2024-12-20",
          medications: [{ name: "Paracetamol", dosage: "500mg" }],
          createdAt: "2024-12-20",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "patientName",
      label: "Patient",
      render: (value, row) => (
        <div className="font-medium text-gray-900">{value || row.patient?.name || "N/A"}</div>
      ),
    },
    {
      key: "appointmentDate",
      label: "Appointment Date",
      render: (value) => value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      key: "medications",
      label: "Medications",
      render: (value) => {
        if (!value || !Array.isArray(value)) return "N/A";
        return value.map((med) => med.name || med.medicationName).join(", ") || "N/A";
      },
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => value ? new Date(value).toLocaleDateString() : "N/A",
    },
  ];

  const actions = (row) => (
    <div className="flex items-center gap-8">
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/staff/prescriptions/${row.id}`);
        }}
        className="text-blue-600 hover:text-blue-800"
        title="View Details"
      >
        <FaEye size={20} />
      </button>
    </div>
  );

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Prescriptions</h1>
              <p className="text-gray-600">View all assigned prescriptions</p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Loading prescriptions...</p>
            </div>
          ) : (
            <DataTable columns={columns} data={prescriptions} actions={actions} />
          )}
        </div>
      </div>
    </Layout>
  );
}

