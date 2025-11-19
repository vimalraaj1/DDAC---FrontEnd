import { useState } from "react";
import {
  Settings,
  User,
  Phone,
  Mail,
  Home,
  Droplet,
  AlertCircle,
  Heart,
  Pill,
  UserPlus,
  Lock,
  Bell,
  Globe,
  Trash2,
  Edit2,
  Calendar,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Card } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import CustNavBar from "../components/CustNavBar";

export default function App() {
  const [editMode, setEditMode] = useState({
    personal: false,
    medical: false,
  });

  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Sarah Johnson",
    dateOfBirth: "1985-03-15",
    gender: "Female",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
    address: "123 Oak Street, Apt 4B, Boston, MA 02101",
  });

  const [medicalInfo, setMedicalInfo] = useState({
    bloodType: "A+",
    allergies: "Penicillin, Peanuts",
    conditions: "Hypertension, Type 2 Diabetes",
    medications: "Metformin 500mg, Lisinopril 10mg",
    emergencyName: "Michael Johnson",
    emergencyRelationship: "Spouse",
    emergencyContact: "+1 (555) 987-6543",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
  });

  // Validation states
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    phone: "",
    emergencyContact: "",
  });

  // Password change states
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePhone = (phone: string) => {
    const phoneRegex =
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!phone) {
      return "Phone number is required";
    }
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return "Please enter a valid phone number";
    }
    return "";
  };

  const handleEmailChange = (email: string) => {
    setPersonalInfo({ ...personalInfo, email });
    if (editMode.personal) {
      setValidationErrors({
        ...validationErrors,
        email: validateEmail(email),
      });
    }
  };

  const handlePhoneChange = (phone: string) => {
    setPersonalInfo({ ...personalInfo, phone });
    if (editMode.personal) {
      setValidationErrors({
        ...validationErrors,
        phone: validatePhone(phone),
      });
    }
  };

  const handleEmergencyContactChange = (contact: string) => {
    setMedicalInfo({ ...medicalInfo, emergencyContact: contact });
    if (editMode.medical) {
      setValidationErrors({
        ...validationErrors,
        emergencyContact: validatePhone(contact),
      });
    }
  };

  const handlePasswordChange = () => {
    // Reset error
    setPasswordError("");

    // Validate passwords
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwords.new.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }

    // Success - in real app, this would call an API
    alert("Password changed successfully!");
    setPasswordDialog(false);
    setPasswords({ current: "", new: "", confirm: "" });
    setPasswordError("");
  };

  const handleDeactivateAccount = () => {
    // In real app, this would call an API
    alert("Account deactivated");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-main)" }}>
      <CustNavBar />
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Profile Overview Card */}
          <Card
            className="p-8 rounded-xl shadow-sm"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <User
                  className="w-12 h-12"
                  style={{ color: "var(--primary)" }}
                />
              </div>

              {/* Patient Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 style={{ color: "var(--text-heading)" }}>
                  {personalInfo.fullName}
                </h2>
                <p className="mt-1" style={{ color: "var(--text-muted)" }}>
                  Patient ID: P-02491
                </p>

                {/* Brief Info */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Calendar
                      className="w-4 h-4"
                      style={{ color: "var(--accent-teal)" }}
                    />
                    <span style={{ color: "var(--text-body)" }}>39 years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users
                      className="w-4 h-4"
                      style={{ color: "var(--accent-teal)" }}
                    />
                    <span style={{ color: "var(--text-body)" }}>
                      {personalInfo.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplet
                      className="w-4 h-4"
                      style={{ color: "var(--accent-danger)" }}
                    />
                    <span style={{ color: "var(--text-body)" }}>
                      {medicalInfo.bloodType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Information Card */}
          <Card
            className="p-6 rounded-xl shadow-sm"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ color: "var(--text-heading)" }}>
                Personal Information
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="border-[#4EA5D9] text-[#4EA5D9] hover:bg-[#dcf0fc] rounded-xl cursor-pointer"
                onClick={() =>
                  setEditMode({ ...editMode, personal: !editMode.personal })
                }
              >
                {editMode.personal ? "Save" : "Edit"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label style={{ color: "var(--text-body)" }}>
                  <User
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  Full Name
                </Label>
                <Input
                  value={personalInfo.fullName}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      fullName: e.target.value,
                    })
                  }
                  disabled={!editMode.personal}
                  className="mt-2 rounded-lg"
                  style={{ borderColor: "var(--input-border)" }}
                />
              </div>

              <div>
                <Label style={{ color: "var(--text-body)" }}>
                  <Calendar
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      dateOfBirth: e.target.value,
                    })
                  }
                  disabled={!editMode.personal}
                  className="mt-2 rounded-lg"
                  style={{ borderColor: "var(--input-border)" }}
                />
              </div>

              <div>
                <Label style={{ color: "var(--text-body)" }}>
                  <Users
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  Gender
                </Label>
                <Input
                  value={personalInfo.gender}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, gender: e.target.value })
                  }
                  disabled={!editMode.personal}
                  className="mt-2 rounded-lg"
                  style={{ borderColor: "var(--input-border)" }}
                />
              </div>

              <div>
                <Label style={{ color: "var(--text-body)" }}>
                  <Phone
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  Phone Number
                </Label>
                <Input
                  value={personalInfo.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  disabled={!editMode.personal}
                  className="mt-2 rounded-lg"
                  style={{ borderColor: "var(--input-border)" }}
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <Label style={{ color: "var(--text-body)" }}>
                  <Mail
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  Email Address
                </Label>
                <Input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  disabled={!editMode.personal}
                  className="mt-2 rounded-lg"
                  style={{ borderColor: "var(--input-border)" }}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Label style={{ color: "var(--text-body)" }}>
                  <Home
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  Home Address
                </Label>
                <Input
                  value={personalInfo.address}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      address: e.target.value,
                    })
                  }
                  disabled={!editMode.personal}
                  className="mt-2 rounded-lg"
                  style={{ borderColor: "var(--input-border)" }}
                />
              </div>
            </div>
          </Card>

          {/* Medical Information Card */}
          <Card
            className="p-6 rounded-xl shadow-sm"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ color: "var(--text-heading)" }}>
                Medical Information
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="border-[#4EA5D9] text-[#4EA5D9] hover:bg-[#dcf0fc] rounded-xl cursor-pointer"
                onClick={() =>
                  setEditMode({ ...editMode, medical: !editMode.medical })
                }
              >
                {editMode.medical ? "Save" : "Edit"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label style={{ color: "var(--text-body)" }}>
                  <Droplet
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--accent-danger)" }}
                  />
                  Blood Type
                </Label>
                <Input
                  value={medicalInfo.bloodType}
                  onChange={(e) =>
                    setMedicalInfo({
                      ...medicalInfo,
                      bloodType: e.target.value,
                    })
                  }
                  disabled={!editMode.medical}
                  className="mt-2 rounded-lg"
                  style={{ borderColor: "var(--input-border)" }}
                />
              </div>

              <div>
                <Label style={{ color: "var(--text-body)" }}>
                  <AlertCircle
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--accent-warning)" }}
                  />
                  Allergies
                </Label>
                <Input
                  value={medicalInfo.allergies}
                  onChange={(e) =>
                    setMedicalInfo({
                      ...medicalInfo,
                      allergies: e.target.value,
                    })
                  }
                  disabled={!editMode.medical}
                  className="mt-2 rounded-lg"
                  style={{ borderColor: "var(--input-border)" }}
                />
              </div>

              <div className="md:col-span-2">
                <Label style={{ color: "var(--text-body)" }}>
                  <Heart
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--accent-danger)" }}
                  />
                  Existing Conditions
                </Label>
                <Input
                  value={medicalInfo.conditions}
                  onChange={(e) =>
                    setMedicalInfo({
                      ...medicalInfo,
                      conditions: e.target.value,
                    })
                  }
                  disabled={!editMode.medical}
                  className="mt-2 rounded-lg"
                  style={{ borderColor: "var(--input-border)" }}
                />
              </div>

              <div className="md:col-span-2">
                <Label style={{ color: "var(--text-body)" }}>
                  <Pill
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--accent-teal)" }}
                  />
                  Current Medications
                </Label>
                <Input
                  value={medicalInfo.medications}
                  onChange={(e) =>
                    setMedicalInfo({
                      ...medicalInfo,
                      medications: e.target.value,
                    })
                  }
                  disabled={!editMode.medical}
                  className="mt-2 rounded-lg"
                  style={{ borderColor: "var(--input-border)" }}
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <h4 style={{ color: "var(--text-heading)" }} className="mb-4">
                  <UserPlus
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--primary)" }}
                  />
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label style={{ color: "var(--text-body)" }}>Name</Label>
                    <Input
                      value={medicalInfo.emergencyName}
                      onChange={(e) =>
                        setMedicalInfo({
                          ...medicalInfo,
                          emergencyName: e.target.value,
                        })
                      }
                      disabled={!editMode.medical}
                      className="mt-2 rounded-lg"
                      style={{ borderColor: "var(--input-border)" }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--text-body)" }}>
                      Relationship
                    </Label>
                    <Input
                      value={medicalInfo.emergencyRelationship}
                      onChange={(e) =>
                        setMedicalInfo({
                          ...medicalInfo,
                          emergencyRelationship: e.target.value,
                        })
                      }
                      disabled={!editMode.medical}
                      className="mt-2 rounded-lg"
                      style={{ borderColor: "var(--input-border)" }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--text-body)" }}>
                      Contact Number
                    </Label>
                    <Input
                      value={medicalInfo.emergencyContact}
                      onChange={(e) =>
                        handleEmergencyContactChange(e.target.value)
                      }
                      disabled={!editMode.medical}
                      className="mt-2 rounded-lg"
                      style={{ borderColor: "var(--input-border)" }}
                    />
                    {validationErrors.emergencyContact && (
                      <p className="text-red-500 text-sm mt-1">
                        {validationErrors.emergencyContact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Settings Card */}
          <Card
            className="p-6 rounded-xl shadow-sm"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <h3 className="mb-6" style={{ color: "var(--text-heading)" }}>
              Account Settings
            </h3>

            <div className="space-y-6">
              {/* Change Password */}
              <div>
                <h4 style={{ color: "var(--text-body)" }} className="mb-3">
                  <Lock
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  Change Password
                </h4>
                <Button
                  variant="outline"
                  className="border-[#4EA5D9] text-[#4EA5D9] hover:bg-[#dcf0fc] rounded-xl cursor-pointer"
                  onClick={() => setPasswordDialog(true)}
                >
                  Update Password
                </Button>
              </div>

              {/* Notification Preferences */}
              <div
                className="pt-4 border-t"
                style={{ borderColor: "var(--input-border)" }}
              >
                <h4 style={{ color: "var(--text-body)" }} className="mb-4">
                  <Bell
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  Notification Preferences
                </h4>
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <Label style={{ color: "var(--text-body)" }}>
                        Email Notifications
                      </Label>
                      <p style={{ color: "var(--text-muted)" }}>
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <Label style={{ color: "var(--text-body)" }}>
                        SMS Notifications
                      </Label>
                      <p style={{ color: "var(--text-muted)" }}>
                        Receive text messages
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          smsNotifications: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <Label style={{ color: "var(--text-body)" }}>
                        Appointment Reminders
                      </Label>
                      <p style={{ color: "var(--text-muted)" }}>
                        Get reminded about appointments
                      </p>
                    </div>
                    <Switch
                      checked={notifications.appointmentReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          appointmentReminders: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Language Preference */}
              <div
                className="pt-4 border-t"
                style={{ borderColor: "var(--input-border)" }}
              >
                <Label
                  style={{ color: "var(--text-body)" }}
                  className="mb-2 block"
                >
                  <Globe
                    className="w-4 h-4 inline mr-2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  Language Preference
                </Label>
                <select
                  className="w-full md:w-64 px-3 py-2 rounded-lg border"
                  style={{
                    borderColor: "var(--input-border)",
                    color: "var(--text-body)",
                  }}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
        <DialogContent className="sm:max-w-[550px] bg-white border-[#DCEFFB] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password to update your
              account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  className="w-full px-3 py-2 border rounded-lg pr-10"
                  style={{
                    borderColor: "var(--input-border)",
                    color: "var(--text-body)",
                  }}
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }
                >
                  {showPasswords.current ? (
                    <EyeOff
                      className="w-4 h-4"
                      style={{ color: "var(--text-muted)" }}
                    />
                  ) : (
                    <Eye
                      className="w-4 h-4"
                      style={{ color: "var(--text-muted)" }}
                    />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                New Password
              </Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  className="w-full px-3 py-2 border rounded-lg pr-10"
                  style={{
                    borderColor: "var(--input-border)",
                    color: "var(--text-body)",
                  }}
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                >
                  {showPasswords.new ? (
                    <EyeOff
                      className="w-4 h-4"
                      style={{ color: "var(--text-muted)" }}
                    />
                  ) : (
                    <Eye
                      className="w-4 h-4"
                      style={{ color: "var(--text-muted)" }}
                    />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  className="w-full px-3 py-2 border rounded-lg pr-10"
                  style={{
                    borderColor: "var(--input-border)",
                    color: "var(--text-body)",
                  }}
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  onClick={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                >
                  {showPasswords.confirm ? (
                    <EyeOff
                      className="w-4 h-4"
                      style={{ color: "var(--text-muted)" }}
                    />
                  ) : (
                    <Eye
                      className="w-4 h-4"
                      style={{ color: "var(--text-muted)" }}
                    />
                  )}
                </button>
              </div>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-[#DCEFFB] text-[#7A7A7A] hover:bg-[#F5F7FA] rounded-xl cursor-pointer"
              onClick={() => setPasswordDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#4EA5D9] hover:bg-[#3f93c4] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              onClick={handlePasswordChange}
            >
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
