import express from "express";
import { createAppointment, getAppointments, updateAppointment, deleteAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", getAppointments);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;
