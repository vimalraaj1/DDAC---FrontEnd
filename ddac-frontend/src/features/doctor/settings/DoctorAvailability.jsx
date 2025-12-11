import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorSidebar from "../components/DoctorSidebar";
import * as availabilityService from "../../../services/availabilityManagementService";

export default function DoctorAvailability() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const doctorId = localStorage.getItem("id");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [formData, setFormData] = useState({
    availableDate: "",
    startTime: "",
    endTime: "",
    isBooked: false
  });
  const [error, setError] = useState("");
  const [isCreatingSlots, setIsCreatingSlots] = useState(false);
  const [creationProgress, setCreationProgress] = useState({ current: 0, total: 0 });
  const [filterDate, setFilterDate] = useState("");

  const fetchAvailabilities = async () => {
    try {
      setLoading(true);
      const data = await availabilityService.getAvailabilitiesByDoctorId(doctorId);
      setAvailabilities(data);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
      setError("Failed to load availabilities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchAvailabilities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNew = () => {
    setEditMode(false);
    setFormData({
      availableDate: "",
      startTime: "",
      endTime: "",
      isBooked: false
    });
    setShowModal(true);
    setError("");
  };

  const handleEdit = (availability) => {
    setEditMode(true);
    setSelectedAvailability(availability);
    
    // For single time slots, use the time as both start and calculate end as +30 minutes
    const timeSlot = availability.time || "";
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + 30;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
    
    setFormData({
      availableDate: availability.date?.split('T')[0] || "",
      startTime: timeSlot,
      endTime: endTime,
      isBooked: availability.isBooked || false
    });
    setShowModal(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this availability?")) {
      return;
    }

    try {
      await availabilityService.deleteAvailability(id);
      setAvailabilities(availabilities.filter(a => a.id !== id));
      alert("Availability deleted successfully!");
    } catch (error) {
      console.error("Error deleting availability:", error);
      alert("Failed to delete availability");
    }
  };

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // Generate 30-minute slots
    while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      const timeSlot = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      slots.push(timeSlot);
      currentMinutes += 30; // 30-minute intervals
    }
    
    return slots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.availableDate || !formData.startTime || !formData.endTime) {
      setError("Please fill in all fields");
      return;
    }

    // Validate start time is before end time
    if (formData.startTime >= formData.endTime) {
      setError("End time must be after start time");
      return;
    }

    try {
      if (editMode && selectedAvailability) {
        // For edit mode, just update the single time slot
        const payload = {
          doctorId: doctorId,
          date: formData.availableDate,
          time: `${formData.startTime}-${formData.endTime}`,
          isBooked: formData.isBooked
        };
        await availabilityService.updateAvailability(selectedAvailability.id, payload);
        alert("Availability updated successfully!");
      } else {
        // For new entries, create multiple 30-minute time slots
        const timeSlots = generateTimeSlots(formData.startTime, formData.endTime);
        
        console.log(`Creating ${timeSlots.length} time slots:`, timeSlots);
        
        setIsCreatingSlots(true);
        setCreationProgress({ current: 0, total: timeSlots.length });
        
        // Create time slots sequentially to avoid duplicate ID issues
        let successCount = 0;
        let failCount = 0;
        
        for (let i = 0; i < timeSlots.length; i++) {
          try {
            const timeSlot = timeSlots[i];
            const payload = {
              doctorId: doctorId,
              date: formData.availableDate,
              time: timeSlot,
              isBooked: false
            };
            console.log("Creating slot:", payload);
            await availabilityService.addAvailability(payload);
            successCount++;
            setCreationProgress({ current: i + 1, total: timeSlots.length });
            // Small delay to prevent ID collision
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            console.error(`Failed to create slot ${timeSlots[i]}:`, error);
            failCount++;
          }
        }
        
        setIsCreatingSlots(false);
        
        if (failCount > 0) {
          alert(`Created ${successCount} slots successfully, but ${failCount} failed. Please check for duplicates.`);
        } else {
          alert(`Successfully created ${successCount} availability slots!`);
        }
      }

      setShowModal(false);
      fetchAvailabilities();
    } catch (error) {
      console.error("Error saving availability:", error);
      console.error("Error response data:", error.response?.data);
      
      // Extract error message from backend response
      let errorMessage = "Failed to save availability";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.errors) {
          // Handle ASP.NET validation errors
          const errors = Object.values(error.response.data.errors).flat();
          errorMessage = errors.join(', ');
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title;
        }
      }
      setError(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    // If it's in HH:mm:ss format, convert to 12-hour format
    const timeParts = timeString.split(':');
    const hours = timeParts[0];
    const minutes = timeParts[1] || '00';
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DoctorSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Availability Management</h1>
              <p className="text-gray-500 text-sm">Manage your availability schedule</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="relative">
                <div 
                  className="flex items-center space-x-3 cursor-pointer group"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${userName}&background=4f46e5&color=fff`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500">Doctor</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/doctorSettings');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8">
          {/* Add New Button */}
          <div className="mb-6">
            <button
              onClick={handleAddNew}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Availability
            </button>
          </div>

          {/* Date Filter */}
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filter by Date:</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate('')}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear Filter
                </button>
              )}
              <span className="text-sm text-gray-600">
                {filterDate ? `Showing slots for ${formatDate(filterDate)}` : 'Showing all dates'}
              </span>
            </div>
          </div>

          {/* Availabilities Table */}
          <div className="bg-white rounded-lg shadow">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="mt-2 text-gray-600">Loading availabilities...</p>
              </div>
            ) : availabilities.filter(a => !filterDate || a.date.startsWith(filterDate)).length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>{filterDate ? `No availability slots found for ${formatDate(filterDate)}` : 'No availability slots found. Add your first availability!'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {availabilities
                      .filter(a => !filterDate || a.date.startsWith(filterDate))
                      .map((availability) => (
                      <tr key={availability.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(availability.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatTime(availability.time)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            availability.isBooked 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {availability.isBooked ? 'Booked' : 'Available'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(availability)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            disabled={availability.isBooked}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(availability.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={availability.isBooked}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">
              {editMode ? 'Edit Availability' : 'Add New Availability'}
            </h2>
            
            {!editMode && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">
                  💡 <strong>Tip:</strong> Your time range will be split into 30-minute slots. 
                  For example, 12:00-14:00 creates slots at 12:00, 12:30, 13:00, and 13:30.
                </p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Date
                  </label>
                  <input
                    type="date"
                    name="availableDate"
                    value={formData.availableDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={isCreatingSlots}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={isCreatingSlots}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={isCreatingSlots}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isCreatingSlots}
                >
                  {editMode ? 'Update' : 'Add'} Availability
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                  disabled={isCreatingSlots}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading Overlay for Creating Slots */}
      {isCreatingSlots && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Creating Time Slots</h3>
            <p className="text-gray-600 mb-4">
              Please wait while we create your availability slots...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-green-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${(creationProgress.current / creationProgress.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {creationProgress.current} of {creationProgress.total} slots created
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
