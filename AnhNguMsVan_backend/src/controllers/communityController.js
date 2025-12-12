import { createPost, listPosts, likePost, addComment, listComments, getStats } from '../services/communityService.js';

export const createPostController = async (req, res, next) => {
  try {
    const result = await createPost({
      userId: req.user?.userId,
      content: req.body.content,
      category: req.body.category
    });

    if (["INVALID", "SHORT_CONTENT"].includes(result.reason)) {
      return res.status(400).json({ success: false, message: result.message });
    }
    if (result.reason === "UNAUTHORIZED") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
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
      limit: req.query.limit,
      userId: req.user?.userId
    });
    return res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const likePostController = async (req, res, next) => {
  try {
    const result = await likePost({ userId: req.user?.userId, postId: req.params.id });
    if (result.reason === "NOT_FOUND") return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
    return res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export async function addCommentController(req, res, next) {
  try {
    const { id: postId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user?.userId;

    const result = await addComment({ postId, userId, content, parentId });

    if (["INVALID", "SHORT"].includes(result.reason))
      return res.status(400).json({ success: false, message: result.message });
    if (result.reason === "UNAUTHORIZED")
      return res.status(401).json({ success: false, message: "Không có quyền bình luận." });
    if (result.reason === "NOT_FOUND")
      return res.status(404).json({ success: false, message: "Không tìm thấy bài viết." });
    if (result.reason === "PARENT_NOT_FOUND")
      return res.status(404).json({ success: false, message: "Không tìm thấy comment gốc." });

    return res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const listCommentsController = async (req, res, next) => {
  try {
    const data = await listComments({ postId: req.params.id, page: req.query.page, limit: req.query.limit });
    return res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getStatsController = async (req, res, next) => {
  try {
    const data = await getStats({ userId: req.user?.userId });
    return res.json({ success: true, data });
  } catch (err) { next(err); }
};
