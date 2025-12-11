import "../../../index.css";
import Layout from "../../../components/Layout.jsx";
import { useState, useEffect } from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaIdCard,
    FaLock,
    FaCalendar,
    FaMapMarkerAlt,
    FaArrowLeft,
    FaHeartbeat,
    FaUserInjured, FaEyeSlash, FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { registerStaff } from "../../../services/staffManagementService.js";
import { registerPatient } from "../../../services/patientManagementService.js";
import {toast} from "sonner";

export default function AddNewPatient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    conditions: "",
    medications: "",
    emergencyName: "",
    emergencyRelationship: "",
    emergencyContact: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?[\d\s-]{10,15}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|:;"'<>,.?/-])(?=.{8,}).*$/;

      if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    // if (!formData.bloodType) newErrors.bloodType = 'Blood type is required';
    if (!formData.address) newErrors.address = "Address is required";
      if (!formData.password) {
          newErrors.password = "Password is required";
      } else if (!passwordRegex.test(formData.password)) {
          newErrors.password = "Password should be minimum of 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character";
      }
      if (!confirmPassword) {
          newErrors.confirmPassword = "Confirm Password is required";
      } else if (!passwordRegex.test(confirmPassword)) {
          newErrors.confirmPassword = "Confirm Password should be minimum of 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character";
      }
      if (!newErrors.confirmPassword && formData.password !== confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
      }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
      };
      console.log("Submitting patient data: ", payload);
      const response = await registerPatient(payload);
      console.log("Patient created successfully:", response);
      toast.success("Patient added successfully!");
      navigate("/managerPatientInfo");
    } catch (error) {
      console.error("Error adding patient:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        console.error("Backend Validation Errors:", error.response.data.errors);
        toast.error("Failed to add patient. Please try again.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to add patient. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All entered data will be lost."
      )
    ) {
      navigate("/managerPatientInfo");
    }
  };

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prev => !prev);
    };
    
  return (
    <Layout role="manager">
      <div className="w-full max-w-full overflow-hidden">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-heading">Add New Patient</h1>
            <p className="text-muted mt-1">
              Fill in the details to register a new patient
            </p>
          </div>
          <button
            onClick={() => navigate("/managerPatientInfo")}
            className="flex items-center gap-2 px-4 py-2 text-muted hover:text-heading transition-colors"
          >
            <FaArrowLeft size={16} />
            <span>Back to Patients</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Card */}
          <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                <FaUser className="text-ondark" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-heading">
                  Personal Information
                </h2>
                <p className="text-sm text-muted">
                  Basic details about the patient
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  First Name <span className="text-accent-danger">*</span>
                </label>
                <div className="relative">
                  <FaUser
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                    size={16}
                  />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                      errors.firstName ? "border-accent-danger" : "border-input"
                    }`}
                    placeholder="Enter first name"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-accent-danger text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Last Name <span className="text-accent-danger">*</span>
                </label>
                <div className="relative">
                  <FaUser
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                    size={16}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                      errors.lastName ? "border-accent-danger" : "border-input"
                    }`}
                    placeholder="Enter last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-accent-danger text-xs mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Email Address <span className="text-accent-danger">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                    size={16}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                      errors.email ? "border-accent-danger" : "border-input"
                    }`}
                    placeholder="patient@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-accent-danger text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Phone Number <span className="text-accent-danger">*</span>
                </label>
                <div className="relative">
                  <FaPhone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                    size={16}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                      errors.phone ? "border-accent-danger" : "border-input"
                    }`}
                    placeholder="+60 12-345 6789"
                  />
                </div>
                {errors.phone && (
                  <p className="text-accent-danger text-xs mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                        Password <span className="text-accent-danger">*</span>
                    </label>
                    <div className="relative">
                        <FaLock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                            size={16}
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                                errors.password ? "border-accent-danger" : "border-input"
                            }`}
                            placeholder="Enter password"
                        />
                        <div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted cursor-pointer hover:text-heading transition-colors"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </div>
                    </div>
                    {errors.password && (
                        <p className="text-accent-danger text-xs mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-heading mb-2">
                        Confirm Password <span className="text-accent-danger">*</span>
                    </label>
                    <div className="relative">
                        <FaLock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                            size={16}
                        />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                                errors.confirmPassword
                                    ? "border-accent-danger"
                                    : "border-input"
                            }`}
                            placeholder="Confirm password"
                        />
                        <div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted cursor-pointer hover:text-heading transition-colors"
                            onClick={toggleConfirmPasswordVisibility}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </div>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-accent-danger text-xs mt-1">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Date of Birth <span className="text-accent-danger">*</span>
                </label>
                <div className="relative">
                  <FaCalendar
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                    size={16}
                  />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                      errors.dateOfBirth
                        ? "border-accent-danger"
                        : "border-input"
                    }`}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-accent-danger text-xs mt-1">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Gender <span className="text-accent-danger">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card ${
                    errors.gender ? "border-accent-danger" : "border-input"
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-accent-danger text-xs mt-1">
                    {errors.gender}
                  </p>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-card`}
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="Golden Blood">Golden Blood</option>
                </select>
                {/*{errors.bloodGroup && <p className="text-accent-danger text-xs mt-1">{errors.bloodGroup}</p>}*/}
              </div>
            </div>
          </div>

          {/* Medical Information Card */}
          <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
                <FaHeartbeat className="text-ondark" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-heading">
                  Medical Information
                </h2>
                <p className="text-sm text-muted">
                  Health conditions and medications
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Allergies
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="e.g., Penicillin, Peanuts (leave empty if none)"
                />
              </div>

              {/* Conditions */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Medical Conditions
                </label>
                <textarea
                  name="conditions"
                  value={formData.conditions}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="e.g., Hypertension, Diabetes (leave empty if none)"
                />
              </div>

              {/* Medications */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Current Medications
                </label>
                <textarea
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="e.g., Aspirin 100mg daily (leave empty if none)"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-accent-danger bg-opacity-10 p-3 rounded-lg">
                <FaUserInjured className="text-ondark" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-heading">
                  Emergency Contact
                </h2>
                <p className="text-sm text-muted">
                  Person to contact in case of emergency
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Emergency Contact Name */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Contact Name
                </label>
                <div className="relative">
                  <FaUser
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                    size={16}
                  />
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Enter name"
                  />
                </div>
              </div>

              {/* Emergency Relationship */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Relationship
                </label>
                <input
                  type="text"
                  name="emergencyRelationship"
                  value={formData.emergencyRelationship}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              </div>

              {/* Emergency Phone */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Contact Phone
                </label>
                <div className="relative">
                  <FaPhone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted"
                    size={16}
                  />
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="+60 12-345 6789"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information Card */}
          <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-accent-sky bg-opacity-10 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-ondark" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-heading">
                  Address Information
                </h2>
                <p className="text-sm text-muted">
                  Current residential address
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Address <span className="text-accent-danger">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="Enter complete residential address"
                />
                {errors.address && (
                  <p className="text-accent-danger text-xs mt-1">
                    {errors.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-color rounded-lg text-heading font-medium hover:bg-main transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-ondark rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Adding Patient...</span>
                </>
              ) : (
                <>
                  <FaUser size={18} />
                  <span>Add Patient</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
