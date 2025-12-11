import React, {useEffect, useState} from 'react';
import { FaTimes, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'sonner';
import { updateManager, getManagerById } from '../../../services/managerManagementService.js';
import {useNavigate} from "react-router-dom";

export default function ChangePasswordModal({ id, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [profileData, setProfileData] = useState(null)
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|:;"'<>,.?/-])(?=.{8,}).*$/;

    useEffect(() => {
        if (id) {
            fetchManagerInfo(id); 
        }
    }, [id])

    const fetchManagerInfo = async (managerId) => {
        try {
            const profileData = await getManagerById(managerId)
            setProfileData(profileData);
        } catch (error) {
            console.error('Error fetching profile data:', error);
            toast.error('Failed to load profile data. Please try again.');
            navigate('/managerProfile');
        } finally {
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prev => !prev);
    };

    const validateForm = () => {
        const newErrors = {};

        // if (!formData.currentPassword) {
        //     newErrors.currentPassword = "Current password is required";
        // }

        if (!formData.newPassword) {
            newErrors.newPassword = "New Password is required";
        } else if (!passwordRegex.test(formData.newPassword)) {
            newErrors.newPassword = "Password should be minimum of 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character";
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required";
        } else if (!passwordRegex.test(formData.confirmPassword)) {
            newErrors.confirmPassword = "Confirm Password should be minimum of 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character";
        }

        if (!newErrors.confirmPassword && formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {

            const fullUpdatePayload = {
                ...profileData,
                Password: formData.newPassword,
            };
            await updateManager(id, fullUpdatePayload);
            toast.success("Password updated successfully!");
            onSuccess(); 
        } catch (error) {
            console.error("Error updating password:", error);
            const errorMessage = error.response?.data?.message || "Failed to update password. Please check your current password.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // Modal Overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {/* Modal Content */}
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-muted hover:text-accent-danger transition-colors"
                    aria-label="Close modal"
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-2xl font-bold text-heading mb-6 flex items-center gap-2">
                    <FaLock size={20} className="text-primary" />
                    Change Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Input Field Helper Component (for re-use) */}
                    {/*<PasswordInput*/}
                    {/*    label="Current Password"*/}
                    {/*    name="currentPassword"*/}
                    {/*    value={formData.currentPassword}*/}
                    {/*    onChange={handleChange}*/}
                    {/*    error={errors.currentPassword}*/}
                    {/*    showPassword={showPassword}*/}
                    {/*    togglePasswordVisibility={togglePasswordVisibility}*/}
                    {/*/>*/}

                    <PasswordInput
                        label="New Password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        error={errors.newPassword}
                        showPassword={showPassword}
                        togglePasswordVisibility={togglePasswordVisibility}
                    />

                    <PasswordInput
                        label="Confirm New Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        showPassword={showConfirmPassword}
                        togglePasswordVisibility={toggleConfirmPasswordVisibility}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-color rounded-lg text-heading font-medium hover:bg-main transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-primary text-ondark rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Save New Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// Reusable Input Field for Password
const PasswordInput = ({ label, name, value, onChange, error, showPassword, togglePasswordVisibility }) => (
    <div>
        <label className="block text-sm font-medium text-heading mb-2">
            {label} <span className="text-accent-danger">*</span>
        </label>
        <div className="relative flex items-center">
            <FaLock size={16} className="absolute left-3 text-muted" />

            <input
                type={showPassword ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    error ? "border-accent-danger" : "border-input"
                }`}
                placeholder={`Enter ${label.toLowerCase()}`}
            />
            <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted cursor-pointer hover:text-heading transition-colors"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </div>
        </div>
        {error && (<p className="text-accent-danger text-xs mt-1">{error}</p>)}
    </div>
)