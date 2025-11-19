import { Router } from "express";
import { register } from "../controllers/authController.js";
import { registerValidator } from "../validations/authValidation.js";

const router = Router();

//signup
router.post('/register', registerValidator, register);

export default router;