import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCommunity } from "./hooks/useCommunity.js";
import { DEFAULT_CATEGORY } from "./utils/constants.js";
import { CONTENT_MIN_LENGTH } from "./utils/validation.js";

import "./styles/Common.css";
import "./styles/CommunityLayout.css";
import { CategorySidebar, Composer, FeedHeader, PostCard, StatsPanel } from "./components";

const CommunityPage = () => {
  const { user, token } = useAuth();

  const {
    posts,
    loading,
    error,
    activeCategory,
    setActiveCategory,
    createPost,
    likePost,
    addComments,
    fetchComments,
    fetchStats,
    setError,
    hasMore,
    loadMore
  } = useCommunity(token);

  const [draftContent, setDraftContent] = useState("");
  const [composerKey, setComposerKey] = useState(0);
  const [composerCategory, setComposerCategory] = useState(DEFAULT_CATEGORY);
  const [isPosting, setIsPosting] = useState(false);
  const [toast, setToast] = useState("");
  const sentinelRef = useRef(null);
  const isFetchingRef = useRef(false);
  const toastTimerRef = useRef(null);
  const errorTimerRef = useRef(null);

  useEffect(() => {
    isFetchingRef.current = false;
  }, [activeCategory]);

  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current = setTimeout(() => setToast(""), 2500);
  };

  const showError = (msg) => {
    setError(msg);
  };

  useEffect(() => {
    if (!error) {
      clearTimeout(errorTimerRef.current);
    }

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setError("");
    }, 3000);

    return () => {
      clearTimeout(errorTimerRef.current);
    };
  }, [error, setError]);

  useEffect(() => {
    return () => {
      clearTimeout(toastTimerRef.current);
      clearTimeout(errorTimerRef.current);
    };
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      showError("Vui lòng đăng nhập để đăng bài.");
      return;
    }
    if (isPosting) return;
    const normalizedContent = draftContent.replace(/\s+/g, " ").trim();

    if (!normalizedContent) {
      showError("Nội dung không được để trống.");
      return;
    }
    if (normalizedContent.length < CONTENT_MIN_LENGTH) {
      showError(`Nội dung cần ít nhất ${CONTENT_MIN_LENGTH} ký tự.`);
      return;
    }

    setIsPosting(true);
    try {
      const created = await createPost({
        content: normalizedContent,
        category: composerCategory || DEFAULT_CATEGORY
      });

      if (created) {
        setDraftContent("");
        setComposerKey((k) => k + 1); // remount composer -> close
        showToast("Đã đăng bài.");
        setActiveCategory(composerCategory);
      }
    } catch (err) {
      showError("Đăng bài thất bại,hãy đăng nhập để đăng bài.");
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isFetchingRef.current) {
          isFetchingRef.current = true;
          Promise.resolve(loadMore()).finally(() => {
            isFetchingRef.current = false;
          });
        }
      },
      { root: null, rootMargin: "0px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore, activeCategory]);

  return (
    <>
      <Header />
      {toast && <div className="toast success">{toast}</div>}
      {error && <div className="toast error">{error}</div>}

      <div className="community-page light">
        <CategorySidebar activeCategory={activeCategory} onSelect={setActiveCategory} />

        <main className="community-main">
          <Composer
            key={composerKey}
            user={user}
            draftContent={draftContent}
            onChange={setDraftContent}
            CONTENT_MIN_LENGTH={CONTENT_MIN_LENGTH}
            onSubmit={handleSubmit}
            onCategoryChange={setComposerCategory}
            activeCategory={composerCategory}
            error={error}
            isPosting={isPosting}
          />

          <FeedHeader />

          <section className="feed">
            {loading && <div className="inline-hint">Đang tải...</div>}
            {!loading && posts.length === 0 && <div className="inline-hint">Chưa có bài viết nào.</div>}

            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={likePost}
                addComments={addComments}
                fetchComments={fetchComments}
              />
            ))}

            {hasMore && <div ref={sentinelRef} className="feed-sentinel" aria-hidden="true" />}
          </section>
        </main>

        <StatsPanel fetchStats={fetchStats} />
      </div>

      <Footer />
    </>
  );
};

export default CommunityPage;
