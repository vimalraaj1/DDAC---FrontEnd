import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import Layout from "../../../components/Layout";
import StatusBadge from "../components/StatusBadge";
import * as paymentService from "../services/paymentService";
import * as appointmentService from "../services/appointmentService";
import { FaArrowLeft, FaCreditCard, FaFileInvoice, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { formatStaffDate } from "../utils/dateFormat";

export default function PaymentDetails() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledAppointment = location.state?.appointment || null;
  const prefilledPatient = location.state?.patient || null;
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(prefilledAppointment);
  const [billingSummary, setBillingSummary] = useState(null);
  const [consultationDetails, setConsultationDetails] = useState(null);
  const initialFees = {
    consultationFee: "",
    medicationFee: "",
    otherCharges: "",
    notes: "",
  };
  const [fees, setFees] = useState(initialFees);
  const [feeErrors, setFeeErrors] = useState({});
  const [stripeProcessing, setStripeProcessing] = useState(false);
  const [manualProcessing, setManualProcessing] = useState(false);

  const buildBillingSummary = (feeData = fees) => {
    const parsed = {
      consultationFee: Number(feeData.consultationFee) || 0,
      medicationFee: Number(feeData.medicationFee) || 0,
      otherCharges: Number(feeData.otherCharges) || 0,
    };

    const items = [
      parsed.consultationFee > 0 && { description: "Consultation Fee", amount: parsed.consultationFee },
      parsed.medicationFee > 0 && { description: "Medication", amount: parsed.medicationFee },
      parsed.otherCharges > 0 && { description: "Additional Fees", amount: parsed.otherCharges },
    ].filter(Boolean);

    return {
      consultationFee: parsed.consultationFee,
      medicineCost: parsed.medicationFee,
      additionalFee: parsed.otherCharges,
      total: parsed.consultationFee + parsed.medicationFee + parsed.otherCharges,
      items,
    };
  };

  const handleFeeChange = (field, value) => {
    setFees((prev) => {
      const next = { ...prev, [field]: value };
      setBillingSummary(buildBillingSummary(next));
      return next;
    });
    if (feeErrors[field]) {
      setFeeErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateFees = () => {
    const errors = {};
    ["consultationFee", "medicationFee", "otherCharges"].forEach((field) => {
      const value = Number(fees[field]);
      if (Number.isNaN(value) || value < 0) {
        errors[field] = "Enter a valid amount (0 or greater).";
      }
    });
    const total = Number(billingSummary?.total) || 0;
    if (total <= 0) {
      errors.total = "Total amount must be greater than zero.";
    }
    setFeeErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFeeBreakdown = () => ({
    consultationFee: Number(fees.consultationFee) || 0,
    medicationFee: Number(fees.medicationFee) || 0,
    otherCharges: Number(fees.otherCharges) || 0,
  });

  const getTotalAmount = () => Number(billingSummary?.total) || 0;

  const getNotes = () => (fees.notes || "").trim();

  useEffect(() => {
    loadData();
  }, [appointmentId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load appointment
      const apptData = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(apptData);
      const status = (apptData?.status || "").toLowerCase();
      if (status !== "completed" && status !== "paid") {
        toast.error("Only completed appointments can be processed for payment.");
        navigate("/staff/appointments");
        return;
      }

      // Load consultation details
      try {
        const consultationData = await appointmentService.getConsultationByAppointmentId(appointmentId);
        setConsultationDetails(consultationData || null);
      } catch (err) {
        setConsultationDetails(null);
      }

      const defaultFees = { ...initialFees };
      setFees(defaultFees);
      setBillingSummary(buildBillingSummary(defaultFees));
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load payment details. Please try again.");
      navigate("/staff/payment");
    } finally {
      setLoading(false);
    }
  };

  const handleStripeCheckout = async () => {
    const currentStatus = (appointment?.status || "").toLowerCase();
    if (currentStatus === "paid") {
      toast.error("This appointment has already been paid.");
      return;
    }
    if (currentStatus !== "completed") {
      toast.error("Only completed appointments can be paid.");
      return;
    }
    if (!validateFees()) {
      toast.error("Please resolve the highlighted fee issues before continuing.");
      return;
    }

    try {
      setStripeProcessing(true);
      const checkoutData = await paymentService.createStripeSession(appointmentId, {
        amount: getTotalAmount(),
        currency: "MYR",
        fees: getFeeBreakdown(),
      });
      
      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      } else {
        toast.error("Failed to create payment session. Please try again.");
      }
    } catch (error) {
      console.error("Error creating Stripe checkout:", error);
      toast.error("Error processing payment. Please try again.");
    } finally {
      setStripeProcessing(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if ((appointment?.status || "").toLowerCase() === "paid") {
      toast.error("This appointment has already been paid.");
      return;
    }
    if (!window.confirm("Mark this appointment as paid (cash/other payment method)?")) {
      return;
    }
    if (!validateFees()) {
      toast.error("Please resolve the highlighted fee issues before continuing.");
      return;
    }

    try {
      setManualProcessing(true);
      await paymentService.createPayment({
        appointmentId,
        amount: getTotalAmount(),
        currency: "MYR",
        paymentMethod: "Manual",
      });
      await paymentService.markAppointmentAsPaid(appointmentId);
      toast.success("Manual payment recorded successfully!");
      await loadData();
    } catch (error) {
      console.error("Error marking as paid:", error);
      toast.error("Error marking appointment as paid.");
    } finally {
      setManualProcessing(false);
    }
  };

  const getPatientName = () => {
    if (appointment?._patient) {
      return `${appointment._patient.firstName || ""} ${appointment._patient.lastName || ""}`.trim();
    }
    if (prefilledPatient) {
      return `${prefilledPatient.firstName || ""} ${prefilledPatient.lastName || ""}`.trim();
    }
    return appointment?.patientName || appointment?.patientId || "Patient";
  };

  const getPatientEmail = () => {
    return (
      appointment?._patient?.email ||
      prefilledPatient?.email ||
      appointment?.patientEmail ||
      ""
    );
  };

  const getPatientPhone = () => {
    return (
      appointment?._patient?.phone ||
      prefilledPatient?.phone ||
      appointment?.patientPhone ||
      ""
    );
  };

  const getFeedbackNotes = () => {
    return consultationDetails?.FeedbackNotes ?? consultationDetails?.feedbackNotes ?? "";
  };

  const getPrescriptionNotes = () => {
    return consultationDetails?.PrescriptionNotes ?? consultationDetails?.prescriptionNotes ?? "";
  };

  if (loading) {
    return (
      <Layout role="staff">
        <div className="w-full max-w-full overflow-hidden flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaSpinner className="animate-spin mx-auto mb-4 text-primary" size={32} />
            <p className="text-muted">Loading payment details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!appointment || !billingSummary) {
    return (
      <Layout role="staff">
        <div className="w-full max-w-full overflow-hidden flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-muted mb-4">Payment details not found</p>
            <Link to="/staff/payment" className="text-primary hover:underline">
              Back to Payments
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const normalizedStatus = (appointment?.status || "").toLowerCase();
  const isPaid = normalizedStatus === "paid";

  return (
    <Layout role="staff">
      <div className="w-full max-w-full overflow-hidden">
        <div className="mb-6">
          <Link
            to="/staff/payment"
            className="flex items-center gap-2 px-4 py-2 text-muted hover:text-heading transition-colors mb-4"
          >
            <FaArrowLeft size={16} />
            <span>Back to Payments</span>
          </Link>
          <h1 className="text-3xl font-bold text-heading mb-2">Payment Details</h1>
          <p className="text-muted">For: {getPatientName()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaFileInvoice className="text-primary" size={20} />
                <h2 className="text-xl font-semibold text-heading">Appointment & Patient Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">Appointment ID</p>
                  <p className="text-body font-medium">{appointmentId}</p>
                </div>
                <div>
                  <p className="text-muted">Status</p>
                  <StatusBadge status={appointment.status} />
                </div>
                <div>
                  <p className="text-muted">Patient</p>
                  <p className="text-body font-medium">{getPatientName()}</p>
                </div>
                <div>
                  <p className="text-muted">Patient Email</p>
                  <p className="text-body font-medium">{getPatientEmail() || "—"}</p>
                </div>
                <div>
                  <p className="text-muted">Patient Phone</p>
                  <p className="text-body font-medium">{getPatientPhone() || "—"}</p>
                </div>
                <div>
                  <p className="text-muted">Date & Time</p>
                  <p className="text-body font-medium">
                    {formatStaffDate(appointment.date)} · {appointment.time || "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-muted">Purpose</p>
                  <p className="text-body font-medium">{appointment.purpose || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaFileInvoice className="text-primary" size={20} />
                <h2 className="text-xl font-semibold text-heading">Consultation Notes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">Feedback Notes</p>
                  <p className="text-body font-medium whitespace-pre-wrap break-words">
                    {getFeedbackNotes() || "No feedback notes"}
                  </p>
                </div>
                <div>
                  <p className="text-muted">Prescription Notes</p>
                  <p className="text-body font-medium whitespace-pre-wrap break-words">
                    {getPrescriptionNotes() || "No prescription notes"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaCreditCard className="text-primary" size={20} />
                <h2 className="text-xl font-semibold text-heading">Fee Breakdown</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted mb-1 block">Consultation Fee (RM)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={fees.consultationFee}
                    onChange={(e) => handleFeeChange("consultationFee", e.target.value)}
                    className="w-full border border-color rounded-lg px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {feeErrors.consultationFee && <p className="text-accent-danger text-xs mt-1">{feeErrors.consultationFee}</p>}
                </div>
                <div>
                  <label className="text-sm text-muted mb-1 block">Medication Fee (RM)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={fees.medicationFee}
                    onChange={(e) => handleFeeChange("medicationFee", e.target.value)}
                    className="w-full border border-color rounded-lg px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {feeErrors.medicationFee && <p className="text-accent-danger text-xs mt-1">{feeErrors.medicationFee}</p>}
                </div>
                <div>
                  <label className="text-sm text-muted mb-1 block">Other Charges (RM)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={fees.otherCharges}
                    onChange={(e) => handleFeeChange("otherCharges", e.target.value)}
                    className="w-full border border-color rounded-lg px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {feeErrors.otherCharges && <p className="text-accent-danger text-xs mt-1">{feeErrors.otherCharges}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm text-muted mb-1 block">Notes (optional)</label>
                <textarea
                  rows="3"
                  value={fees.notes}
                  onChange={(e) => handleFeeChange("notes", e.target.value)}
                  className="w-full border border-color rounded-lg px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add remarks about this payment..."
                />
              </div>

              <div className="mt-6 border-t border-color pt-4">
                <h3 className="font-semibold text-heading mb-3">Billing Summary</h3>
                <div className="space-y-2">
                  {billingSummary.items?.length ? (
                    billingSummary.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-body">{item.description}</span>
                        <span className="font-medium text-heading">RM {item.amount?.toFixed(2) || "0.00"}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-sm">Add at least one fee to generate a summary.</p>
                  )}
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-primary mt-4">
                  <span className="text-lg font-semibold text-heading">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    RM {billingSummary.total?.toFixed(2) || "0.00"}
                  </span>
                </div>
                {feeErrors.total && <p className="text-accent-danger text-xs mt-2">{feeErrors.total}</p>}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-soft p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaCreditCard className="text-primary" size={20} />
              <h2 className="text-xl font-semibold text-heading">Payment Options</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleStripeCheckout}
                disabled={stripeProcessing || isPaid}
                className="w-full bg-primary text-ondark px-6 py-3 rounded-lg hover:bg-primary-hover flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {stripeProcessing ? (
                  <>
                    <FaSpinner className="animate-spin" size={16} />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard size={16} />
                    Pay with Stripe
                  </>
                )}
              </button>

              <button
                onClick={handleMarkAsPaid}
                disabled={manualProcessing || isPaid}
                className="w-full bg-accent-success bg-opacity-10 text-ondark px-6 py-3 rounded-lg hover:bg-opacity-20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {manualProcessing ? (
                  <>
                    <FaSpinner className="animate-spin" size={16} />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle size={16} />
                    Mark as Paid (Cash/Other)
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-color space-y-2 text-sm">
                <p className="text-muted">
                  Stripe checkout will redirect you to a secure payment page. Appointment status changes to <strong>Paid</strong> once the payment is confirmed.
                </p>
                {isPaid && (
                  <p className="text-accent-success font-medium">
                    This appointment has already been paid. You can download the receipt from the transactions module.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

