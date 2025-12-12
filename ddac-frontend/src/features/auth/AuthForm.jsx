import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {FaEye, FaEyeSlash, FaShieldAlt, FaUserCircle, FaUserMd} from "react-icons/fa";
import wellspring_logo from "../../assets/wellspring_logo.png";

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
export default function AuthForm({ title, fields, onSubmit }) {
    const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach((f) => (initial[f.name] = ""));
    return initial;
  });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };
    
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
      if (errors[name]) {
          setErrors({ ...errors, [name]: "" });
      }
  };

  const validateForm = () => {
    for (const field of fields) {
      const value = formData[field.name];

      // Required check
      if (!value || value.trim() === "") {
        toast.error(`${field.label} is required`, {
          style: {
            background: "var(--accent-danger)",
            color: "#ffffff",
            borderRadius: "10px",
          },
        });
        return false;
      }

      // Email validation
      if (field.name === "email" && !value.includes("@")) {
        toast.error("Please enter a valid email address", {
          style: {
            background: "var(--accent-danger)",
            color: "#ffffff",
            borderRadius: "10px",
          },
        });
        return false;
      }

      // Phone number validation
      if (field.name === "phone" && /\D/.test(value)) {
        toast.error("Phone number must contain only digits", {
          style: {
            background: "var(--accent-danger)",
            color: "#ffffff",
            borderRadius: "10px",
          },
        });
        return false;
      }
    }

    // Password length
    if (formData.password !== undefined && formData.password.length < 5) {
      toast.error("Password must be at least 5 characters long!", {
        style: {
          background: "var(--accent-danger)",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
      return false;
    }

    // Confirm password matching
    if (
      formData.confirmPassword !== undefined &&
      formData.password !== formData.confirmPassword
    ) {
      toast.error("Passwords do not match", {
        style: {
          background: "var(--accent-danger)",
          color: "#ffffff",
          borderRadius: "10px",
        },
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Run validation before submit
    if (!validateForm()) return;

    onSubmit(formData);
  };

  const isLogin = title === "Login";

  const renderField = (field) => {
    const baseClasses = "input-field";
      const isPasswordField = field.type === "password";
      const inputType = isPasswordField && showPassword ? "text" : field.type;

    switch (field.type) {
      case "select":
        return (
          <select
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required
            className={`${baseClasses} cursor-pointer`}
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required
            rows={3}
            className={`${baseClasses} resize-none`}
            placeholder={`Enter your ${field.label.toLowerCase()}`}
          />
        );

        default:
            if (isPasswordField) {
                return (
                    <div className="relative">
                        <input
                            type={inputType} 
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                            className={`${baseClasses} pr-10`} 
                            placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                        <div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </div>
                    </div>
                );
            }
            return (
                <input
                    type={field.type} 
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className={baseClasses} 
                    placeholder={
                        field.type === "date"
                            ? ""
                            : `Enter your ${field.label.toLowerCase()}`
                    }
                />
            );
    }
  };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
                    {/* Logo */}
                    <WellspringLogo />

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                        <p className="text-gray-600">
                            {isLogin
                                ? "Welcome back! Please login to your account."
                                : "Create a new account to get started."}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Two-column layout for first/last name on register */}
                        {!isLogin &&
                        fields[0]?.name === "firstname" &&
                        fields[1]?.name === "lastname" ? (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            {fields[0].label}
                                        </label>
                                        {renderField(fields[0])}
                                        {errors[fields[0].name] && touched[fields[0].name] && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <span>⚠</span> {errors[fields[0].name]}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            {fields[1].label}
                                        </label>
                                        {renderField(fields[1])}
                                        {errors[fields[1].name] && touched[fields[1].name] && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <span>⚠</span> {errors[fields[1].name]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {fields.slice(2).map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            {field.label}
                                        </label>
                                        {renderField(field)}
                                        {errors[field.name] && touched[field.name] && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                                <span>⚠</span> {errors[field.name]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </>
                        ) : (
                            fields.map((field) => (
                                <div key={field.name} className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        {field.label}
                                    </label>
                                    {renderField(field)}
                                    {errors[field.name] && touched[field.name] && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <span>⚠</span> {errors[field.name]}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}

                        {/* Forgot Password Link (only for login) */}
                        {/*{isLogin && (*/}
                        {/*    <div className="flex items-center justify-end">*/}
                        {/*        <Link*/}
                        {/*            to="/forgot-password"*/}
                        {/*            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"*/}
                        {/*        >*/}
                        {/*            Forgot password?*/}
                        {/*        </Link>*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            {title}
                        </button>
                    </form>

                    {/* Divider */}
                    {/*<div className="relative my-8">*/}
                    {/*    <div className="absolute inset-0 flex items-center">*/}
                    {/*        <div className="w-full border-t border-gray-200"></div>*/}
                    {/*    </div>*/}
                    {/*    <div className="relative flex justify-center text-sm">*/}
                    {/*        <span className="px-4 bg-white text-gray-500">or</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Toggle Login/Register */}
                    {/*<div className="text-center">*/}
                    {/*    <p className="text-sm text-gray-600">*/}
                    {/*        {isLogin ? (*/}
                    {/*            <>*/}
                    {/*                Don't have an account?{" "}*/}
                    {/*                <Link*/}
                    {/*                    to="/register"*/}
                    {/*                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"*/}
                    {/*                >*/}
                    {/*                    Register now*/}
                    {/*                </Link>*/}
                    {/*            </>*/}
                    {/*        ) : (*/}
                    {/*            <>*/}
                    {/*                Already have an account?{" "}*/}
                    {/*                <Link*/}
                    {/*                    to="/login"*/}
                    {/*                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"*/}
                    {/*                >*/}
                    {/*                    Login here*/}
                    {/*                </Link>*/}
                    {/*            </>*/}
                    {/*        )}*/}
                    {/*    </p>*/}
                    {/*</div>*/}
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

            <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}
