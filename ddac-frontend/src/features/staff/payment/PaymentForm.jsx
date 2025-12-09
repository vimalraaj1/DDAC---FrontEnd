import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import * as paymentService from "../services/paymentService";
import * as appointmentService from "../services/appointmentService";
import * as prescriptionService from "../services/prescriptionService";
import { FaArrowLeft, FaCreditCard, FaFileInvoice } from "react-icons/fa";

export default function PaymentForm() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [existingPayments, setExistingPayments] = useState([]);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (appointmentId) loadData();
  }, [appointmentId]);

  const loadData = async () => {
    try {
      const apptData = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(apptData);

      const prescData = await prescriptionService.getPrescriptionsByAppointment(appointmentId);
      if (prescData && prescData.length > 0) setPrescription(prescData[0]);

      const receiptData = await paymentService.generateReceipt(appointmentId, prescData?.[0]?.id);
      setReceipt(receiptData);
      setPaymentAmount(receiptData?.totalAmount || 0);

      // Fetch existing payments for this appointment
      const payments = await paymentService.getPaymentsByAppointment(appointmentId);
      setExistingPayments(payments);
      setIsPaid(payments.some(t => t.status?.toLowerCase() === "paid"));
    } catch (error) {
      console.error("Error loading data:", error);

      // fallback mock data
      setAppointment({ id: appointmentId, patient: { firstName: "John", lastName: "Doe" } });
      setReceipt({
        totalAmount: 150.0,
        items: [
          { description: "Consultation", amount: 100.0 },
          { description: "Medication", amount: 50.0 }
        ]
      });
      setPaymentAmount(150.0);
    }
  };

  const handleStripeCheckout = async () => {
    if (!appointmentId) return;

    try {
      setLoading(true);

      // Check if a pending transaction already exists
      const pendingTransaction = existingPayments?.find(t => t.status?.toLowerCase() === "pending");

      const checkoutData = await paymentService.createStripeSession(appointmentId, {
        amount: pendingTransaction ? pendingTransaction.amount : paymentAmount,
        currency: "MYR",
        receipt: receipt?.items || null
      });

      if (checkoutData.url) window.location.href = checkoutData.url;
    } catch (error) {
      console.error("Error creating Stripe checkout:", error);
      alert("Error processing payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!appointmentId) return;

    try {
      setLoading(true);
      await paymentService.markAppointmentAsPaid(appointmentId);
      alert("Appointment marked as paid successfully!");
      navigate("/staff/appointments");
    } catch (error) {
      console.error("Error marking as paid:", error);
      alert("Error marking appointment as paid.");
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
              to={appointmentId ? `/staff/appointments/${appointmentId}` : "/staff/payment"}
              className="text-primary hover:underline flex items-center gap-2 mb-4"
            >
              <FaArrowLeft size={16} /> Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Process Payment</h1>
            {appointment && (
              <p className="text-gray-600 mt-2">
                For: {appointment._patient
                  ? `${appointment._patient.firstName || ""} ${appointment._patient.lastName || ""}`.trim()
                  : appointment.patientId || appointment.patientName || "Patient"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Receipt */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaFileInvoice className="text-primary" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">Receipt</h2>
              </div>
              {receipt ? (
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Items</h3>
                    {receipt.items?.map((item, index) => (
                      <div key={index} className="flex justify-between mb-2">
                        <span className="text-gray-600">{item.description}</span>
                        <span className="font-medium">${item.amount?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${receipt.totalAmount?.toFixed(2) || paymentAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Loading receipt...</p>
              )}
            </div>

            {/* Payment Options */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaCreditCard className="text-primary" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">Payment Options</h2>
              </div>
              <div className="space-y-4">
                <button
                  onClick={handleStripeCheckout}
                  disabled={loading || isPaid}
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaCreditCard size={16} />
                  {loading ? "Processing..." : isPaid ? "Already Paid" : "Pay with Stripe"}
                </button>
                <button
                  onClick={handleMarkAsPaid}
                  disabled={loading || isPaid}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Processing..." : isPaid ? "Already Paid" : "Mark as Paid (Cash/Other)"}
                </button>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Select a payment method to process this payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
