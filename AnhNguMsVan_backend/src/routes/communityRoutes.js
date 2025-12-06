import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createPostController,
  listPostsController
} from '../controllers/communityController.js';

const router = Router();

router.get('/posts', listPostsController);
router.post('/posts', authMiddleware, createPostController);

export default router;
