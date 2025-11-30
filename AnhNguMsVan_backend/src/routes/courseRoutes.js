import { Router } from 'express';
import { getCourses, getCourseDetail } from '../controllers/courseController.js';
import { listCourseValidator, getCourseDetailValidator } from '../validations/courseValidation.js';

const router = Router();
router.get('/', listCourseValidator, getCourses);
router.get('/:id', getCourseDetailValidator, getCourseDetail);
export default router;
