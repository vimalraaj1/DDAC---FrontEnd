import fs from "fs";
import path from "path";

const filePath = path.resolve("data/appointments.json");

const readData = () => JSON.parse(fs.readFileSync(filePath, "utf8") || "[]");
const writeData = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

// CREATE
export const createAppointment = (req, res) => {
  const appointments = readData();
  const newApp = { id: appointments.length ? appointments[appointments.length - 1].id + 1 : 1, ...req.body };
  appointments.push(newApp);
  writeData(appointments);
  res.status(201).json(newApp);
};

// READ
export const getAppointments = (req, res) => {
  res.json(readData());
};

// UPDATE
export const updateAppointment = (req, res) => {
  const appointments = readData();
  const id = Number(req.params.id);
  const index = appointments.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: "Appointment not found" });

  appointments[index] = { ...appointments[index], ...req.body };
  writeData(appointments);
  res.json(appointments[index]);
};

// DELETE
export const deleteAppointment = (req, res) => {
  let appointments = readData();
  const id = Number(req.params.id);
  appointments = appointments.filter(a => a.id !== id);
  writeData(appointments);
  res.status(204).send();
};
