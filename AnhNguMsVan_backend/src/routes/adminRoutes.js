import { Router } from 'express';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';
import { getUsers, updateUser, deleteUser } from '../controllers/userAdminController.js';
import { getConsultations, updateStatus, deleteConsultation } from '../controllers/consultationController.js';
import { createCourseController, updateCourseController, deleteCourseController } from '../controllers/courseController.js';
import { createTopicController, updateTopicController, deleteTopicController } from '../controllers/topicController.js';
import { updateUserValidator, deleteUserValidator } from '../validations/adminValidation.js';
import { updateStatusValidator, deleteConsultationValidator } from '../validations/consultationValidation.js';
import { createCourseValidator, updateCourseValidator, deleteCourseValidator } from '../validations/courseValidation.js';
import { createTopicValidator, updateTopicValidator, deleteTopicValidator } from '../validations/topicValidation.js';

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

//course management
router.post('/courses', createCourseValidator, createCourseController);
router.patch('/courses/:id', updateCourseValidator, updateCourseController);
router.delete('/courses/:id', deleteCourseValidator, deleteCourseController);

//topic
router.post('/topics', createTopicValidator, createTopicController);
router.put('/topics/:id', updateTopicValidator, updateTopicController);
router.delete('/topics/:id', deleteTopicValidator, deleteTopicController);

export default router;
