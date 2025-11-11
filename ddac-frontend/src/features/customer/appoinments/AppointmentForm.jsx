import { useState, useEffect } from "react";

export default function AppointmentForm({ onSubmit, onClose, initialData }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    doctor: "",
    status: "Booked",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", marginBottom: "20px" }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <label>Time:</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>
        <div>
          <label>Doctor:</label>
          <input type="text" name="doctor" value={formData.doctor} onChange={handleChange} required />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit">{initialData ? "Update" : "Create"}</button>
        <button type="button" onClick={onClose} style={{ marginLeft: "10px" }}>Cancel</button>
      </form>
    </div>
  );
}