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
    <div className="card-elevated">
      <h2 className="section-title mb-6">{initialData ? "Edit Appointment" : "New Appointment"}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Date</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            required 
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Time</label>
          <input 
            type="time" 
            name="time" 
            value={formData.time} 
            onChange={handleChange} 
            required 
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Doctor</label>
          <input 
            type="text" 
            name="doctor" 
            value={formData.doctor} 
            onChange={handleChange} 
            required 
            className="input-field"
            placeholder="Enter doctor's name"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className="input-field"
          >
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex space-x-3 pt-4">
          <button type="submit" className="btn-primary flex-1">
            {initialData ? "Update" : "Create"}
          </button>
          <button 
            type="button" 
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}