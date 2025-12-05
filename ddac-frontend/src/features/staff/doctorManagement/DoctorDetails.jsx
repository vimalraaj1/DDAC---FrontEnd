import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import * as doctorService from "../services/doctorService";
import {
  FaArrowLeft,
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaStethoscope,
  FaIdCard,
  FaCalendar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaHospital,
  FaUserCircle,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { toast } from "sonner";

export default function DoctorDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    loadDoctor();
  }, [id]);

  const loadDoctor = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getDoctorById(id);
      setDoctor(data);
    } catch (error) {
      console.error("Error loading doctor:", error);
      toast.error("Failed to load doctor details. Please try again.");
      navigate("/staff/doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/staff/doctors");
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: FaUserCircle },
    { id: "professional", label: "Professional", icon: FaStethoscope },
    { id: "employment", label: "Employment", icon: FaBriefcase },
  ];

  if (loading) {
    return (
      <Layout role="staff">
        <div className="w-full max-w-full overflow-hidden flex items-center justify-center min-h-screen">
          <p className="text-muted">Loading doctor details...</p>
        </div>
      </Layout>
    );
  }

  if (!doctor) {
    return (
      <Layout role="staff">
        <div className="w-full max-w-full overflow-hidden flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted mb-4">Doctor not found</p>
            <Link to="/staff/doctors" className="text-primary hover:underline">
              Back to Doctors
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const firstName = doctor.firstName || "";
  const lastName = doctor.lastName || "";
  const specialization = doctor.specialization || doctor.specialty || "N/A";
  const status = (doctor.status || "active").toLowerCase();
  const isActive = status === "active";

  return (
    <Layout role="staff">
      <div className="w-full max-w-full overflow-hidden">
        {/* Header Actions */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-muted hover:text-heading transition-colors"
          >
            <FaArrowLeft size={16} />
            <span>Back to Doctors</span>
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-card rounded-xl shadow-soft overflow-hidden mb-6">
          {/* Cover Background */}
          <div className="h-32 bg-gradient-to-r from-primary to-primary-light"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center text-primary text-4xl font-bold">
                  {firstName.charAt(0).toUpperCase()}
                  {lastName.charAt(0).toUpperCase()}
                </div>
                <div
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-card ${
                    isActive ? "bg-accent-success" : "bg-accent-warning"
                  }`}
                ></div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-heading mb-2">
                      Dr. {firstName} {lastName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary bg-opacity-10 text-ondark rounded-full text-sm font-medium">
                        <FaStethoscope size={14} />
                        {specialization}
                      </span>
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          isActive
                            ? "bg-accent-success bg-opacity-10 text-ondark"
                            : "bg-accent-warning bg-opacity-10 text-ondark"
                        }`}
                      >
                        {isActive ? (
                          <>
                            <FaCheckCircle size={12} />
                            Active
                          </>
                        ) : (
                          <>
                            <FaClock size={12} />
                            Inactive
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-muted text-sm">Doctor ID: {doctor.id || doctor.doctorId || "N/A"}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-main rounded-lg p-4">
                    <p className="text-muted text-xs mb-1">Total Patients</p>
                    <p className="text-heading text-2xl font-bold">{doctor.totalPatients || doctor.patients || 0}</p>
                  </div>
                  <div className="bg-main rounded-lg p-4">
                    <p className="text-muted text-xs mb-1">Experience</p>
                    <p className="text-heading text-2xl font-bold">
                      {doctor.yearsOfExperience || doctor.experience || 0} yrs
                    </p>
                  </div>
                  <div className="bg-main rounded-lg p-4">
                    <p className="text-muted text-xs mb-1">Today&apos;s Appointments</p>
                    <p className="text-heading text-2xl font-bold">{doctor.appointmentsToday || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <div className="border-b border-color">
            <div className="flex gap-1 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted hover:text-heading"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoItem icon={FaUserMd} label="Full Name" value={`Dr. ${firstName} ${lastName}`} />
                {doctor.dateOfBirth && (
                  <InfoItem icon={FaCalendar} label="Date of Birth" value={doctor.dateOfBirth} />
                )}
                {doctor.gender && <InfoItem icon={FaUserCircle} label="Gender" value={doctor.gender} />}
                {doctor.bloodGroup && <InfoItem icon={FaUserCircle} label="Blood Group" value={doctor.bloodGroup} />}
                {doctor.email && <InfoItem icon={FaEnvelope} label="Email Address" value={doctor.email} />}
                {doctor.phone && <InfoItem icon={FaPhone} label="Phone Number" value={doctor.phone} />}
                {doctor.emergencyContact && (
                  <InfoItem icon={FaPhone} label="Emergency Contact" value={doctor.emergencyContact} />
                )}
                {doctor.address && (
                  <div className="md:col-span-2">
                    <InfoItem icon={FaMapMarkerAlt} label="Address" value={doctor.address} />
                  </div>
                )}
              </div>
            )}

            {activeTab === "professional" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoItem icon={FaStethoscope} label="Specialization" value={specialization} />
                {doctor.licenseNumber && (
                  <InfoItem icon={FaIdCard} label="License Number" value={doctor.licenseNumber} />
                )}
                <InfoItem
                  icon={FaBriefcase}
                  label="Years of Experience"
                  value={`${doctor.yearsOfExperience || doctor.experience || 0} years`}
                />
                {doctor.department && <InfoItem icon={FaHospital} label="Department" value={doctor.department} />}
                <InfoItem
                  icon={FaUserMd}
                  label="Total Patients Treated"
                  value={doctor.totalPatients || doctor.patients || 0}
                />
                <InfoItem
                  icon={FaCalendar}
                  label="Today&apos;s Appointments"
                  value={doctor.appointmentsToday || 0}
                />
              </div>
            )}

            {activeTab === "employment" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {doctor.joiningDate && (
                  <InfoItem icon={FaCalendar} label="Joining Date" value={doctor.joiningDate} />
                )}
                {doctor.department && <InfoItem icon={FaBriefcase} label="Department" value={doctor.department} />}
                {doctor.salary && (
                  <InfoItem
                    icon={FaBriefcase}
                    label="Monthly Salary"
                    value={`RM ${parseInt(doctor.salary).toLocaleString()}`}
                  />
                )}
                <InfoItem
                  icon={FaCheckCircle}
                  label="Employment Status"
                  value={isActive ? "Active" : "Inactive"}
                  valueColor={isActive ? "text-accent-success" : "text-accent-warning"}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Reusable Info Item Component
function InfoItem({ icon: Icon, label, value, valueColor = "text-heading" }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
        <Icon className="text-ondark" size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-muted text-sm mb-1">{label}</p>
        <p className={`${valueColor} font-medium break-words`}>{value || "Not provided"}</p>
      </div>
    </div>
  );
}

