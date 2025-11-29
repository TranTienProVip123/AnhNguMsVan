import { Router } from 'express';
import { getCourses } from '../controllers/courseController.js';
import { listCourseValidator } from '../validations/courseValidation.js';

const router = Router();
router.get('/', listCourseValidator, getCourses);
export default router;
