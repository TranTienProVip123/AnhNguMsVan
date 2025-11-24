import { Router } from "express";
import { register, login, me, forgotPassword, resetPassword, verifyEmail } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"
import { registerValidator, loginValidator } from "../validations/authValidation.js";

const router = Router();

//signup
router.post('/register', registerValidator, register);
//login
router.post('/login', loginValidator, login);
//me
router.get('/me', authMiddleware, me);

//forgot & change password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email', verifyEmail);

export default router;