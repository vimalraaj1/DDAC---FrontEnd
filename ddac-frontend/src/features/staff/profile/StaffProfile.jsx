import { useEffect, useState } from "react";
import { getStaffProfile, updateStaffProfile } from "../services/profileService";
import ProfileForm from "./ProfileForm";
import Layout from "../../../components/Layout";

const StaffProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getStaffProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);

        setProfile({
          fullName: "Staff Member",
          email: "staff@example.com",
          phone: "123-456-7890",
          address: "123 Main St",
        });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (updatedData) => {
    try {
      const updated = await updateStaffProfile(updatedData);
      setProfile(updated);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-soft">
        <div className="container mx-auto px-4 py-8">
          <h1 className="page-title">My Profile</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-neutral">Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {!editing ? (
                <div className="card max-w-2xl">
                  <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl font-semibold text-primary">
                        {profile.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {profile.fullName}
                      </h2>
                      <p className="text-gray-neutral">{profile.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      ["Full Name", profile.fullName],
                      ["Email", profile.email],
                      ["Phone", profile.phone || "Not provided"],
                      ["Address", profile.address || "Not provided"],
                    ].map(([label, value], index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-32">
                          <p className="text-sm font-medium text-gray-neutral">
                            {label}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setEditing(true)}
                      className="btn-primary"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl">
                  <ProfileForm
                    profile={profile}
                    onSave={handleSave}
                    onCancel={() => setEditing(false)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StaffProfile;
