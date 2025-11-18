import express from "express";
import { getUsers, createUser, getUsersByRole } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/role/:role", getUsersByRole);     // e.g. /users/role/P
router.get("/filter", getUsersByRole);         // e.g. /users/filter?role=P
router.post("/", createUser);

export default router;
