import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';
import { getUsers, updateUser, deleteUser } from '../controllers/userAdminController.js';
import { getConsultations, updateStatus, deleteConsultation } from '../controllers/consultationController.js';
import { updateUserValidator, deleteUserValidator } from '../validations/adminValidation.js';
import { updateStatusValidator, deleteConsultationValidator } from '../validations/consultationValidation.js';

const router = Router();

router.use(authMiddleware, authorize('admin'));

//user management
router.get('/users', getUsers);
router.patch('/users/:id', updateUserValidator, updateUser);
router.delete('/users/:id', deleteUserValidator, deleteUser);

//consultation management
router.get('/consultations', getConsultations);
router.patch('/consultations/:id', updateStatusValidator, updateStatus);
router.delete('/consultations/:id', deleteConsultationValidator, deleteConsultation);

export default router;
