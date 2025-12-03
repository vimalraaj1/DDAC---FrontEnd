import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import * as profileService from "../services/profileService";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaEdit,
  FaIdCard,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "sonner";
import { formatStaffDate } from "../utils/dateFormat";

export default function StaffProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const data = await profileService.getProfile();
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile data. Please try again.");
      setProfileData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate tenure (years with company)
  const calculateTenure = (joiningDate) => {
    if (!joiningDate) return null;
    const joinDate = new Date(joiningDate);
    const today = new Date();
    let years = today.getFullYear() - joinDate.getFullYear();
    const monthDiff = today.getMonth() - joinDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < joinDate.getDate())) {
      years--;
    }
    return years;
  };

  // Format date for display
  const formatDate = (dateStr) => formatStaffDate(dateStr);

  // Get status color and text
  const getStatusDisplay = (status) => {
    if (!status) return { color: "bg-primary bg-opacity-10 text-ondark", text: "N/A", icon: <FaCheckCircle /> };
    switch (status.toLowerCase()) {
      case "active":
        return {
          color: "bg-accent-success bg-opacity-10 text-ondark",
          text: "Active",
          icon: <FaCheckCircle />,
        };
      case "on leave":
        return {
          color: "bg-accent-warning bg-opacity-10 text-ondark",
          text: "On Leave",
          icon: <FaClock />,
        };
      default:
        return {
          color: "bg-primary bg-opacity-10 text-ondark",
          text: status,
          icon: <FaCheckCircle />,
        };
    }
  };

  const handleEditProfile = () => {
    navigate(`/staff/profile/edit`);
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout role="staff">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-muted text-lg">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout role="staff">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <FaUser size={64} className="text-muted opacity-50 mx-auto mb-4" />
            <p className="text-heading text-xl font-semibold">Profile not found</p>
            <p className="text-muted mt-2">Unable to load your profile. Please try again later.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const statusDisplay = getStatusDisplay(profileData.status);
  const tenure = profileData.joiningDate ? calculateTenure(profileData.joiningDate) : null;
  const firstName = profileData.firstName || "";
  const lastName = profileData.lastName || "";
  const fullName = profileData.fullName || `${firstName} ${lastName}`.trim() || "Staff Member";

  return (
    <Layout role="staff">
      <div className="w-full max-w-full overflow-hidden">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-heading">My Profile</h1>
            <p className="text-muted mt-1">View and manage your personal information</p>
          </div>
          <button
            onClick={handleEditProfile}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-ondark rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            <FaEdit size={18} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-primary to-primary-hover rounded-xl shadow-soft p-8 mb-6 text-ondark">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-primary text-ondark flex items-center justify-center text-3xl font-bold flex-shrink-0">
              {firstName && lastName
                ? `${firstName.charAt(0)}${lastName.charAt(0)}`
                : fullName.charAt(0).toUpperCase()}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2 text-primary">{fullName}</h2>
              {profileData.position && <p className="text-xl mb-3 opacity-90 text-primary">{profileData.position}</p>}
              <div className="flex items-center gap-4 flex-wrap">
                {profileData.id && (
                  <div className="flex items-center gap-2 text-primary">
                    <FaIdCard size={16} />
                    <span className="text-sm font-medium">{profileData.id}</span>
                  </div>
                )}
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusDisplay.color.replace(
                    "text-",
                    "text-ondark "
                  )}`}
                >
                  {statusDisplay.icon}
                  <span className="text-sm font-semibold">{statusDisplay.text}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {tenure !== null && profileData.yearsOfExperience && (
              <div className="hidden lg:flex gap-6">
                {tenure !== null && (
                  <div className="text-center text-primary">
                    <p className="text-3xl font-bold">{tenure}</p>
                    <p className="text-sm opacity-80">Years Here</p>
                  </div>
                )}
                {profileData.yearsOfExperience && (
                  <div className="text-center text-primary">
                    <p className="text-3xl font-bold">{profileData.yearsOfExperience}</p>
                    <p className="text-sm opacity-80">Total Experience</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="bg-card rounded-xl shadow-soft p-6 border border-color mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
              <FaUser className="text-ondark" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-heading">Personal Information</h2>
              <p className="text-sm text-muted">Basic details and contact information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <p className="text-xs text-muted mb-2">First Name</p>
              <p className="text-body font-medium">{profileData.firstName || "Not provided"}</p>
            </div>

            {/* Last Name */}
            <div>
              <p className="text-xs text-muted mb-2">Last Name</p>
              <p className="text-body font-medium">{profileData.lastName || "Not provided"}</p>
            </div>

            {/* Email */}
            <div>
              <p className="text-xs text-muted mb-2 flex items-center gap-2">
                <FaEnvelope size={12} />
                Email Address
              </p>
              <p className="text-body font-medium">{profileData.email || "Not provided"}</p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs text-muted mb-2 flex items-center gap-2">
                <FaPhone size={12} />
                Phone Number
              </p>
              <p className="text-body font-medium">{profileData.phone || "Not provided"}</p>
            </div>

            {/* Date of Birth */}
            <div>
              <p className="text-xs text-muted mb-2 flex items-center gap-2">
                <FaCalendar size={12} />
                Date of Birth
              </p>
              <p className="text-body font-medium">
                {profileData.dateOfBirth
                  ? `${formatDate(profileData.dateOfBirth)}${
                      calculateAge(profileData.dateOfBirth) !== null
                        ? ` (${calculateAge(profileData.dateOfBirth)} years)`
                        : ""
                    }`
                  : "Not provided"}
              </p>
            </div>

            {/* Gender */}
            <div>
              <p className="text-xs text-muted mb-2">Gender</p>
              <p className="text-body font-medium capitalize">{profileData.gender || "Not provided"}</p>
            </div>

            {/* Blood Group */}
            <div>
              <p className="text-xs text-muted mb-2">Blood Group</p>
              <p className="text-body font-medium">
                {profileData.bloodGroup ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-danger bg-opacity-10 text-ondark font-semibold">
                    {profileData.bloodGroup}
                  </span>
                ) : (
                  "Not provided"
                )}
              </p>
            </div>

            {/* Emergency Contact */}
            <div>
              <p className="text-xs text-muted mb-2 flex items-center gap-2">
                <FaPhone size={12} />
                Emergency Contact
              </p>
              <p className="text-body font-medium">{profileData.emergencyContact || "Not provided"}</p>
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="mt-6 pt-6 border-t border-color">
            <p className="text-xs text-muted mb-2 flex items-center gap-2">
              <FaMapMarkerAlt size={12} />
              Residential Address
            </p>
            <p className="text-body font-medium">{profileData.address || "Not provided"}</p>
          </div>
        </div>

        {/* Professional Information Card */}
        <div className="bg-card rounded-xl shadow-soft p-6 border border-color">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-accent-success bg-opacity-10 p-3 rounded-lg">
              <FaBriefcase className="text-ondark" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-heading">Professional Information</h2>
              <p className="text-sm text-muted">Employment details and credentials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Position */}
            <div>
              <p className="text-xs text-muted mb-2 flex items-center gap-2">
                <FaBriefcase size={12} />
                Position
              </p>
              <p className="text-body font-medium">{profileData.position || "Not provided"}</p>
            </div>

            {/* Joining Date */}
            <div>
              <p className="text-xs text-muted mb-2 flex items-center gap-2">
                <FaCalendar size={12} />
                Joining Date
              </p>
              <p className="text-body font-medium">
                {profileData.joiningDate
                  ? `${formatDate(profileData.joiningDate)}${tenure !== null ? ` (${tenure} years)` : ""}`
                  : "Not provided"}
              </p>
            </div>

            {/* Years of Experience */}
            <div>
              <p className="text-xs text-muted mb-2 flex items-center gap-2">
                <FaClock size={12} />
                Years of Experience
              </p>
              <p className="text-body font-medium">
                {profileData.yearsOfExperience ? `${profileData.yearsOfExperience} years` : "Not provided"}
              </p>
            </div>

            {/* Salary */}
            <div>
              <p className="text-xs text-muted mb-2 flex items-center gap-2">
                <FaBriefcase size={12} />
                Monthly Salary
              </p>
              <p className="text-body font-medium">
                {profileData.salary
                  ? `RM ${Number(profileData.salary).toLocaleString()}`
                  : "Not provided"}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs text-muted mb-2">Status</p>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusDisplay.color} font-semibold`}>
                {statusDisplay.icon}
                <span className="text-ondark">{statusDisplay.text}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
