import CustNavBar from "../components/CustNavBar";
import {useEffect, useState} from "react";
import {getProfile, updateProfile} from "./profileService";
import ProfileForm from "./ProfileForm";


const CustProfile = () => {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(()=>{
        const loadProfile = async () => {
            const data = await getProfile(1);
            setProfile(data);
        };
        loadProfile();
    }, []);

    const handleSave = async (updatedData) => {
        const updated = await updateProfile(updatedData);
        setProfile(updated);
        setEditing(false);
    };

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-soft flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-neutral">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-soft">
            <CustNavBar/>
            <div className="container mx-auto px-4 py-8">
                <h1 className="page-title">My Profile</h1>
                
                {!editing ? (
                    <div className="card max-w-2xl">
                        <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-3xl font-semibold text-primary">
                                    {profile.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900">{profile.fullName}</h2>
                                <p className="text-gray-neutral">{profile.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="w-32">
                                    <p className="text-sm font-medium text-gray-neutral">Full Name</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900">{profile.fullName}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-32">
                                    <p className="text-sm font-medium text-gray-neutral">Email</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900">{profile.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-32">
                                    <p className="text-sm font-medium text-gray-neutral">Phone</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="w-32">
                                    <p className="text-sm font-medium text-gray-neutral">Address</p>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900">{profile.address || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <button 
                                onClick={()=>setEditing(true)} 
                                className="btn-primary"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl">
                        <ProfileForm profile={profile} onSave={handleSave} onCancel={()=>setEditing(false)}/>
                    </div>
                )
                }
            </div>
        </div>
    );
};


export default CustProfile;