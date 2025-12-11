import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createPostController, listPostsController, likePostController, addCommentController, listCommentsController, getStatsController } from '../controllers/communityController.js';

const router = Router();

router.get('/posts', listPostsController);
router.post('/posts', authMiddleware, createPostController);
router.post('/posts/:id/like', authMiddleware, likePostController);
router.post("/posts/:id/comments", authMiddleware, addCommentController);
router.get("/posts/:id/comments", listCommentsController);
router.get("/posts/stats", authMiddleware, getStatsController);

export default router;
