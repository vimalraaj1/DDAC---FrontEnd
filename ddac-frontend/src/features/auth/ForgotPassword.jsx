import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FaShieldAlt, FaUserMd } from 'react-icons/fa';
import wellspring_logo from "../../assets/wellspring_logo.png";
import { sendForgotPasswordTokenEmail } from '../../services/emailManagementService.js';

export default function ForgotPassword () {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userId) {
            toast.error("Please enter your User ID.");
            return;
        }

        setLoading(true);
        try {
            console.log(userId);
            await sendForgotPasswordTokenEmail({ UserId: userId });
            toast.info("If an account exists, a password reset link has been sent to the associated email.");
        } catch (error) {
            console.error("Forgot Password Error:", error);
            toast.error(error.response?.data?.message || "An error occurred while sending the link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
                    {/* Logo */}
                    <WellspringLogo />
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
                        <p className="text-gray-600">
                            Enter your User ID to receive a password reset link.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700" htmlFor="userId">
                                User ID
                            </label>
                            <input
                                id="userId"
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter your unique User ID"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                                required
                            />
                            {!userId && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <span>⚠</span> User ID is required.
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 disabled:transform-none"
                        >
                            {loading ? 'Sending Link...' : 'Send Reset Link'}
                        </button>

                        {/* Back to Login Link */}
                        <div className="text-center mt-4">
                            <a
                                onClick={() => navigate('/login')}
                                href="#"
                                className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                            >
                                Back to Login
                            </a>
                        </div>
                    </form>

                </div>

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