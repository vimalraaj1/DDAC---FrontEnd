import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import * as patientService from "../services/patientService";
import { patientDefaults, genderOptions } from "./patientSchema";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { toast } from "sonner";

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...patientDefaults });

  useEffect(() => {
    if (isEdit) {
      loadPatient();
    } else {
      setFormData({ ...patientDefaults });
    }
  }, [id]);

  const loadPatient = async () => {
    try {
      const data = await patientService.getPatientById(id);
      setFormData({
        //id: data.id || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        gender: data.gender || "",
        email: data.email || "",
        phone: data.phone || "",
        dateOfBirth: data.dateOfBirth
          ? data.dateOfBirth.split("T")[0]
          : "",
        address: data.address || "",
        bloodGroup: data.bloodGroup || "",
        emergencyContact: data.emergencyContact || "",
        emergencyName: data.emergencyName || "",
        emergencyRelationship: data.emergencyRelationship || "",
        allergies: data.allergies || "",
        conditions: data.conditions || "",
        medications: data.medications || "",
      });
    } catch (error) {
      console.error("Error loading patient:", error);
      toast.error("Failed to load patient data. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // if (!formData.id?.trim()) {
    //   toast.error("Patient ID is required.");
    //   return false;
    // }
    if (!formData.firstName?.trim()) {
      toast.error("First name is required.");
      return false;
    }
    if (!formData.lastName?.trim()) {
      toast.error("Last name is required.");
      return false;
    }
    if (!formData.email?.trim()) {
      toast.error("Email is required.");
      return false;
    }
    if (!formData.phone?.trim()) {
      toast.error("Phone number is required.");
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await patientService.updatePatient(id, formData);
        toast.success("Patient updated successfully!");
      } else {
        await patientService.createPatient(formData);
        toast.success("Patient registered successfully!");
      }
      navigate("/staff/patients");
    } catch (error) {
      console.error("Error saving patient:", error);
      const errorMessage = error.response?.data?.message || "Error saving patient. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              to={isEdit ? `/staff/patients/${id}` : "/staff/patients"}
              className="text-primary hover:underline flex items-center gap-2 mb-4"
            >
              <FaArrowLeft size={16} />
              Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Patient" : "Register New Patient"}
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {genderOptions.map((gender) => (
                      <label
                        key={gender}
                        className={`flex items-center justify-center border rounded-lg py-3 cursor-pointer transition-all ${
                          formData.gender === gender
                            ? "border-primary bg-primary text-white font-semibold"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={handleChange}
                          className="hidden"
                          required
                        />
                        {gender}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="emergencyContact"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="emergencyName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Emergency Name
                  </label>
                  <input
                    type="text"
                    id="emergencyName"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="emergencyRelationship"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Emergency Relationship
                  </label>
                  <input
                    type="text"
                    id="emergencyRelationship"
                    name="emergencyRelationship"
                    value={formData.emergencyRelationship}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="allergies"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Allergies
                  </label>
                  <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="conditions"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Conditions
                  </label>
                  <input
                    type="text"
                    id="conditions"
                    name="conditions"
                    value={formData.conditions}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="medications"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Medications
                  </label>
                  <input
                    type="text"
                    id="medications"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div>
                  <label
                    htmlFor="id"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Patient ID *
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    required
                    disabled={isEdit}
                    placeholder="PT000001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                  />
                </div> */}
                <div>
                  <label
                    htmlFor="bloodGroup"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Blood Group
                  </label>
                  <input
                    type="text"
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    placeholder="e.g., O+"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover flex items-center gap-2 disabled:opacity-50"
                >
                  <FaSave size={16} />
                  {loading ? "Saving..." : "Save Patient"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      isEdit ? `/staff/patients/${id}` : "/staff/patients"
                    )
                  }
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
