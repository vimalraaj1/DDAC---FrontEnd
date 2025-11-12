import express from "express";
import cors from "cors";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/appointments", appointmentRoutes);
app.use("/patients", patientRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
