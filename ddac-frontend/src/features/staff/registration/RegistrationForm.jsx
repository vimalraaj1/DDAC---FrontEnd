import { useState } from "react";

const RegistrationForm = ({ patient, onSave, onCancel }) => {
    const [form, setForm] = useState({
        patientName: patient?.patientName || "",
        gender: patient?.gender || "",
        phoneNumber: patient?.phoneNumber || "",
        address: patient?.address || "",
        allergies: patient?.allergies || "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="card">
            <h2 className="section-title mb-6">
                {patient?.id ? "Edit Patient" : "Register New Patient"}
            </h2>

            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                        Name *
                    </label>
                    <input
                        type="text"
                        name="patientName"
                        value={form.patientName}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter patient's name"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                        Gender *
                    </label>
                    <div className="flex space-x-6">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={form.gender === "male"}
                                onChange={handleChange}
                                required
                                className="mr-2"
                            />
                            <span>Male</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={form.gender === "female"}
                                onChange={handleChange}
                                required
                                className="mr-2"
                            />
                            <span>Female</span>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                        Phone Number
                    </label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="012-3456789"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                        Address
                    </label>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter patient's address"
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                        Allergies
                    </label>
                    <input
                        type="text"
                        name="allergies"
                        value={form.allergies}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter allergies (if any)"
                    />
                </div>
            </div>

            <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        onSave(form);
                    }}
                    className="btn-primary flex-1"
                >
                    {patient?.id ? "Update Patient" : "Register Patient"}
                </button>
                <button
                    onClick={onCancel}
                    className="btn-secondary flex-1"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default RegistrationForm;