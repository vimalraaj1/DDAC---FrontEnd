// mock database
let appointmentsDB = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    doctorInitials: "SJ",
    date: "Monday, November 25, 2025",
    time: "10:00 AM - 10:30 AM",
    location: "Cardiac Care Center, Room 305",
    status: "Confirmed",
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "General Practitioner",
    doctorInitials: "MC",
    date: "Thursday, November 28, 2025",
    time: "2:00 PM - 2:30 PM",
    location: "Main Clinic, Room 102",
    status: "Confirmed",
  },
  {
    id: "3",
    doctorName: "Dr. Emily Williams",
    doctorSpecialty: "Dermatologist",
    doctorInitials: "EW",
    date: "Friday, November 29, 2025",
    time: "11:00 AM - 11:45 AM",
    location: "Dermatology Wing, Room 201",
    status: "Pending",
  },
  {
    id: "4",
    doctorName: "Dr. Robert Martinez",
    doctorSpecialty: "Orthopedic Surgeon",
    doctorInitials: "RM",
    date: "Monday, December 2, 2025",
    time: "9:00 AM - 9:30 AM",
    location: "Orthopedic Center, Room 408",
    status: "Confirmed",
  },
  {
    id: "5",
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    doctorInitials: "SJ",
    date: "Monday, October 21, 2025",
    time: "10:00 AM - 10:30 AM",
    location: "Cardiac Care Center, Room 305",
    status: "Confirmed",
  },
  {
    id: "6",
    doctorName: "Dr. James Thompson",
    doctorSpecialty: "Neurologist",
    doctorInitials: "JT",
    date: "Wednesday, October 9, 2025",
    time: "3:00 PM - 3:45 PM",
    location: "Neurology Department, Room 501",
    status: "Confirmed",
  },
  {
    id: "7",
    doctorName: "Dr. Lisa Anderson",
    doctorSpecialty: "Pediatrician",
    doctorInitials: "LA",
    date: "Friday, November 15, 2025",
    time: "1:00 PM - 1:30 PM",
    location: "Pediatrics Wing, Room 203",
    status: "Cancelled",
  },
];

export const getDBAppointments = async () => {
  return new Promise((res) => setTimeout(() => res([...appointmentsDB]), 200));
};

export const createAppointment = async (appointment) => {
  const newApp = { id: Date.now(), ...appointment };
  appointmentsDB.push(newApp);
  return new Promise((res) => setTimeout(() => res(newApp), 200));
};

export const updateAppointment = async (id, updatedData) => {
  appointmentsDB = appointmentsDB.map((a) =>
    a.id === id ? { ...a, ...updatedData } : a
  );
  return new Promise((res) => setTimeout(() => res(true), 200));
};

export const deleteAppointment = async (id) => {
  appointmentsDB = appointmentsDB.filter((a) => a.id !== id);
  return new Promise((res) => setTimeout(() => res(true), 200));
};
