import { useCallback, useEffect, useState } from "react";
import { DEFAULT_CATEGORY, PAGE_SIZE } from "../utils/constants.js";

const API_BASE = import.meta?.env?.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
  : "http://localhost:4000";

export const useCommunity = (token) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const hasMore = page * PAGE_SIZE < total;

  const fetchPosts = useCallback(
    async ({ category = activeCategory, page: nextPage = 1, append = false } = {}) => {
      const setBusy = append ? setLoadingMore : setLoading;
      try {
        setBusy(true);
        setError("");
        const res = await fetch(
          `${API_BASE}/api/community/posts?category=${encodeURIComponent(
            category
          )}&page=${nextPage}&limit=${PAGE_SIZE}`
        );
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Không thể tải danh sách bài viết.");
        }
        const items = data.data?.items || [];
        const totalCount = data.data?.total ?? 0;
        setPosts((prev) => (append ? [...prev, ...items] : items));
        setPage(nextPage);
        setTotal(totalCount);
      } catch (err) {
        console.error(err);
        setError(err.message || "Không thể tải danh sách bài viết.");
      } finally {
        setBusy(false);
      }
    },
    [activeCategory]
  );

  useEffect(() => {
    fetchPosts({ category: activeCategory, page: 1, append: false });
  }, [activeCategory, fetchPosts]);

  const createPost = useCallback(
    async ({ title, content, category }) => {
      if (!token) {
        setError("Vui lòng đăng nhập để đăng bài.");
        return null;
      }
      if (!content?.trim()) {
        setError("Nội dung không được để trống.");
        return null;
      }
      if (!title?.trim()) {
        setError("Tiêu đề không được để trống.");
        return null;
      }
      try {
        setError("");
        const res = await fetch(`${API_BASE}/api/community/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ title, content, category })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Đăng bài thất bại.");

        setPosts((prev) => [data.data, ...prev]);
        setTotal((prev) => prev + 1);
        return data.data;
      } catch (err) {
        console.error(err);
        setError(err.message || "Đăng bài thất bại.");
        return null;
      }
    },
    [token]
  );

  const likePost = useCallback(async (postId) => {
    if (!token) { setError("Bạn cần đăng nhập để thao tác."); return; }

    // optimistic
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, liked: !p.liked, likesCount: (p.likesCount || 0) + (p.liked ? -1 : 1) }
      : p));

    try {
      const res = await fetch(`${API_BASE}/api/community/posts/${postId}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Không thể like.");
      setPosts(prev => prev.map(p => p.id === postId
        ? { ...p, liked: data.data.liked, likesCount: data.data.likesCount }
        : p));
    } catch (err) {
      console.error(err);
      setError(err.message || "Không thể like.");
      // revert
      setPosts(prev => prev.map(p => p.id === postId
        ? { ...p, liked: !p.liked, likesCount: (p.likesCount || 0) + (p.liked ? -1 : 1) }
        : p));
    }
  }, [token, setError, setPosts]);

  const fetchComments = useCallback(async (postId, page = 1, limit = 5) => {
    const res = await fetch(`${API_BASE}/api/community/posts/${postId}/comments?page=${page}&limit=${limit}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Không tải được bình luận.");
    return data.data; // { items, total, page, limit }
  }, [token]);

  const addComments = useCallback(async ({ postId, content }) => {
    if (!token) { setError("Vui lòng đăng nhập để bình luận."); return null; }
    const normalized = content.replace(/\s+/g, " ").trim();
    if (!normalized) { setError("Nội dung không được để trống."); return null; }

    try {
      const res = await fetch(`${API_BASE}/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: normalized })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Bình luận thất bại.");

      //Cập nhật đếm comment trong posts
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, commentsCount: data.data.commentsCount ?? p.commentsCount } : p))
      );
      return data.data.comment; //trả comment để prepend vào UI
    } catch (err) {
      console.error(err);
      setError(err.message || "Bình luận thất bại.");
      return null;
    }
  }, [token]);


  const fetchStats = useCallback(async () => {
    if (!token) return null;
    const res = await fetch(`${API_BASE}/api/community/posts/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Không lấy được thống kê.");
    return data.data;
  }, [token]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    return fetchPosts({ category: activeCategory, page: page + 1, append: true });
  }, [activeCategory, fetchPosts, hasMore, loadingMore, page]);

  return {
    posts,
    loading,
    loadingMore,
    error,
    activeCategory,
    setActiveCategory,
    fetchPosts,
    createPost,
    likePost,
    setError,
    hasMore,
    loadMore,
    addComments,
    fetchComments,
    fetchStats,
    page,
    total
  };
};
