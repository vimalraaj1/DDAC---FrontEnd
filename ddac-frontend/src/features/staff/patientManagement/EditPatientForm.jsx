import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { registerPatient, getPatientById, updatePatient } from "./patientManagementService";
import StaffNavBar from "../components/StaffNavBar";


export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    bloodGroup: "",
    emergencyContact: "",
    emergencyName: "",
    emergencyRelationship: "",
    allergies: "",
    conditions: "",
    medications: "",
  });

  useEffect(() => {
    if (id) loadPatient();
  }, [id]);

  const loadPatient = async () => {
    const data = await getPatientById(id);
    // normalize dateOfBirth
    setPatient({
      ...data,
      dateOfBirth: data?.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
    });
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">First Name</label>
                  <input type="text" name="firstName" className="input-field" value={patient.firstName} onChange={handleChange} required placeholder="First name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Last Name</label>
                  <input type="text" name="lastName" className="input-field" value={patient.lastName} onChange={handleChange} required placeholder="Last name" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Phone</label>
                  <input type="text" name="phone" className="input-field" value={patient.phone} onChange={handleChange} required placeholder="Phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Email</label>
                  <input type="email" name="email" className="input-field" value={patient.email} onChange={handleChange} required placeholder="Email" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Date of Birth</label>
                  <input type="date" name="dateOfBirth" className="input-field" value={patient.dateOfBirth} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Gender</label>
                  <select name="gender" className="input-field" value={patient.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">Address</label>
                <textarea name="address" className="input-field" value={patient.address} onChange={handleChange} placeholder="Enter address" rows={3} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Blood Group</label>
                  <input type="text" name="bloodGroup" className="input-field" value={patient.bloodGroup} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Emergency Contact</label>
                  <input type="text" name="emergencyContact" className="input-field" value={patient.emergencyContact} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Emergency Name</label>
                  <input type="text" name="emergencyName" className="input-field" value={patient.emergencyName} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">Allergies</label>
                  <input type="text" name="allergies" className="input-field" value={patient.allergies} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Conditions</label>
                  <input type="text" name="conditions" className="input-field" value={patient.conditions} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900">Medications</label>
                  <input type="text" name="medications" className="input-field" value={patient.medications} onChange={handleChange} />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">{id ? "Update Patient" : "Create Patient"}</button>
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
