import AuthForm from "./AuthForm";
import {login} from "./authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        const result = await login(data.email, data.password);

        if (result.success) {
            localStorage.setItem("token", result.token);
            navigate("/staffDashboard");
        } else {
            alert("Invalid Login Credentials");
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