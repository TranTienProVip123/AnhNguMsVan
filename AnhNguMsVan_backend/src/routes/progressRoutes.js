import express from 'express';
import {
  updateWordProgressController,
  getTopicProgressController,
  getCourseProgressController,
  getOverviewProgressController
} from '../controllers/progressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tất cả routes đều cần auth
router.use(authMiddleware);

// Update progress khi học xong 1 từ
router.post('/word', updateWordProgressController);

// Lấy progress của 1 topic
router.get('/topic/:topicId', getTopicProgressController);

// Lấy progress của 1 course
router.get('/course/:courseId', getCourseProgressController);

// Lấy tổng quan tất cả courses
router.get('/overview', getOverviewProgressController);

export default router;