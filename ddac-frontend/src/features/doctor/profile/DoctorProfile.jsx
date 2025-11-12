import DoctorNavBar from "../components/DoctorNavBar";
import { useState } from "react";

export default function DoctorProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "Dr. John Smith",
        email: "doctor@gmail.com",
        phone: "+1 234 567 8900",
        specialization: "Internal Medicine",
        licenseNumber: "MD123456",
        experience: "10 years",
        address: "123 Medical Center Dr, Healthcare City",
        bio: "Experienced internal medicine physician dedicated to providing comprehensive healthcare."
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically save to backend
        console.log("Saving profile:", formData);
        setIsEditing(false);
        // Show success message
        alert("Profile updated successfully!");
    };

    return (
        <div className="min-h-screen bg-gray-soft">
            <DoctorNavBar />
            
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="page-title">My Profile</h1>
                    <p className="text-gray-neutral text-lg">Manage your professional information and settings.</p>
                </div>

                <div className="card">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="section-title">Professional Information</h2>
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={isEditing ? "btn-secondary" : "btn-primary"}
                        >
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Specialization
                                </label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    License Number
                                </label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Years of Experience
                                </label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="input-field"
                            />
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Professional Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                rows={4}
                                className="input-field resize-none"
                            />
                        </div>

                        {isEditing && (
                            <div className="mt-8 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}