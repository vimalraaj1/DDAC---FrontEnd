import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import SearchableSelect from "../components/SearchableSelect";
import * as appointmentService from "../services/appointmentService";
import * as doctorService from "../services/doctorService";
import * as patientService from "../services/patientService";
import * as availabilityService from "../../../services/availabilityManagementService";
import { FaArrowLeft, FaSave, FaCalendar, FaClock, FaUser, FaUserMd, FaStethoscope } from "react-icons/fa";
import { getStoredStaffId } from "../utils/staffStorage";

export default function CreateAppointment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [dateLoading, setDateLoading] = useState(false);
  const [doctorAvailability, setDoctorAvailability] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: null,
    patientId: null,
    staffId: null,
    date: "",
    time: "",
    purpose: "",
    status: "Approved",
    cancellationReason: null,
  });

  useEffect(() => {
    loadDoctors();
    loadPatients();
    setStaffIdFromStorage();
  }, []);

  // Fetch availability when doctor changes
  useEffect(() => {
    const fetchAvailability = async () => {
      const doctorId = formData.doctorId;
      if (doctorId) {
        setDateLoading(true);
        try {
          const data = await availabilityService.getDateAndTimeAfterSelectDoctor(doctorId);
          setDoctorAvailability(data || []);
        } catch (error) {
          console.error('Error fetching doctor availability:', error);
          setDoctorAvailability([]);
          alert('Failed to load doctor availability. Please try again.');
        } finally {
          setDateLoading(false);
        }
      } else {
        setDoctorAvailability([]);
      }
    };
    fetchAvailability();
  }, [formData.doctorId]);

  // Get available dates
  const availableDates = useMemo(() => {
    const uniqueDates = [...new Set(doctorAvailability.map(item => item.date))];
    return uniqueDates.sort();
  }, [doctorAvailability]);

  // Get available times for selected date
  const availableTimes = useMemo(() => {
    if (!formData.date) return [];
    return doctorAvailability
      .filter(item => item.date === formData.date)
      .map(item => ({ id: item.id, time: item.time }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [doctorAvailability, formData.date]);

  // Get the availability ID for booking
  const getSelectedAvailabilityId = useCallback(() => {
    if (!formData.date || !formData.time) return null;
    const availability = doctorAvailability.find(
      item => item.date === formData.date && item.time === formData.time
    );
    return availability?.id || null;
  }, [doctorAvailability, formData.date, formData.time]);

  const loadDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const data = await doctorService.getAllDoctors();
      setDoctors(data || []);
    } catch (error) {
      console.error("Error loading doctors:", error);
      setDoctors([
        { doctorId: 1, name: "Dr. Sarah Wilson", specialization: "Cardiology" },
        { doctorId: 2, name: "Dr. Michael Chen", specialization: "Neurology" },
        { doctorId: 3, name: "Dr. Emily Rodriguez", specialization: "Pediatrics" },
      ]);
    } finally {
      setLoadingDoctors(false);
    }
  };  

  const loadPatients = async () => {
    try {
      setLoadingPatients(true);
      const data = await patientService.getAllPatients();
      setPatients(data || []);
    } catch (error) {
      console.error("Error loading patients:", error);
      setPatients([
        { patientId: 1, firstName: "John", lastName: "Doe", name: "John Doe" },
        { patientId: 2, firstName: "Jane", lastName: "Smith", name: "Jane Smith" },
      ]);
    } finally {
      setLoadingPatients(false);
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

  const handleDoctorChange = (value) => {
    setFormData(prev => ({
      ...prev,
      doctorId: value,
      date: '',
      time: ''
    }));
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setFormData(prev => ({
      ...prev,
      date: newDate,
      time: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const availabilityId = getSelectedAvailabilityId();
      if (!availabilityId) {
        alert('Unable to find availability slot. Please try again.');
        setLoading(false);
        return;
      }

      const appointmentData = {
        doctorId: String(formData.doctorId || ""),
        patientId: String(formData.patientId || ""),
        staffId: formData.staffId ? String(formData.staffId) : null,
        date: formData.date,
        time: formData.time,
        purpose: formData.purpose,
        status: "Approved",
        cancellationReason: null,
      };

      console.log('Creating appointment:', appointmentData);
      console.log('Booking availability ID:', availabilityId);

      const appointmentResponse = await appointmentService.createAppointment(appointmentData);
      console.log('Appointment created:', appointmentResponse);
      
      await availabilityService.bookAppointment(availabilityId, appointmentResponse.id);
      console.log('Availability booked successfully');
      
      navigate("/staff/appointments");
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert(error.response?.data?.message || "Error creating appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDoctorLabel = (doctor) => {
    if (!doctor) return "";
    return `${doctor.specialization ? `${doctor.specialization} -` : ""} ${doctor.name || `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim()}`;
  };

  const getPatientLabel = (patient) => {
    if (!patient) return "";
    return patient.name || `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || patient.email || "Unknown";
  };

  const isDoctorSelected = !!formData.doctorId;
  const isDateSelected = !!formData.date;
  const disabledClass = 'bg-gray-100 text-gray-500 cursor-not-allowed';

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              to="/staff/appointments"
              className="text-primary hover:underline flex items-center gap-2 mb-4"
            >
              <FaArrowLeft size={16} />
              Back to Appointments
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create New Appointment</h1>
            <p className="text-gray-600 mt-2">Schedule a new appointment for a patient</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Doctor Selection */}
              <div>
                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUserMd className="inline mr-2 text-primary" size={16} />
                  Doctor *
                </label>
                {loadingDoctors ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    <p className="text-gray-500">Loading doctors...</p>
                  </div>
                ) : (
                  <SearchableSelect
                    options={doctors}
                    value={formData.doctorId}
                    onChange={handleDoctorChange}
                    placeholder="Select a doctor..."
                    searchPlaceholder="Search doctors by name or specialty..."
                    getOptionLabel={getDoctorLabel}
                    getOptionValue={(doctor) => doctor.id || doctor.doctorId}
                  />
                )}
              </div>

              {/* Patient Selection */}
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2 text-primary" size={16} />
                  Patient *
                </label>
                {loadingPatients ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    <p className="text-gray-500">Loading patients...</p>
                  </div>
                ) : (
                  <SearchableSelect
                    options={patients}
                    value={formData.patientId}
                    onChange={(value) => handleSelectChange("patientId", value)}
                    placeholder="Select a patient..."
                    searchPlaceholder="Search patients by name or email..."
                    getOptionLabel={getPatientLabel}
                    getOptionValue={(patient) => patient.id || patient.patientId}
                  />
                )}
              </div>

              {/* Date and Time with Availability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendar className="inline mr-2 text-primary" size={16} />
                    Date *
                  </label>
                  <select
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleDateChange}
                    disabled={dateLoading || !isDoctorSelected || availableDates.length === 0}
                    required
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      !isDoctorSelected || availableDates.length === 0 ? disabledClass : ''
                    }`}
                  >
                    <option value="">
                      {!isDoctorSelected ? 'Select a doctor first' : 
                        dateLoading ? "Loading available dates..." :
                        availableDates.length === 0 ? 'No availability found' : 'Select available date'}
                    </option>
                    {availableDates.map(date => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    <FaClock className="inline mr-2 text-primary" size={16} />
                    Time *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    disabled={!isDateSelected || availableTimes.length === 0}
                    required
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      !isDateSelected || availableTimes.length === 0 ? disabledClass : ''
                    }`}
                  >
                    <option value="">
                      {!isDateSelected ? 'Select a date first' :
                        availableTimes.length === 0 ? 'No times available' : 'Select available time'}
                    </option>
                    {availableTimes.map(timeSlot => (
                      <option key={timeSlot.id} value={timeSlot.time}>
                        {timeSlot.time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaStethoscope className="inline mr-2 text-primary" size={16} />
                  Purpose *
                </label>
                <input
                  type="text"
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  placeholder="e.g., General checkup, Follow-up, Consultation"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading || loadingDoctors || loadingPatients || !formData.doctorId || !formData.date || !formData.time}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave size={16} />
                  {loading ? "Creating..." : "Create Appointment"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/staff/appointments")}
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