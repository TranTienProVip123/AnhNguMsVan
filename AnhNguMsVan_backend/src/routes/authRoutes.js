import { Router } from "express";
import { register, login, me, forgotPassword, resetPassword, verifyEmail, googleLogin, resendVerifyEmail } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"
import { registerValidator, loginValidator } from "../validations/authValidation.js";

const router = Router();

//signup
router.post('/register', registerValidator, register);
//login
router.post('/login', loginValidator, login);
//google login
router.post('/google', googleLogin)
//me
router.get('/me', authMiddleware, me);

//forgot & change password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/verify-email/resend', resendVerifyEmail);

export default router;
