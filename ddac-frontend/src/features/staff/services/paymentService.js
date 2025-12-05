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
  cardLast4: payload.cardLast4 || null,
  appointmentId: payload.appointmentId?.trim() ?? "",
  receipt: payload.receipt || null,
});

// For updates, only send fields that are actually provided
const mapTransactionUpdatePayload = (payload = {}) => {
  const mapped = {};
  if (payload.amount !== undefined) mapped.amount = Number(payload.amount);
  if (payload.currency) mapped.currency = payload.currency;
  if (payload.status) mapped.status = payload.status;
  if (payload.paymentMethod) mapped.paymentMethod = payload.paymentMethod;
  if (payload.paymentIntentId !== undefined) mapped.paymentIntentId = payload.paymentIntentId;
  if (payload.chargeId !== undefined) mapped.chargeId = payload.chargeId;
  if (payload.cardLast4 !== undefined) mapped.cardLast4 = payload.cardLast4;
  if (payload.receipt !== undefined) mapped.receipt = payload.receipt;
  return mapped;
};

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
    mapTransactionUpdatePayload(transactionData)
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
  const requestData = {
    appointmentId,
    amount: payload.amount,
    currency: payload.currency || "MYR",
    receipt: payload.receipt || null,
  };
  
  console.log('Creating Stripe session - Request data:', JSON.stringify(requestData, null, 2));
  
  const response = await staffApi.post(`${TRANSACTION_ENDPOINT}/create-payment-intent`, requestData);

  return {
    url: response.data.checkoutUrl || response.data.url,
    clientSecret: response.data.clientSecret,
    sessionId: response.data.sessionId,
  };
};

export const confirmPayment = async (data) => {
  const response = await staffApi.post(`${TRANSACTION_ENDPOINT}/confirm`, {
    appointmentId: data.appointmentId,
    sessionId: data.sessionId,
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