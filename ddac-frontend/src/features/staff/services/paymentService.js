import staffApi from "./staffApi";

// Get all payments
export const getAllPayments = async () => {
  const response = await staffApi.get("/payments");
  return response.data;
};

// Get payment by ID
export const getPaymentById = async (id) => {
  const response = await staffApi.get(`/payments/${id}`);
  return response.data;
};

// Get payments by appointment ID
export const getPaymentsByAppointment = async (appointmentId) => {
  const response = await staffApi.get(`/payments/appointment/${appointmentId}`);
  return response.data;
};

// Generate receipt
export const generateReceipt = async (appointmentId, prescriptionId) => {
  const response = await staffApi.post("/payments/receipt", {
    appointmentId,
    prescriptionId,
  });
  return response.data;
};

// Create Stripe checkout session
export const createStripeCheckout = async (paymentData) => {
  const response = await staffApi.post("/payments/stripe/checkout", paymentData);
  return response.data;
};

// Process payment
export const processPayment = async (paymentData) => {
  const response = await staffApi.post("/payments/process", paymentData);
  return response.data;
};

// Mark appointment as paid
export const markAppointmentAsPaid = async (appointmentId) => {
  const response = await staffApi.patch(`/payments/appointment/${appointmentId}/paid`);
  return response.data;
};

// Get payment history
export const getPaymentHistory = async (patientId) => {
  const response = await staffApi.get(`/payments/patient/${patientId}`);
  return response.data;
};

