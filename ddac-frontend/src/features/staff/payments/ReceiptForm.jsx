import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../../components/Layout";
import { getAppointmentById } from "../services/appointmentService";
import { createPayment } from "../services/paymentService";
import { FaPlus, FaTrash, FaPills, FaStethoscope, FaXRay, FaSyringe, FaReceipt } from "react-icons/fa";

const APPOINTMENT_TYPES = [
  { value: 'consultation', label: 'Consultation', icon: FaStethoscope },
  { value: 'xray', label: 'X-Ray', icon: FaXRay },
  { value: 'surgery', label: 'Surgery', icon: FaSyringe },
  { value: 'lab_test', label: 'Lab Test', icon: FaStethoscope },
  { value: 'physiotherapy', label: 'Physiotherapy', icon: FaStethoscope },
  { value: 'other', label: 'Other Service', icon: FaStethoscope },
];

export default function ReceiptForm() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  
  // Receipt items state
  const [receiptItems, setReceiptItems] = useState([]);
  const [medicineItems, setMedicineItems] = useState([]);
  
  // Form states for adding new items
  const [selectedService, setSelectedService] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [medicinePrice, setMedicinePrice] = useState('');

  useEffect(() => {
    if (appointmentId) {
      loadAppointment();
    }
  }, [appointmentId]);

  const loadAppointment = async () => {
    try {
      const apptData = await getAppointmentById(appointmentId);
      setAppointment(apptData);
    } catch (error) {
      console.error("Error loading appointment:", error);
      alert("Failed to load appointment details");
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    const servicesTotal = receiptItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    const medicinesTotal = medicineItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    return (servicesTotal + medicinesTotal).toFixed(2);
  };

  // Add service item
  const handleAddService = () => {
    if (!selectedService || !servicePrice || parseFloat(servicePrice) <= 0) {
      alert("Please select a service and enter a valid price");
      return;
    }

    const serviceType = APPOINTMENT_TYPES.find(t => t.value === selectedService);
    const newItem = {
      id: Date.now(),
      type: 'service',
      name: serviceType.label,
      key: selectedService,
      price: parseFloat(servicePrice).toFixed(2)
    };

    setReceiptItems([...receiptItems, newItem]);
    setSelectedService('');
    setServicePrice('');
  };

  // Add medicine item
  const handleAddMedicine = () => {
    if (!medicineName.trim() || !medicinePrice || parseFloat(medicinePrice) <= 0) {
      alert("Please enter medicine name and a valid price");
      return;
    }

    const newItem = {
      id: Date.now(),
      type: 'medicine',
      name: medicineName.trim(),
      price: parseFloat(medicinePrice).toFixed(2)
    };

    setMedicineItems([...medicineItems, newItem]);
    setMedicineName('');
    setMedicinePrice('');
  };

  // Remove service item
  const handleRemoveService = (id) => {
    setReceiptItems(receiptItems.filter(item => item.id !== id));
  };

  // Remove medicine item
  const handleRemoveMedicine = (id) => {
    setMedicineItems(medicineItems.filter(item => item.id !== id));
  };

  // Submit receipt and create transaction
  const handleSubmit = async () => {
    if (receiptItems.length === 0 && medicineItems.length === 0) {
      alert("Please add at least one item to the receipt");
      return;
    }

    try {
      setLoading(true);

      // Build receipt object
      const receiptData = {};
      
      // Add services
      receiptItems.forEach(item => {
        receiptData[item.key] = parseFloat(item.price);
      });
      
      // Add medicines
      medicineItems.forEach(item => {
        receiptData[item.name] = parseFloat(item.price);
      });

      const totalAmount = parseFloat(calculateTotal());

      // Create transaction with receipt
      const transactionData = {
        appointmentId: appointmentId,
        amount: totalAmount,
        status: 'Pending',
        currency: 'MYR',
        paymentTime: new Date().toISOString(),
        receipt: receiptData,
        notes: 'Receipt created by staff'
      };

      await createPayment(transactionData);

      alert("Receipt created successfully! Redirecting to payment...");
      
      // Redirect to payment page
      navigate(`/staff/payments/form?appointmentId=${appointmentId}`);
      
    } catch (error) {
      console.error("Error creating receipt:", error);
      alert("Failed to create receipt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="staff">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Create Receipt</h1>
            {appointment && (
              <p className="text-gray-600 mt-2">
                Appointment ID: {appointmentId}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Add Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add Services */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaStethoscope className="text-blue-600" />
                  Add Services
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a service...</option>
                      {APPOINTMENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (MYR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={servicePrice}
                      onChange={(e) => setServicePrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleAddService}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPlus /> Add Service
                  </button>
                </div>
              </div>

              {/* Add Medicines */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaPills className="text-green-600" />
                  Add Medicines
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicine Name
                    </label>
                    <input
                      type="text"
                      value={medicineName}
                      onChange={(e) => setMedicineName(e.target.value)}
                      placeholder="Enter medicine name..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (MYR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={medicinePrice}
                      onChange={(e) => setMedicinePrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <button
                    onClick={handleAddMedicine}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPlus /> Add Medicine
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Receipt Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaReceipt className="text-purple-600" />
                  Receipt Preview
                </h2>

                {/* Services List */}
                {receiptItems.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Services</h3>
                    <div className="space-y-2">
                      {receiptItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded">
                          <span className="flex-1">{item.name}</span>
                          <span className="font-semibold mx-2">RM {item.price}</span>
                          <button
                            onClick={() => handleRemoveService(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medicines List */}
                {medicineItems.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Medicines</h3>
                    <div className="space-y-2">
                      {medicineItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm bg-green-50 p-2 rounded">
                          <span className="flex-1">{item.name}</span>
                          <span className="font-semibold mx-2">RM {item.price}</span>
                          <button
                            onClick={() => handleRemoveMedicine(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {receiptItems.length === 0 && medicineItems.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <FaReceipt size={48} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No items added yet</p>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">RM {calculateTotal()}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading || (receiptItems.length === 0 && medicineItems.length === 0)}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? 'Creating...' : 'Create Receipt & Proceed to Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
