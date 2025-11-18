import DoctorSidebar from "../components/DoctorSidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorProfile() {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName") || "Dr. Sarah Wilson";
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "Dr. Sarah Wilson",
        email: "doctor@gmail.com",
        phone: "+1 234 567 8900",
        specialization: "Internal Medicine",
        licenseNumber: "MD123456",
        experience: "10 years",
        address: "123 Medical Center Dr, Healthcare City",
        department: "Cardiology",
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DoctorSidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-500 text-sm">Manage your professional information and settings</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            
                            {/* Logout Button */}
                            <button 
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="text-sm font-medium">Logout</span>
                            </button>

                            {/* User Profile */}
                            <div className="flex items-center space-x-3 cursor-pointer group">
                                <img
                                    src="https://ui-avatars.com/api/?name=Sarah+Wilson&background=4f46e5&color=fff"
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                                    <p className="text-xs text-gray-500">Manager</p>
                                </div>
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-auto">
                    {/* Profile Header Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-6">
                                    <img
                                        src="https://ui-avatars.com/api/?name=Sarah+Wilson&background=4f46e5&color=fff&size=128"
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full"
                                    />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
                                        <p className="text-gray-500 mt-1">{formData.specialization}</p>
                                        <p className="text-gray-500 text-sm">{formData.department} Department</p>
                                        <div className="flex items-center space-x-4 mt-3">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                            <span className="text-sm text-gray-500">{formData.experience} experience</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        isEditing 
                                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                >
                                    {isEditing ? "Cancel" : "Edit Profile"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Professional Information</h2>
                        </div>
                        <div className="p-6">
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
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                            }`}
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
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                            }`}
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
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                            }`}
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
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                            }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                            }`}
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
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                            }`}
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
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                            }`}
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
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                        }`}
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
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                                            !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                        }`}
                                    />
                                </div>

                                {isEditing && (
                                    <div className="mt-8 flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}