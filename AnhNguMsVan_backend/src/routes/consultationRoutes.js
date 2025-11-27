import express from "express";
import { submitConsultation } from "../controllers/consultationController.js";
import { consultationValidation } from "../validations/consultationValidation.js";

const router = express.Router();

// POST /api/consultations
router.post("/", consultationValidation, submitConsultation);

export default router;
