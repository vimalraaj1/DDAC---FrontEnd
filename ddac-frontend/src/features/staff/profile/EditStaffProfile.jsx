import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import * as profileService from "../services/profileService";
import {
  FaUser,
  FaBriefcase,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaLock,
} from "react-icons/fa";
import { toast } from "sonner";
import { getStoredStaffId } from "../utils/staffStorage";

export default function EditStaffProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    bloodGroup: "",
    emergencyContact: "",
    role: "",
    department: "",
    joiningDate: "",
    yearsOfExperience: "",
    salary: "",
    status: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const genderOptions = ["Male", "Female"];

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const data = await profileService.getProfile();

      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
        gender: data.gender || "Male",
        address: data.address || "",
        bloodGroup: data.bloodGroup || "",
        emergencyContact: data.emergencyContact || "",
        role: data.role || "",
        department: data.department || "",
        joiningDate: data.joiningDate ? data.joiningDate.split("T")[0] : "",
        yearsOfExperience: data.yearsOfExperience || "",
        salary: data.salary || "",
        status: data.status || "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = "Invalid phone number";

    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (formData.emergencyContact && !phoneRegex.test(formData.emergencyContact)) {
      newErrors.emergencyContact = "Invalid phone number";
    }

    // Password validation
    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Only editable fields plus read-only required by backend
      const dataToSave = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        emergencyContact: formData.emergencyContact,

        // Read-only fields still required by backend
        role: formData.role,
        department: formData.department,
        joiningDate: formData.joiningDate,
        yearsOfExperience: formData.yearsOfExperience,
        salary: formData.salary,
        status: formData.status,
      };

      // Only include password if it was provided
      if (formData.password) {
        dataToSave.password = formData.password;
      }

      const staffId = getStoredStaffId();
      if (!staffId) {
        toast.error("Unable to determine your staff ID. Please re-login.");
        return;
      }

      await profileService.updateProfile(staffId, dataToSave);
      toast.success("Profile updated successfully!");
      navigate("/staff/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
      const errorMessage = error.response?.data?.message || "Failed to save profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      navigate("/staff/profile");
    }
  };

  if (isLoading) {
    return (
      <Layout role="staff">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-600 text-lg">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="staff">
      <div className="w-full max-w-full overflow-hidden">
        <div className="mb-6">
          <Link
            to="/staff/profile"
            className="flex items-center gap-2 px-4 py-2 text-muted hover:text-heading transition-colors mb-4"
          >
            <FaArrowLeft size={16} />
            <span>Back to Profile</span>
          </Link>
          <h1 className="text-3xl font-bold text-heading">Edit Profile</h1>
          <p className="text-muted mt-1">Update your personal information</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-soft p-6 border border-color">
          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-heading mb-4 flex items-center gap-2">
              <FaUser size={20} />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  First Name <span className="text-accent-danger">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.firstName ? "border-accent-danger" : "border-input"
                  }`}
                />
                {errors.firstName && <p className="text-accent-danger text-xs mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Last Name <span className="text-accent-danger">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.lastName ? "border-accent-danger" : "border-input"
                  }`}
                />
                {errors.lastName && <p className="text-accent-danger text-xs mt-1">{errors.lastName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Email <span className="text-accent-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.email ? "border-accent-danger" : "border-input"
                  }`}
                />
                {errors.email && <p className="text-accent-danger text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Phone <span className="text-accent-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.phone ? "border-accent-danger" : "border-input"
                  }`}
                />
                {errors.phone && <p className="text-accent-danger text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Date of Birth <span className="text-accent-danger">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.dateOfBirth ? "border-accent-danger" : "border-input"
                  }`}
                />
                {errors.dateOfBirth && <p className="text-accent-danger text-xs mt-1">{errors.dateOfBirth}</p>}
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
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.gender ? "border-accent-danger" : "border-input"
                  }`}
                >
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.gender && <p className="text-accent-danger text-xs mt-1">{errors.gender}</p>}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-heading mb-2">
                  Address <span className="text-accent-danger">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.address ? "border-accent-danger" : "border-input"
                  }`}
                />
                {errors.address && <p className="text-accent-danger text-xs mt-1">{errors.address}</p>}
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">Blood Group</label>
                <input
                  type="text"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">Emergency Contact</label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="mb-8 pt-6 border-t border-color">
            <h2 className="text-xl font-semibold text-heading mb-4 flex items-center gap-2">
              <FaLock size={20} />
              Change Password
            </h2>
            <p className="text-sm text-muted mb-4">Leave blank if you don't want to change your password</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.password ? "border-accent-danger" : "border-input"
                  }`}
                />
                {errors.password && <p className="text-accent-danger text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-heading mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.confirmPassword ? "border-accent-danger" : "border-input"
                  }`}
                />
                {errors.confirmPassword && <p className="text-accent-danger text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Read-only Employment Info */}
          <div className="mb-8 pt-6 border-t border-color">
            <h2 className="text-xl font-semibold text-heading mb-4 flex items-center gap-2">
              <FaBriefcase size={20} />
              Employment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["Role", formData.role],
                ["Department", formData.department],
                ["Joining Date", formData.joiningDate],
                ["Years of Experience", formData.yearsOfExperience],
                ["Salary", formData.salary],
                ["Status", formData.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-heading mb-2">{label}</label>
                  <input type="text" value={value} disabled className="w-full px-4 py-2 border border-input rounded-lg bg-gray-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-color">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-3 bg-main text-heading rounded-lg font-medium hover:bg-opacity-80 transition-colors"
            >
              <FaTimes size={16} />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-ondark rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave size={16} />
              <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}