import { useState, useEffect } from "react";
import StaffNavBar from "../components/StaffNavBar";
import AppointmentForm from "./AppointmentForm";
import { getAppointments, deleteAppointment, createAppointment, updateAppointment } from "./appointmentService";


export default function StaffAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [editing, setEditing] = useState(null); 
  const [showForm, setShowForm] = useState(false);

  const fetchAppointments = async () => {
    const data = await getAppointments();
    setAppointments(data);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreate = async (data) => {
    await createAppointment(data);
    fetchAppointments();
  };

  const handleUpdate = async (data) => {
    await updateAppointment(editing.id, data);
    setEditing(null);
    fetchAppointments();
  };

  const handleDelete = async (id) => {
    await deleteAppointment(id);
    fetchAppointments();
  };

  return (
    <div className="min-h-screen bg-gray-soft">
      <StaffNavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="page-title">Appointments</h1>
          <button 
            onClick={() => { setShowForm(true); setEditing(null); }}
            className="btn-primary"
          >
            + New Appointment
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <AppointmentForm
              onSubmit={editing ? handleUpdate : handleCreate}
              onClose={() => { setShowForm(false); setEditing(null); }}
              initialData={editing}
            />
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-neutral mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-neutral text-lg">No appointments yet</p>
            <p className="text-gray-neutral text-sm mt-2">Create your first appointment to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map(a => (
              <div key={a.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        a.status === 'Booked' ? 'bg-blue-100 text-primary' :
                        a.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{a.doctor}</h3>
                    <p className="text-sm text-gray-neutral">
                      <span className="font-medium">Date:</span> {a.date}
                    </p>
                    <p className="text-sm text-gray-neutral">
                      <span className="font-medium">Time:</span> {a.time}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => { setEditing(a); setShowForm(true); }}
                    className="btn-secondary text-sm flex-1"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(a.id)}
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