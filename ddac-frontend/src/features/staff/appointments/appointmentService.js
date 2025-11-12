let appointmentsDB = [
  { id: 1, date: "2025-11-12", time: "10:00", doctor: "Dr. Smith", status: "Booked" },
  { id: 2, date: "2025-11-13", time: "14:00", doctor: "Dr. Jane", status: "Booked" },
];

export const getAppointments = async () => {
  return new Promise((res) => setTimeout(() => res([...appointmentsDB]), 200));
};

export const createAppointment = async (appointment) => {
  const newApp = { id: Date.now(), ...appointment };
  appointmentsDB.push(newApp); 
  return new Promise((res) => setTimeout(() => res(newApp), 200));
};

export const updateAppointment = async (id, updatedData) => {
  appointmentsDB = appointmentsDB.map(a => (a.id === id ? { ...a, ...updatedData } : a));
  return new Promise(res => setTimeout(() => res(true), 200));
};

export const deleteAppointment = async (id) => {
  appointmentsDB = appointmentsDB.filter(a => a.id !== id);
  return new Promise(res => setTimeout(() => res(true), 200));
};
