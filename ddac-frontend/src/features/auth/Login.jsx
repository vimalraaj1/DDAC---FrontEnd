import { useEffect, useState } from "react";
import { login } from "../../services/authManagementService";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";

import LoadingOverlay from "../customer/components/LoadingOverlay";

export default function Login() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setIsLoading(true);

    try {
      const result = await login(credentials);

      if (!result || !result.role) {
        throw new Error("Invalid login response");
      }

      // Save values
      localStorage.setItem("userRole", result.role);
      localStorage.setItem("userName", result.fullName);
      localStorage.setItem("id", result.id);

      // Apply theme
      document.documentElement.className = `theme-${result.role}`;
      // Redirect by role
      switch (result.role) {
        case "doctor":
          navigate("/doctorDashboard");
          break;

        case "staff":
          navigate("/staffDashboard");
          break;

        case "customer":
          navigate("/custDashboard");
          break;

        case "manager":
          navigate("/managerDashboard");
          break;
        default:
          navigate("/login");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle invalid credentials (backend returns 500)
      let message = "Login Failed";
      if (error.status === 500) {
        message = "Invalid email or password.";
      }

      alert(message);
    }finally{
        setIsLoading(false);
    }
  };

  return (
    <>
      <AuthForm
        title="Login"
        fields={[
          { label: "Email", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" },
        ]}
        onSubmit={handleLogin}
      />

      <LoadingOverlay
        isLoading={isLoading}
        message="Logging in, please wait..."
      />
    </>
  );
}
