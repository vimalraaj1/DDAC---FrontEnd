import { useState } from "react";

const RegistrationForm = ({ patient, onSave, onCancel }) => {
    const [form, setForm] = useState({
        firstName: patient?.firstName || "",
        lastName: patient?.lastName || "",
        gender: patient?.gender || "",
        phone: patient?.phone || "",
        email: patient?.email || "",
        dateOfBirth: patient?.dateOfBirth ? patient.dateOfBirth.split('T')[0] : "",
        address: patient?.address || "",
        bloodGroup: patient?.bloodGroup || "",
        emergencyContact: patient?.emergencyContact || "",
        emergencyName: patient?.emergencyName || "",
        emergencyRelationship: patient?.emergencyRelationship || "",
        allergies: patient?.allergies || "",
        conditions: patient?.conditions || "",
        medications: patient?.medications || "",
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900">First Name *</label>
                        <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required className="input-field" placeholder="First name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Last Name *</label>
                        <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required className="input-field" placeholder="Last name" />
                    </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Phone</label>
                        <input type="text" name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="012-3456789" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="email@example.com" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="input-field" />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">Address</label>
                    <textarea name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="Enter patient's address" rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Blood Group</label>
                        <input type="text" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Emergency Contact</label>
                        <input type="text" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Emergency Name</label>
                        <input type="text" name="emergencyName" value={form.emergencyName} onChange={handleChange} className="input-field" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Allergies</label>
                        <input type="text" name="allergies" value={form.allergies} onChange={handleChange} className="input-field" placeholder="Allergies" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Conditions</label>
                        <input type="text" name="conditions" value={form.conditions} onChange={handleChange} className="input-field" placeholder="Existing conditions" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Medications</label>
                        <input type="text" name="medications" value={form.medications} onChange={handleChange} className="input-field" placeholder="Current medications" />
                    </div>
                </div>
            </div>

                <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
                    <button onClick={(e) => { e.preventDefault(); onSave(form); }} className="btn-primary flex-1">{patient?.id ? "Update Patient" : "Register Patient"}</button>
                    <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
                </div>
        </div>
    );
};

export default RegistrationForm;