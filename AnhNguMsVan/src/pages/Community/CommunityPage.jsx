import React, { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCommunity } from "./hooks/useCommunity.js";
import { DEFAULT_CATEGORY, PAGE_SIZE } from "./utils/constants.js";

import "./CommunityPage.css";
import { CategorySidebar, Composer, FeedHeader, PostCard, StatsPanel } from "./components";

const CommunityPage = () => {
  const { user, token } = useAuth();

  const {
    posts,
    loading,
    loadingMore,
    error,
    activeCategory,
    setActiveCategory,
    createPost,
    setError,
    hasMore,
    loadMore
  } = useCommunity(token);

  const [draftContent, setDraftContent] = useState("");

  const handleSubmit = async () => {
    if (!draftContent.trim()) {
      setError("Nội dung không được để trống.");
      return;
    }

    const created = await createPost({
      content: draftContent,
      category: activeCategory || DEFAULT_CATEGORY
    });

    if (created) {
      setDraftContent("");
    }
  };

  return (
    <>
      <Header />

      <div className="community-page light">
        <CategorySidebar activeCategory={activeCategory} onSelect={setActiveCategory} />

        <main className="community-main">
          <Composer
            user={user}
            draftContent={draftContent}
            onChange={setDraftContent}
            onSubmit={handleSubmit}
            onCategoryChange={setActiveCategory}
            activeCategory={activeCategory}
            error={error}
          />

          <FeedHeader />

          <div className="feed-note">
            Hiển thị {PAGE_SIZE} bài mỗi lượt. Nhấn xem thêm để xem các bài viết cũ.
          </div>

          <section className="feed">
            {loading && <div className="inline-hint">Đang tải...</div>}
            {!loading && posts.length === 0 && (
              <div className="inline-hint">Chưa có bài viết nào.</div>
            )}

            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {hasMore && (
              <div className="load-more">
                <button className="primary" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? "Đang tải..." : "Xem thêm"}
                </button>
              </div>
            )}
          </section>
        </main>

        <StatsPanel />
      </div>

      <Footer />
    </>
  );
};

export default CommunityPage;
