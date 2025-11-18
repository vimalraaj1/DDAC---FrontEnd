import { useEffect, useState } from "react";
import { getPatients, deletePatient } from "./patientManagementService";
import { Link } from "react-router-dom";
import StaffNavBar from "../components/StaffNavBar";


export default function ManagePatients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setPatients(await getPatients());
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this patient?")) return;
    await deletePatient(id);
    loadPatients();
  };

  return (
    <div className="min-h-screen bg-gray-soft">
      <StaffNavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="page-title">Manage Patients</h1>
          <Link to="/registerPatient" className="btn-primary">
            + New Patient
          </Link>
        </div>

        {patients.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-neutral mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-neutral text-lg">No patients yet</p>
            <p className="text-gray-neutral text-sm mt-2">Register your first patient to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((p) => (
              <div key={p.id} className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{p.patientName}</h3>
                    <p className="text-sm text-gray-neutral mb-1">
                      <span className="font-medium">Phone:</span> {p.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-neutral mb-1">
                      <span className="font-medium">Email:</span> {p.email}
                    </p>
                    <p className="text-sm text-gray-neutral mb-1">
                      <span className="font-medium">Gender:</span> {p.gender}
                    </p>
                    <p className="text-sm text-gray-neutral mb-1">
                      <span className="font-medium">Address:</span> {p.address}
                    </p>
                    <p className="text-sm text-gray-neutral">
                      <span className="font-medium">Allergies:</span> {p.allergies || "None"}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <Link
                    to={`/editPatient/${p.id}`}
                    className="btn-secondary text-sm flex-1 text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
