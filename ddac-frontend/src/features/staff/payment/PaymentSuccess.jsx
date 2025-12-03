import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import * as paymentService from "../services/paymentService";
import { FaCheckCircle, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  const sessionId = searchParams.get("session_id");
  const appointmentId = searchParams.get("appointment_id");

  useEffect(() => {
    if (sessionId && appointmentId) {
      confirmPayment();
    } else {
      setConfirming(false);
      toast.error("Missing payment information. Please contact support.");
    }
  }, [sessionId, appointmentId]);

  const confirmPayment = async () => {
    try {
      setConfirming(true);
      //await paymentService.confirmPayment(appointmentId, sessionId);
      await paymentService.markAppointmentAsPaid(appointmentId);
      //await paymentService.generateReceipt(appointmentId);
      setConfirmed(true);
      toast.success("Payment confirmed successfully!");
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Failed to confirm payment. Please contact support.");
      setConfirmed(false);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Layout role="staff">
      <div className="w-full max-w-full overflow-hidden flex items-center justify-center min-h-screen">
        <div className="bg-card rounded-xl shadow-soft p-8 max-w-md w-full text-center">
          {confirming ? (
            <>
              <FaSpinner className="animate-spin mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl font-bold text-heading mb-2">Confirming Payment...</h2>
              <p className="text-muted">Please wait while we confirm your payment.</p>
            </>
          ) : confirmed ? (
            <>
              <FaCheckCircle className="mx-auto mb-4 text-accent-success" size={64} />
              <h2 className="text-2xl font-bold text-heading mb-2">Payment Successful!</h2>
              <p className="text-muted mb-6">The payment has been processed and confirmed.</p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/staff/payment"
                  className="w-full bg-primary text-ondark px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Back to Payments
                </Link>
                <Link
                  to="/staff/appointments"
                  className="w-full bg-main text-heading px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors"
                >
                  View Appointments
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <FaCheckCircle className="mx-auto mb-4 text-accent-warning" size={64} />
              </div>
              <h2 className="text-2xl font-bold text-heading mb-2">Payment Status Unknown</h2>
              <p className="text-muted mb-6">
                We couldn&apos;t confirm the payment status. Please check your payment records or contact support.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/staff/payment"
                  className="w-full bg-primary text-ondark px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Back to Payments
                </Link>
                <button
                  onClick={() => navigate(-1)}
                  className="w-full bg-main text-heading px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors"
                >
                  <FaArrowLeft className="inline mr-2" />
                  Go Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

