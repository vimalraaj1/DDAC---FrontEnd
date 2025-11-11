import AuthForm from "./AuthForm";
import {register} from "./authService";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const handleRegister = async (data) => {
        const result = await register(data);

        if (result.success) {
            alert("Registration Successful");
            navigate("/login");
        } else {
            alert(result.message || "Registration Failed");
        }
    };

    return (
        <AuthForm 
            title="Register"
            fields={[
                { label: "Full Name", name: "name", type: "text"},
                { label: "Email", name: "email", type: "email"},
                { label: "Password", name: "password", type: "password"},
            ]}

            onSubmit={handleRegister}
        />
    )
}