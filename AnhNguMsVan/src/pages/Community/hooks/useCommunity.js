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
    async ({ content, category }) => {
      if (!token) {
        setError("Vui lòng đăng nhập để đăng bài.");
        return null;
      }
      if (!content?.trim()) {
        setError("Nội dung không được để trống.");
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
          body: JSON.stringify({ content, category })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Đăng bài thất bại.");

        // Đưa bài mới lên đầu danh sách hiện có
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
    setError,
    hasMore,
    loadMore,
    page,
    total
  };
};
