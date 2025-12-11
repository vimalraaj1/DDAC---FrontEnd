import { useContext, useEffect, useState } from "react";
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
import FadeInSection from "../components/animations/FadeInSection";
import Layout from "../../../components/Layout";
import { CustomerContext } from "../CustomerContext";
import {
  getPatientById,
  updatePatient,
} from "../../../services/patientManagementService";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "sonner";
import LoadingOverlay from "../components/LoadingOverlay";

export default function App() {
  const { patient, loading } = useContext(CustomerContext);

  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingMedical, setSavingMedical] = useState(false);
  const [patientDB, setPatientDB] = useState<any>();

  const [editMode, setEditMode] = useState({
    personal: false,
    medical: false,
  });

  const [isLoadingPatient, setIsLoadingPatient] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
  });

  const [medicalInfo, setMedicalInfo] = useState({
    bloodType: "None",
    allergies: "None",
    conditions: "None",
    medications: "None",
    emergencyName: "None",
    emergencyRelationship: "None",
    emergencyContact: "None",
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
    new: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [disableSave, setDisableSave] = useState(false);

  useEffect(() => {
    const hasErrors = Object.values(validationErrors).some((err) => err !== "");
    const hasEmptyFields = !personalInfo.email || !personalInfo.phone;

    setDisableSave(hasErrors || hasEmptyFields);
  }, [validationErrors, personalInfo, medicalInfo]);

  useEffect(() => {
    if (!patient?.id) return; // safety check
    fetchPatient(patient.id);
  }, [patient?.id]);

  if (loading || !patient) {
    return <LoadingSpinner />;
  }

  const fetchPatient = async (patientId: string) => {
    try {
      setIsLoadingPatient(true);
      const data = await getPatientById(patientId);

      setPatientDB(data);

      setPersonalInfo({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        address: data.address,
      });

      setMedicalInfo({
        bloodType: data.bloodGroup || "None",
        allergies: data.allergies || "None",
        conditions: data.conditions || "None",
        medications: data.medications || "None",
        emergencyName: data.emergencyName || "None",
        emergencyRelationship: data.emergencyRelationship || "None",
        emergencyContact: data.emergencyContact || "None",
      });
    } catch (error: any) {
      toast.error(
        `Errror Retrieving Patient Details! Error: ${error.response.data.message}`,
        {
          style: {
            background: "var(--accent-danger)",
            color: "#ffffff",
            borderRadius: "10px",
          },
        }
      );
    } finally {
      setIsLoadingPatient(false);
    }
  };

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
    if (!passwords.new || !passwords.confirm) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwords.new.length < 5) {
      setPasswordError("New password must be at least 5 characters");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }

    updatePasswordDB(passwords.new);

    setPasswordDialog(false);
    setPasswords({ new: "", confirm: "" });
    setPasswordError("");
  };

  const updatePasswordDB = async (newPassword: string) => {
    setIsLoadingUpdate(true);
    try {
      await updatePatient(patient.id, { ...patientDB, password: newPassword });

      toast.success("Details successfully updated!", {
        style: {
          background: "#2ECC71",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
    } catch (error: any) {
      toast.error(
        `Update Record Failed! Error: ${error.response.data.message}`,
        {
          style: {
            background: "var(--accent-danger)",
            color: "#ffffff",
            borderRadius: "10px",
          },
        }
      );
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const handlePersonalBtnClick = async () => {
    if (!editMode.personal) {
      // switch to edit mode
      setEditMode({ ...editMode, personal: true });
      return;
    }

    setSavingPersonal(true);
    toast.info("Saving...", {
      style: {
        background: "var(--text-body)",
        color: "#ffffff",
        borderRadius: "10px",
      },
    });

    const patientJSON = {
      ...patientDB,
      firstName: personalInfo.firstName || patientDB.firstName,
      lastName: personalInfo.lastName || patientDB.lastName,
      email: personalInfo.email || patientDB.email,
      phone: personalInfo.phone || patientDB.phone,
      address: personalInfo.address || patientDB.address,
      gender: personalInfo.gender || patientDB.gender,
      dateOfBirth: personalInfo.dateOfBirth || patientDB.dateOfBirth,
    };

    if (editMode.personal) {
      try {
        await updatePatient(patient.id, patientJSON);
        setPatientDB(patientJSON);
        toast.success("Details have been successfully saved!", {
          style: {
            background: "var(--accent-success)",
            color: "#ffffff",
            borderRadius: "10px",
          },
        });
      } catch (error: any) {
        if (error.response?.status === 400) {
          console.log("Validation errors:", error.response.data);
          toast.error("Validation error!", {
            style: {
              background: "var(--accent-danger)",
              color: "#ffffff",
              borderRadius: "10px",
            },
          });
        } else {
          console.error("Failed to save personal info: ", error);
          toast.error("Failed to save personal info!", {
            style: {
              background: "var(--accent-danger)",
              color: "#ffffff",
              borderRadius: "10px",
            },
          });
          return;
        }
      }finally{
        setSavingPersonal(false);
      }
    }

    setEditMode({ ...editMode, personal: !editMode.personal });
  };

  const isValidPhoneNumber = (phone: string) => {
    // Accepts: 0123456789, +60123456789, 012-3456789, etc.
    const phoneRegex = /^(\+?\d{7,15}|\d{3,15}(?:[-\s]?\d+)*)$/;
    return phoneRegex.test(phone);
  };

  const handleMedicalBtnClick = async () => {
    if (!editMode.medical) {
      // Switch to edit mode
      setEditMode({ ...editMode, medical: true });
      return;
    }

    // --- VALIDATION ---
    if (!isValidPhoneNumber(medicalInfo.emergencyContact)) {
      toast.error("Please enter a valid emergency phone number!", {
        style: {
          background: "var(--accent-danger)",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
      return;
    }

    setSavingMedical(true);
    toast.info("Saving...", {
      style: {
        background: "var(--text-body)",
        color: "#ffffff",
        borderRadius: "10px",
      },
    });

    const patientJSON = {
      ...patientDB,
      emergencyName: medicalInfo.emergencyName || patientDB.emergencyName,
      emergencyRelationship:
        medicalInfo.emergencyRelationship || patientDB.emergencyRelationship,
      emergencyContact:
        medicalInfo.emergencyContact || patientDB.emergencyContact,
      allergies: medicalInfo.allergies ?? patientDB.allergies,
      conditions: medicalInfo.conditions ?? patientDB.conditions,
      medications: medicalInfo.medications ?? patientDB.medications,
    };

    try {
      await updatePatient(patient.id, patientJSON);
      setPatientDB(patientJSON);

      toast.success("Medical details have been successfully saved!", {
        style: {
          background: "var(--accent-success)",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error("Validation error!", {
          style: {
            background: "var(--accent-danger)",
            color: "#ffffff",
            borderRadius: "10px",
          },
        });
      } else {
        toast.error("Failed to save medical info!", {
          style: {
            background: "var(--accent-danger)",
            color: "#ffffff",
            borderRadius: "10px",
          },
        });
      }
      return;
    } finally {
      setSavingMedical(false);
    }

    setEditMode({ ...editMode, medical: !editMode.medical });
  };

  return (
    <Layout role="customer">
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--bg-main)" }}
      >
        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Profile Overview Card */}
            <FadeInSection>
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
                      {personalInfo.firstName + " " + personalInfo.lastName}
                    </h2>
                    <p className="mt-1" style={{ color: "var(--text-muted)" }}>
                      Patient ID: <span>{patient.id}</span>
                    </p>

                    {/* Brief Info */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Calendar
                          className="w-4 h-4"
                          style={{ color: "var(--accent-teal)" }}
                        />
                        <span style={{ color: "var(--text-body)" }}>
                          39 years
                        </span>
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
            </FadeInSection>

            {/* Personal Information Card */}
            <FadeInSection delay={0.3}>
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
                    disabled={disableSave || savingPersonal}
                    onClick={handlePersonalBtnClick}
                  >
                    {savingPersonal
                      ? "Saving..."
                      : editMode.personal
                      ? "Save"
                      : "Edit"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label style={{ color: "var(--text-body)" }}>
                      <User
                        className="w-4 h-4 inline mr-2"
                        style={{ color: "var(--text-muted)" }}
                      />
                      First Name
                    </Label>
                    <Input
                      value={personalInfo.firstName}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          firstName: e.target.value,
                        })
                      }
                      disabled={!editMode.personal}
                      className="mt-2 rounded-lg"
                      style={{ borderColor: "var(--input-border)" }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: "var(--text-body)" }}>
                      <User
                        className="w-4 h-4 inline mr-2"
                        style={{ color: "var(--text-muted)" }}
                      />
                      Last Name
                    </Label>
                    <Input
                      value={personalInfo.lastName}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          lastName: e.target.value,
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
                        setPersonalInfo({
                          ...personalInfo,
                          gender: e.target.value,
                        })
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
            </FadeInSection>

            {/* Medical Information Card */}
            <FadeInSection>
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
                    disabled={disableSave || savingMedical}
                    onClick={handleMedicalBtnClick}
                  >
                    {savingMedical
                      ? "Saving..."
                      : editMode.medical
                      ? "Save"
                      : "Edit"}
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
                    <h4
                      style={{ color: "var(--text-heading)" }}
                      className="mb-4"
                    >
                      <UserPlus
                        className="w-4 h-4 inline mr-2"
                        style={{ color: "var(--primary)" }}
                      />
                      Emergency Contact
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label style={{ color: "var(--text-body)" }}>
                          Name
                        </Label>
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
            </FadeInSection>

            {/* Account Settings Card */}
            <FadeInSection>
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
                </div>
              </Card>
            </FadeInSection>
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
        <LoadingOverlay
          isLoading={isLoadingPatient}
          message="Retrieving patient details..."
        />
        <LoadingOverlay
          isLoading={isLoadingUpdate}
          message="Updating your account..."
        />
      </div>
    </Layout>
  );
}
