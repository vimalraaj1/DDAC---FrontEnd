import { registerPatient } from "../../services/patientManagementService";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingOverlay from "../customer/components/LoadingOverlay";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data) => {
    setIsLoading(true);

    try {
      const result = await registerPatient(data);

      setIsLoading(false);
      toast.success("Account Created successfully!", {
        style: {
          background: "#2ECC71",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
      navigate("/login");
    } catch (error) {
      console.error("Register failed:", error);
      toast.error(`Registration Failed! Error: ${error.response.data.message}`, {
        style: {
          background: "var(--accent-danger)",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthForm
        title="Register"
        fields={[
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone Number", name: "phone", type: "text" },
          { label: "Date of Birth", name: "dateOfBirth", type: "date" },
          {
            label: "Gender",
            name: "gender",
            type: "select",
            options: [
              { value: "", label: "Select Gender" },
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ],
          },
          { label: "Address", name: "address", type: "textarea" },
          { label: "Password", name: "password", type: "password" },
        ]}
        onSubmit={handleRegister}
      />
      <LoadingOverlay
        isLoading={isLoading}
        message="Registering your account..."
      />
    </>
  );
}
