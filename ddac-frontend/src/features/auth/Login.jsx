import AuthForm from "./AuthForm";
import { login } from "./authService";
import { useNavigate } from "react-router-dom";
import ManagerDashboard from "../manager/ManagerDashboard.jsx";

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
        try {
            const result = await login(credentials.email, credentials.password);
            if (result.success) {
                localStorage.setItem("token", result.token);
                localStorage.setItem("userRole", result.user.role);
                localStorage.setItem("userName", result.user.name);
                localStorage.setItem("id", result.user.id);
                
                document.documentElement.className = `theme-${result.user.role}`;
                
                // Redirect based on role
                switch(result.user.role) {
                    case 'doctor':
                        navigate('/doctorDashboard');
                        break;
                    case 'staff':
                        navigate('/staffDashboard');
                        break;
                    case 'customer':
                        navigate('/custDashboard');
                        break;
                    case 'manager':
                        navigate('/managerDashboard');
                        break;
                    default:
                        navigate('/login');
                }
            } else {
                alert("Invalid Login Credentials");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed: " + error.message);
        }
    };

    return (
        <AuthForm 
            title="Login"
            fields={[
                { label: "Email", name: "email", type: "email"},
                { label: "Password", name: "password", type: "password"},
            ]}
            onSubmit={handleLogin}
        />
    );
}