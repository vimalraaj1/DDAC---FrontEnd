import express from "express";
import {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from "../features/staff/appointments/appointmentService.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getAllAppointments());
});

router.post("/", (req, res) => {
  const newApp = createAppointment(req.body);
  res.status(201).json(newApp);
});

router.put("/:id", (req, res) => {
  const updated = updateAppointment(Number(req.params.id), req.body);
  res.json(updated);
});

router.delete("/:id", (req, res) => {
  deleteAppointment(Number(req.params.id));
  res.status(204).send();
});

export default router;
