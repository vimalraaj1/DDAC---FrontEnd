import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaShieldAlt, FaUserMd, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner';
import wellspring_logo from "../../assets/wellspring_logo.png";
import { validateResetToken, submitNewPassword } from '../../services/emailManagementService.js'; // 🛑 Use the new services

const PasswordInput = ({ label, name, value, onChange, error, showPassword, togglePasswordVisibility }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} <span className="text-red-500">*</span>
        </label>
        <div className="relative flex items-center">
            <FaLock size={16} className="absolute left-3 text-gray-400" />

            <input
                type={showPassword ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={`Enter ${label.toLowerCase()}`}
                required
            />
            <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-700 transition-colors"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </div>
        </div>
        {error && (<p className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span> {error}</p>)}
    </div>
);

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true); // Loading state for token validation
    const [submitting, setSubmitting] = useState(false); // Loading state for form submission
    const [userId, setUserId] = useState(null); // The ID verified by the BE
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|:;"'<>,.?/-])(?=.{8,}).*$/;

    const WellspringLogo = () => (
        <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                {<img src={wellspring_logo} alt="WellSpring Healthcare Logo" className="w-35 h-auto content-center" />}
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                WellSpring
            </span>
        </div>
    );

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            toast.error("Invalid reset link. Token is missing.");
            setLoading(false);
            return;
        }

        const verifyToken = async () => {
            try {
                const data = await validateResetToken(token);
                setUserId(data.userId);
                toast.success("Reset link validated. Please set your new password.");
            } catch (error) {
                console.error("Token validation error:", error);
                const errorMessage = error.response?.data?.message || "This password reset link is invalid or has expired.";
                toast.error(errorMessage);
                setUserId(null);
            } finally {
                setLoading(false);
            }
        };
        verifyToken();
    }, [searchParams]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.newPassword) {
            newErrors.newPassword = "New Password is required";
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required";
        }
        if (formData.newPassword && !passwordRegex.test(formData.newPassword)) {
            newErrors.newPassword = "Password must be 8+ chars, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
        }
        if (!newErrors.confirmPassword && formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            toast.warning("Please wait for the reset link to be validated.");
            return;
        }
        if (!userId) {
            toast.error("Cannot submit. The reset link is invalid or expired.");
            return;
        }
        if (!validateForm()) {
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                UserId: userId,
                NewPassword: formData.newPassword,
            };
            await submitNewPassword(payload); 

            toast.success("Password successfully reset! You can now log in.");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            console.error("Password Reset Error:", error);
            const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again.";
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="text-center">
                    <WellspringLogo />
                    <p className="text-gray-600 mt-4 text-lg">Validating reset link. Please wait...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">

                    {/* Logo */}
                    <WellspringLogo />

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set New Password</h1>
                        <p className="text-gray-600">
                            You are resetting the password for User ID: <strong className="text-blue-600">{userId || 'N/A'}</strong>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-5">
                            <PasswordInput
                                label="New Password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                error={errors.newPassword}
                                showPassword={showPassword}
                                togglePasswordVisibility={() => setShowPassword(prev => !prev)}
                            />

                            <PasswordInput
                                label="Confirm New Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                showPassword={showConfirmPassword}
                                togglePasswordVisibility={() => setShowConfirmPassword(prev => !prev)}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting || loading || !userId}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 disabled:transform-none"
                        >
                            {submitting ? 'Updating Password...' : 'Reset Password'}
                        </button>

                    </form>

                </div>

                {/* Trust Indicators */}
                <div className="mt-8 flex items-center justify-center gap-8 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                        <FaShieldAlt className="text-blue-600" />
                        <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUserMd className="text-blue-600" />
                        <span>HIPAA Compliant</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
            `}</style>
        </div>
    );
};