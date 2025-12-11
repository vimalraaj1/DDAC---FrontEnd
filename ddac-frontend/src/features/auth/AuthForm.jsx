import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function AuthForm({ title, fields, onSubmit }) {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach((f) => (initial[f.name] = ""));
    return initial;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-soft px-4 py-8">
      <div className="card-elevated w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-neutral">
            {isLogin
              ? "Welcome back! Please login to your account."
              : "Create a new account to get started."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Two-column layout for first/last name on register */}
          {!isLogin &&
          fields[0]?.name === "firstname" &&
          fields[1]?.name === "lastname" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    {fields[0].label}
                  </label>
                  {renderField(fields[0])}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    {fields[1].label}
                  </label>
                  {renderField(fields[1])}
                </div>
              </div>
              {fields.slice(2).map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    {field.label}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </>
          ) : (
            fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            ))
          )}

          <button type="submit" className="btn-primary w-full mt-6">
            {title}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-neutral">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-[#3B82F6] font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-[#3B82F6] font-medium transition-colors"
                >
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
