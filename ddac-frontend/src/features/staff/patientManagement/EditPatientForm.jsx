import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { registerPatient, getPatientById, updatePatient } from "./patientManagementService";
import StaffNavBar from "../components/StaffNavBar";


export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    patientName: "",
    phoneNumber: "",
    email: "",
    gender: "",
    address: "",
    allergies: "",
  });

  useEffect(() => {
    if (id) loadPatient();
  }, [id]);

  const loadPatient = async () => {
    const data = await getPatientById(id);
    setPatient(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) await updatePatient(id, patient);
    else await registerPatient(patient);

    navigate("/managePatients");
  };

  return (
    <div className="min-h-screen bg-gray-soft">
      <StaffNavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card-elevated">
            <h2 className="section-title mb-6">{id ? "Edit Patient" : "New Patient"}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Full Name</label>
                <input
                  type="text"
                  name="patientName"
                  className="input-field"
                  value={patient.patientName}
                  onChange={handleChange}
                  required
                  placeholder="Enter patient's full name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="input-field"
                  value={patient.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Email</label>
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  value={patient.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Gender</label>
                <select
                  name="gender"
                  className="input-field"
                  value={patient.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Address</label>
                <input
                  type="text"
                  name="address"
                  className="input-field"
                  value={patient.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  className="input-field"
                  value={patient.allergies}
                  onChange={handleChange}
                  placeholder="Enter allergies (if any)"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {id ? "Update Patient" : "Create Patient"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/managePatients")}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
