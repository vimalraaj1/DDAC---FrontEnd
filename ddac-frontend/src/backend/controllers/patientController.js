import fs from "fs";
import path from "path";

const filePath = path.resolve("data/patients.json");

const readData = () => JSON.parse(fs.readFileSync(filePath, "utf8") || "[]");
const writeData = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

// CREATE
export const registerPatient = (req, res) => {
  const patients = readData();
  const newPatient = { id: patients.length ? patients[patients.length - 1].id + 1 : 1, ...req.body };
  patients.push(newPatient);
  writeData(patients);
  res.status(201).json(newPatient);
};

// READ
export const getPatients = (req, res) => {
  res.json(readData());
};
