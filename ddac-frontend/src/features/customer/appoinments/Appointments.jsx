import { useState, useEffect } from "react";
import CustNavBar from "../components/CustNavBar";
import AppointmentForm from "./AppointmentForm";
import { getAppointments, deleteAppointment, createAppointment, updateAppointment } from "./appointmentService";


export default function Appointments() {
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
    <div>
      <CustNavBar />
      <div style={{ padding: "20px" }}>
        <h1>Appointments</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); }}>+ New Appointment</button>

        {showForm && (
          <AppointmentForm
            onSubmit={editing ? handleUpdate : handleCreate}
            onClose={() => setShowForm(false)}
            initialData={editing}
          />
        )}

        <ul>
          {appointments.map(a => (
            <li key={a.id}>
              {a.date} {a.time} with {a.doctor} - {a.status}  
              <button onClick={() => { setEditing(a); setShowForm(true); }}>Edit</button>
              <button onClick={() => handleDelete(a.id)} style={{ marginLeft: "10px" }}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}