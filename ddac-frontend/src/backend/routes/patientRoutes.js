import express from "express";
import { registerPatient, getPatients } from "../controllers/patientController.js";

const router = express.Router();

router.get("/", getPatients);
router.post("/", registerPatient);

export default router;
