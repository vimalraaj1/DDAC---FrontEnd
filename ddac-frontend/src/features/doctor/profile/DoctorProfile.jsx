import DoctorSidebar from "../components/DoctorSidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOutDialog } from "../../customer/components/LogoutDialog";
import doctorService from "../services/doctorService";

export default function DoctorProfile() {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName");
    const [isEditing, setIsEditing] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        bloodGroup: "",
        emergencyContact: "",
        licenseNumber: "",
        specialization: "",
        department: "",
        joiningDate: "",
        yearsOfExperience: 0,
        salary: 0,
        status: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const profile = await doctorService.getCurrentDoctorProfile();
            setFormData(profile);
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        setPasswordError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent multiple submissions
        if (isSaving) {
            return;
        }

        try {
            setIsSaving(true);
            
            // Validate password if changing
            if (showPasswordSection && (passwordData.newPassword || passwordData.confirmPassword)) {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    setPasswordError('Passwords do not match');
                    setIsSaving(false);
                    return;
                }
                if (passwordData.newPassword.length < 6) {
                    setPasswordError('Password must be at least 6 characters');
                    setIsSaving(false);
                    return;
                }
            }

            // Prepare update data
            const updateData = { ...formData };
            if (showPasswordSection && passwordData.newPassword) {
                updateData.password = passwordData.newPassword;
            }

            await doctorService.updateCurrentDoctorProfile(updateData);
            setIsEditing(false);
            setShowPasswordSection(false);
            setPasswordData({ newPassword: '', confirmPassword: '' });
            setPasswordError('');
            alert("Profile updated successfully!");
            // Refresh profile data
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to update profile. Please try again.';
            alert(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const confirmedLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("userName");
        localStorage.removeItem("role");
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
                            {/* Search Bar
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div> */}
                            

                            {/* User Profile */}
                            <div className="relative">
                                <div 
                                    className="flex items-center space-x-3 cursor-pointer group"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <img
                                        src="https://ui-avatars.com/api/?name=Sarah+Wilson&background=4f46e5&color=fff"
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                                        <p className="text-xs text-gray-500">Doctor</p>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setIsEditing(true);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span>Edit Profile</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                navigate('/doctorProfile');
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>View Profile</span>
                                        </button>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                navigate('/doctorSettings');
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>Settings</span>
                                        </button>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setLogoutDialogOpen(true);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Loading State */}
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading profile...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Page Content */}
                        <main className="flex-1 p-8 overflow-auto">
                            {/* Profile Header Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-6">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=4f46e5&color=fff&size=128`}
                                                alt="Profile"
                                                className="w-24 h-24 rounded-full"
                                            />
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">{formData.firstName} {formData.lastName}</h2>
                                                <p className="text-gray-500 mt-1">{formData.specialization}</p>
                                                <p className="text-gray-500 text-sm">{formData.department} Department</p>
                                                <div className="flex items-center space-x-4 mt-3">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        formData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {formData.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500">{formData.yearsOfExperience} years experience</span>
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
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            required
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                                            }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            required
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
                                            required
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
                                            required
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
                                            required
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
                                            value={formData.department || ''}
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

                                {/* Password Change Section */}
                                {isEditing && (
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowPasswordSection(!showPasswordSection);
                                                    setPasswordData({ newPassword: '', confirmPassword: '' });
                                                    setPasswordError('');
                                                }}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                {showPasswordSection ? 'Cancel Password Change' : 'Change Password'}
                                            </button>
                                        </div>

                                        {showPasswordSection && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordInputChange}
                                                        placeholder="Enter new password (min 6 characters)"
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordInputChange}
                                                        placeholder="Confirm new password"
                                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                {passwordError && (
                                                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>{passwordError}</span>
                                                    </div>
                                                )}

                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                    <div className="flex items-start space-x-2">
                                                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                        </svg>
                                                        <div className="text-sm text-blue-800">
                                                            <p className="font-medium">Password Requirements:</p>
                                                            <ul className="mt-1 ml-4 list-disc space-y-1">
                                                                <li>Minimum 6 characters</li>
                                                                <li>Both passwords must match</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {isEditing && (
                                    <div className="mt-8 flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            disabled={isSaving}
                                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                        >
                                            {isSaving && (
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </main>
                </>
                )}
            </div>
            
            <LogOutDialog
                open={logoutDialogOpen}
                onOpenChange={setLogoutDialogOpen}
                onConfirmLogout={confirmedLogout}
            />
        </div>
    );
}