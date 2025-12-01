import { Link } from "react-router-dom";
import Layout from "../../../components/Layout";
import { FaTimesCircle, FaArrowLeft, FaCreditCard } from "react-icons/fa";

export default function PaymentFailed() {
  return (
    <Layout role="staff">
      <div className="w-full max-w-full overflow-hidden flex items-center justify-center min-h-screen">
        <div className="bg-card rounded-xl shadow-soft p-8 max-w-md w-full text-center">
          <FaTimesCircle className="mx-auto mb-4 text-accent-danger" size={64} />
          <h2 className="text-2xl font-bold text-heading mb-2">Payment Failed</h2>
          <p className="text-muted mb-6">
            The payment could not be processed. Please try again or use an alternative payment method.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/staff/payment"
              className="w-full bg-primary text-ondark px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
            >
              <FaCreditCard size={16} />
              Try Again
            </Link>
            <Link
              to="/staff/appointments"
              className="w-full bg-main text-heading px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2"
            >
              <FaArrowLeft size={16} />
              Back to Appointments
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

