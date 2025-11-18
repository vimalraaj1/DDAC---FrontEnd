import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/patients.json");

// Log the resolved path for debugging
console.log("Patients file path:", filePath);

// Ensure data directory exists
const dataDir = path.dirname(filePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Ensure file exists
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", "utf8");
}

const readData = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(data || "[]");
    // Ensure we always return an array
    if (!Array.isArray(parsed)) {
      console.warn("Patients data is not an array, resetting to empty array");
      return [];
    }
    return parsed;
  } catch (error) {
    console.error("Error reading patients.json:", error);
    // Return empty array instead of throwing to prevent crashes
    console.warn("Returning empty array due to read error");
    return [];
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing patients.json:", error);
    throw error;
  }
};

// CREATE
export const registerPatient = (req, res) => {
  try {
    const patients = readData();
    if (!Array.isArray(patients)) {
      console.error("Patients data is not an array during registration");
      return res.status(500).json({ message: "Internal server error: Invalid data format" });
    }
    const newPatient = { id: patients.length ? patients[patients.length - 1].id + 1 : 1, ...req.body };
    patients.push(newPatient);
    writeData(patients);
    res.status(201).json(newPatient);
  } catch (error) {
    console.error("Error registering patient:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// READ ALL
export const getPatients = (req, res) => {
  try {
    res.json(readData());
  } catch (error) {
    console.error("Error getting patients:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// READ one
export const getPatientById = (req, res) => {
  try {
    const patients = readData();
    if (!Array.isArray(patients)) {
      console.error("Patients data is not an array when getting by id");
      return res.status(500).json({ message: "Internal server error: Invalid data format" });
    }
    const patient = patients.find((p) => p.id == req.params.id);

    if (!patient) return res.status(404).json({message: "Patient not found"});
    res.json(patient);
  } catch (error) {
    console.error("Error getting patient by id:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// UPDATE
export const updatePatientById = (req, res) => {
  try {
    const patients = readData();
    
    // Validate that patients is an array
    if (!Array.isArray(patients)) {
      console.error("Patients data is not an array:", typeof patients, patients);
      return res.status(500).json({ message: "Internal server error: Invalid data format" });
    }
    
    const id = parseInt(req.params.id);

    const index = patients.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Update patient fields, preserving the id
    patients[index] = {
      ...patients[index],
      ...req.body,
      id: patients[index].id, // Ensure id is preserved
    };

    writeData(patients);
    res.json(patients[index]);
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// DELETE
export const deletePatientById = (req, res) => {
  try {
    const patients = readData();
    if (!Array.isArray(patients)) {
      console.error("Patients data is not an array when deleting");
      return res.status(500).json({ message: "Internal server error: Invalid data format" });
    }
    const updated = patients.filter((p) => p.id != req.params.id);

    if (updated.length === patients.length)
      return res.status(404).json({message: "Patient not found"});

    writeData(updated);
    res.json({message: "Patient deleted"});
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
