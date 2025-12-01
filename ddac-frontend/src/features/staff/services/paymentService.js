import staffApi from "./staffApi";

const TRANSACTION_ENDPOINT = "/transactions";
const APPOINTMENT_ENDPOINT = "/appointments";

const mapTransactionPayload = (payload = {}) => ({
  id: payload.id?.trim() ?? "",
  paymentIntentId: payload.paymentIntentId?.trim() ?? "",
  chargeId: payload.chargeId?.trim() ?? "",
  amount: Number(payload.amount) || 0,
  currency: payload.currency || "MYR",
  status: payload.status || "Pending",
  paymentTime: payload.paymentTime || new Date().toISOString(),
  paymentMethod: payload.paymentMethod || "",
  notes: payload.notes || "",
  cardLast4: payload.cardLast4 || null,
  appointmentId: payload.appointmentId?.trim() ?? "",
  patient: payload.patient || null,
  fees: payload.fees || {
    consultationFee: Number(payload.consultationFee) || 0,
    medicationFee: Number(payload.medicationFee) || 0,
    otherCharges: Number(payload.otherCharges) || 0,
  },
});

export const getAllPayments = async () => {
  const response = await staffApi.get(TRANSACTION_ENDPOINT);
  return response.data;
};

export const getPaymentById = async (id) => {
  const response = await staffApi.get(`${TRANSACTION_ENDPOINT}/${id}`);
  return response.data;
};

export const getPaymentsByAppointment = async (appointmentId) => {
  const response = await staffApi.get(TRANSACTION_ENDPOINT, {
    params: { appointmentId },
  });
  return response.data;
};

export const createPayment = async (transactionData) => {
  const response = await staffApi.post(
    TRANSACTION_ENDPOINT,
    mapTransactionPayload(transactionData)
  );
  return response.data;
};

export const updatePayment = async (id, transactionData) => {
  const response = await staffApi.put(
    `${TRANSACTION_ENDPOINT}/${id}`,
    mapTransactionPayload(transactionData)
  );
  return response.data;
};

export const getPaymentDetails = async (appointmentId) => {
  try {
    const response = await staffApi.get(`${TRANSACTION_ENDPOINT}/appointment/${appointmentId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createStripeSession = async (appointmentId, payload = {}) => {
  const response = await staffApi.post(`${TRANSACTION_ENDPOINT}/create-payment-intent`, {
    appointmentId,
    amount: payload.amount,
    currency: payload.currency || "MYR",
    fees: payload.fees,
  });

  return {
    url: response.data.checkoutUrl || response.data.url,
    clientSecret: response.data.clientSecret,
    sessionId: response.data.sessionId,
  };
};

export const confirmPayment = async (appointmentId, sessionId) => {
  const response = await staffApi.post(`${TRANSACTION_ENDPOINT}/confirm`, {
    appointmentId,
    sessionId,
  });
  return response.data;
};

export const markAppointmentAsPaid = async (appointmentId, payload = {}) => {
  const response = await staffApi.patch(`${APPOINTMENT_ENDPOINT}/${appointmentId}/mark-paid`, {
    status: "Paid",
    ...payload,
  });
  return response.data;
};

export const generateReceipt = async (appointmentId, prescriptionId = null) => {
  const response = await staffApi.post(`${TRANSACTION_ENDPOINT}/receipt`, {
    appointmentId,
    prescriptionId,
  });
  return response.data;
};

export const getPendingPayments = async () => {
  const response = await staffApi.get(`${TRANSACTION_ENDPOINT}/pending`);
  return response.data;
};