import { useState, useEffect } from "react";
import SearchableSelect from "../components/SearchableSelect";
import * as patientService from "../services/patientService";
import * as doctorService from "../services/doctorService";
import { getStoredStaffId } from "../utils/staffStorage";

export default function AppointmentForm({ onSubmit, onClose, initialData }) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    patientId: "",
    doctorId: "",
    staffId: localStorage.getItem("id"),
    purpose: "",
    status: "Scheduled",
    cancellationReason: null,
  });

  useEffect(() => {
    loadOptions();
    setStaffIdFromStorage();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const loadOptions = async () => {
    try {
      const [pData, dData] = await Promise.all([patientService.getAllPatients(), doctorService.getAllDoctors()]);
      setPatients(pData || []);
      setDoctors(dData || []);
    } catch (error) {
      console.error("Error loading options:", error);
    }
  };

  const setStaffIdFromStorage = () => {
    const storedStaffId = getStoredStaffId();
    if (storedStaffId) {
      setFormData((prev) => ({ ...prev, staffId: storedStaffId }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      patientId: String(formData.patientId || ""),
      doctorId: String(formData.doctorId || ""),
      cancellationReason: formData.cancellationReason || null,
    });
    onClose && onClose();
  };

  const getPatientLabel = (p) => p?.name || `${p?.firstName || ""} ${p?.lastName || ""}`.trim() || p?.email || "Unknown";
  const getDoctorLabel = (d) => d?.name || `${d?.firstName || ""} ${d?.lastName || ""}`.trim() || d?.specialization || "Doctor";

  return (
    <div className="card-elevated">
      <h2 className="section-title mb-6">{initialData ? "Edit Appointment" : "New Appointment"}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="input-field" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Time</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required className="input-field" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Patient</label>
          <SearchableSelect
            options={patients}
            value={formData.patientId}
            onChange={(v) => handleSelectChange("patientId", v)}
            getOptionLabel={getPatientLabel}
            getOptionValue={(p) => p.id || p.patientId}
            placeholder="Select patient"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Doctor</label>
          <SearchableSelect
            options={doctors}
            value={formData.doctorId}
            onChange={(v) => handleSelectChange("doctorId", v)}
            getOptionLabel={getDoctorLabel}
            getOptionValue={(d) => d.id || d.doctorId}
            placeholder="Select doctor"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Purpose</label>
          <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} required className="input-field" placeholder="Purpose of appointment" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="input-field">
            <option value="Scheduled">Scheduled</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {formData.status === "Cancelled" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">Cancellation Reason</label>
            <input type="text" name="cancellationReason" value={formData.cancellationReason || ""} onChange={handleChange} className="input-field" placeholder="Optional reason" />
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button type="submit" className="btn-primary flex-1">{initialData ? "Update" : "Create"}</button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        </div>
      </form>
    </div>
  );
}