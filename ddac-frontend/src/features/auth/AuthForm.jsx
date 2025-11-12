import { useState } from "react";
import { Link } from "react-router-dom";

export default function AuthForm({title, fields, onSubmit}){
    const [formData, setFormData] = useState(() => {
        const initial = {};
        fields.forEach(f => initial[f.name] = "");
        return initial;
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isLogin = title === "Login";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-soft px-4">
            <div className="card-elevated w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">{title}</h1>
                    <p className="text-gray-neutral">
                        {isLogin ? "Welcome back! Please login to your account." : "Create a new account to get started."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {fields.map((field)=>(
                        <div key={field.name} className="space-y-2">
                            <label className="block text-sm font-medium text-gray-900">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required
                                className="input-field"
                                placeholder={`Enter your ${field.label.toLowerCase()}`}
                            />
                        </div>
                    ))}

                    <button type="submit" className="btn-primary w-full mt-6">
                        {title}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-neutral">
                        {isLogin ? (
                            <>
                                Don't have an account?{" "}
                                <Link to="/register" className="text-primary hover:text-[#3B82F6] font-medium">
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:text-[#3B82F6] font-medium">
                                    Login
                                </Link>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}