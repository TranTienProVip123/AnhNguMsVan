import Post from "../models/Post.js";
import User from "../models/User.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";

const DEFAULT_CATEGORY = "Tất cả";
const MIN_TITLE_LENGTH = 6;
const MIN_CONTENT_LENGTH = 10;

const normalizeText = (value = "") => value.replace(/\s+/g, " ").trim();

export const createPost = async ({ userId, title, content, category }) => {
  const normalizedTitle = normalizeText(title);
  const normalizedContent = normalizeText(content);
  const normalizedCategory = normalizeText(category) || DEFAULT_CATEGORY;

  if (!normalizedTitle) {
    return { reason: "INVALID", message: "Tiêu đề không được để trống." };
  }
  if (normalizedTitle.length < MIN_TITLE_LENGTH) {
    return { reason: "SHORT_TITLE", message: `Tiêu đề cần ít nhất ${MIN_TITLE_LENGTH} ký tự.` };
  }

  if (!normalizedContent) {
    return { reason: "INVALID", message: "Nội dung không được để trống." };
  }
  if (normalizedContent.length < MIN_CONTENT_LENGTH) {
    return { reason: "SHORT_CONTENT", message: `Nội dung cần ít nhất ${MIN_CONTENT_LENGTH} ký tự.` };
  }

  const user = await User.findById(userId).select("name email avatar role");
  if (!user) return { reason: "UNAUTHORIZED" };

  const post = await Post.create({
    title: normalizedTitle,
    content: normalizedContent,
    category: normalizedCategory,
    author: user._id
  });

  return {
    post: {
      id: post._id,
      title: post.title,
      content: post.content,
      category: post.category,
      createdAt: post.createdAt,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      author: {
        id: user._id,
        name: user.name || user.email,
        avatar: user.avatar || "",
        role: user.role || ""
      }
    }
  };
};

export const listPosts = async ({ category, page = 1, limit = 5, userId }) => {
  const filter = { isActive: true };
  const normalizedCategory = category || DEFAULT_CATEGORY;

  if (normalizedCategory && normalizedCategory !== DEFAULT_CATEGORY) {
    filter.category = normalizedCategory;
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 5));
  const skip = (safePage - 1) * safeLimit;

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate({ path: "author", select: "name email avatar role" })
      .lean(),
    Post.countDocuments(filter)
  ]);

  //lấy tất cả postId ở trang hiện tại,query like của user -> tạo likedMap,map vào kết quả
  let likedMap = {};
  if (userId) {
    const ids = posts.map((p) => p._id);
    const likedRows = await Like.find({ post: { $in: ids }, user: userId }).select("post").lean();
    likedMap = likedRows.reduce((acc, r) => {
      acc[r.post.toString()] = true;
      return acc;
    }, {});
  }

  const items = posts.map((p) => ({
    id: p._id,
    title: p.title,
    content: p.content,
    category: p.category,
    createdAt: p.createdAt,
    likesCount: p.likesCount || 0,
    commentsCount: p.commentsCount || 0,
    liked: !!likedMap[p._id.toString()],
    author: {
      id: p.author?._id,
      name: p.author?.name || p.author?.email || "Người dùng",
      avatar: p.author?.avatar || "",
      role: p.author?.role || ""
    }
  }));

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit
  };
};

export const likePost = async ({ userId, postId }) => {
  const post = await Post.findById(postId).select("likesCount");
  if (!post) return { reason: "NOT_FOUND" };

  const existing = await Like.findOne({ post: postId, user: userId });
  if (existing) {
    await Like.deleteOne({ _id: existing._id });
    post.likesCount = Math.max(0, (post.likesCount || 0) - 1);
    await post.save();
    return { liked: false, likesCount: post.likesCount };
  }

  await Like.create({ post: postId, user: userId });
  post.likesCount = (post.likesCount || 0) + 1;
  await post.save();
  return { liked: true, likesCount: post.likesCount };
};

export const addComment = async ({ userId, postId, content }) => {
  const text = (content || "").trim();
  if (!text) return { reason: "INVALID", message: "Nội dung không được để trống." };
  if (text.length < 2) return { reason: "SHORT", message: "Nội dung quá ngắn." };
  
  const user = await User.findById(userId).select("name email avatar role");
  if (!user) return { reason: "UNAUTHORIZED" };
  const post = await Post.findById(postId);
  if (!post) return { reason: "NOT_FOUND" };

  const comment = await Comment.create({ post: postId, author: userId, content: text });
  post.commentsCount = (post.commentsCount || 0) + 1;
  await post.save();

  return {
    comment: {
      id: comment._id,
      content: comment.content,
      createdAt: comment.createdAt,
      parentId: comment.parent,
      author: { id: user._id, name: user.name || user.email, avatar: user.avatar || "", role: user.role || "" }
    },
    commentsCount: post.commentsCount,
  };
};

export const listComments = async ({ postId, page = 1, limit = 20 }) => {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    Comment.find({ post: postId, parent: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate({ path: "author", select: "name email avatar role" })
      .lean(),
    Comment.countDocuments({ post: postId })
  ]);

  return {
    items: items.map((c) => ({
      id: c._id,
      content: c.content,
      createdAt: c.createdAt,
      author: {
        id: c.author?._id,
        name: c.author?.name || c.author?.email || "Người dùng",
        avatar: c.author?.avatar || "",
        role: c.author?.role || ""
      }
    })),
    total,
    page: safePage,
    limit: safeLimit
  };
};

export const getStats = async ({ userId }) => {
  const postsCount = await Post.countDocuments({ author: userId, isActive: true });
  const commentsCount = await Comment.countDocuments({ author: userId });
  const posts = await Post.find({ author: userId }).select('_id likesCount')
  const likesCount = posts.reduce((sum, p) => sum + (p.likesCount || 0), 0);
  return { postsCount, commentsCount, likesCount };
};


