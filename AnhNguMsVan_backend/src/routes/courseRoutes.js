import { Router } from 'express';
import { getCourses, getCourseDetail, startCourseController } from '../controllers/courseController.js';
import { listCourseValidator, getCourseDetailValidator } from '../validations/courseValidation.js';

const router = Router();
router.get('/', listCourseValidator, getCourses);
router.get('/:id', getCourseDetailValidator, getCourseDetail);

// đếm số lượng User bắt đầu học khóa
router.post("/:courseId/start", startCourseController);

export default router;
