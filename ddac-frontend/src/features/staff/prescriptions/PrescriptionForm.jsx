import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import * as prescriptionService from "../services/prescriptionService";
import * as appointmentService from "../services/appointmentService";
import { FaArrowLeft, FaPlus, FaTrash, FaSave } from "react-icons/fa";

export default function PrescriptionForm() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);

  useEffect(() => {
    if (appointmentId) {
      loadAppointment();
    }
  }, [appointmentId]);

  const loadAppointment = async () => {
    try {
      const data = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(data);
    } catch (error) {
      console.error("Error loading appointment:", error);
    }
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prescriptionData = {
        appointmentId: appointmentId,
        medications: medications.filter(
          (med) => med.name && med.dosage && med.frequency && med.duration
        ),
        notes: e.target.notes?.value || "",
      };
      await prescriptionService.createPrescription(prescriptionData);
      navigate(`/staff/payments/new?appointmentId=${appointmentId}`);
    } catch (error) {
      console.error("Error creating prescription:", error);
      alert("Error creating prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              to={appointmentId ? `/staff/appointments/${appointmentId}` : "/staff/appointments"}
              className="text-primary hover:underline flex items-center gap-2 mb-4"
            >
              <FaArrowLeft size={16} />
              Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Assign Prescription</h1>
            {appointment && (
              <p className="text-gray-600 mt-2">
                For: {appointment._patient ? `${appointment._patient.firstName || ""} ${appointment._patient.lastName || ""}`.trim() : appointment.patientId || appointment.patientName || "Patient"}
              </p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Medications</h2>
                {medications.map((med, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-900">Medication {index + 1}</h3>
                      {medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash size={16} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medication Name *
                        </label>
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dosage *
                        </label>
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                          required
                          placeholder="e.g., 500mg"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frequency *
                        </label>
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) =>
                            handleMedicationChange(index, "frequency", e.target.value)
                          }
                          required
                          placeholder="e.g., Twice daily"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration *
                        </label>
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                          required
                          placeholder="e.g., 7 days"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMedication}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                >
                  <FaPlus size={16} />
                  Add Medication
                </button>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Any additional instructions or notes..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover flex items-center gap-2 disabled:opacity-50"
                >
                  <FaSave size={16} />
                  {loading ? "Saving..." : "Save Prescription & Continue to Payment"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

