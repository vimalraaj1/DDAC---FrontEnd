import StaffNavBar from "../components/StaffNavBar";
import { useState } from "react";
import { registerPatient } from "./patientManagementService";
import RegistrationForm from "./RegistrationForm";
import Layout from "../../../components/Layout";

const RegisterPatient = () => {
  const [registering, setRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const emptyPatient = {
    patientName: "",
    gender: "",
    phoneNumber: "",
    address: "",
    allergies: "",
  };

  const handleSave = async (patientData) => {
    setRegistering(true);
    setErrorMessage("");

    try {
      const newPatient = await registerPatient(patientData);
      setSuccessMessage(
        `Patient ${newPatient.patientName} registered successfully!`
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error registering patient:", error);
      setErrorMessage("Failed to register patient. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-soft">
        <div className="container mx-auto px-4 py-8">
          <h1 className="page-title">Register New Patient</h1>

          {successMessage && (
            <div className="max-w-2xl mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="max-w-2xl mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{errorMessage}</p>
            </div>
          )}

          {registering ? (
            <div className="max-w-2xl">
              <div className="card">
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-neutral">Registering patient...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl">
              <RegistrationForm
                patient={emptyPatient}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPatient;
