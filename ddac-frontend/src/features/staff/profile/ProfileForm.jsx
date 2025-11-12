import { useState } from "react";

const ProfileForm = ({profile, onSave, onCancel}) => {
    const [form, setForm] = useState({
        fullName: profile.fullName,
        phone: profile.phone,
        address: profile.address,
    });

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };


    const handleSubmit = (e) =>{
        e.preventDefault();
        onSave(form);
    };

    return (
        <form className="card" onSubmit={handleSubmit}>
            <h2 className="section-title mb-6">Edit Profile</h2>

            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter your address"
                    />
                </div>
            </div>

            <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
                <button type="submit" className="btn-primary flex-1">
                    Save Changes
                </button>
                <button 
                    type="button" 
                    className="btn-secondary flex-1" 
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProfileForm;