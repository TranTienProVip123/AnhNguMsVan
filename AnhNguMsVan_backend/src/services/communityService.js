import Post from '../models/Post.js';
import User from '../models/User.js';

const DEFAULT_CATEGORY = 'Tất cả';

export const createPost = async ({ userId, title, content, category }) => {
  const trimmedContent = (content || '').trim();
  if (!trimmedContent) {
    return { reason: 'INVALID', message: 'Nội dung không được để trống' };
  }

  const user = await User.findById(userId).select('name email avatar');
  if (!user) return { reason: 'UNAUTHORIZED' };

  const post = await Post.create({
    title: (title || '').trim(),
    content: trimmedContent,
    category: category || DEFAULT_CATEGORY,
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
        avatar: user.avatar || ''
      }
    }
  };
};

export const listPosts = async ({ category, page = 1, limit = 5 }) => {
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
      .populate({ path: 'author', select: 'name email avatar' })
      .lean(),
    Post.countDocuments(filter)
  ]);

  const items = posts.map((p) => ({
    id: p._id,
    title: p.title,
    content: p.content,
    category: p.category,
    createdAt: p.createdAt,
    likesCount: p.likesCount || 0,
    commentsCount: p.commentsCount || 0,
    author: {
      id: p.author?._id,
      name: p.author?.name || p.author?.email || 'Người đăng',
      avatar: p.author?.avatar || ''
    }
  }));

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit
  };
};
