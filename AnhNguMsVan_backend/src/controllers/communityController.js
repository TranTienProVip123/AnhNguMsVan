import { createPost, listPosts } from '../services/communityService.js';

export const createPostController = async (req, res, next) => {
  try {
    const result = await createPost({
      userId: req.user?.userId,
      title: req.body.title,
      content: req.body.content,
      category: req.body.category
    });

    if (result.reason === 'INVALID') {
      return res.status(400).json({ success: false, message: result.message });
    }
    if (result.reason === 'UNAUTHORIZED') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    return res.status(201).json({ success: true, data: result.post });
  } catch (err) {
    next(err);
  }
};

export const listPostsController = async (req, res, next) => {
  try {
    const data = await listPosts({
      category: req.query.category,
      page: req.query.page,
      limit: req.query.limit
    });
    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
