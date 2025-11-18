import express from "express";
import {
  registerPatient,
  getPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
} from "../controllers/patientController.js";

const router = express.Router();

router.post("/", registerPatient);
router.get("/", getPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatientById);
router.delete("/:id", deletePatientById);

export default router;
