import React, { useState, useRef, useEffect } from "react";
import "./StudentGallery.css";

const StudentGallery = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentFeedbackSlideIndex, setCurrentFeedbackSlideIndex] = useState(0);

  const thumbnailsRef = useRef(null);

  const galleryItems = [
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763631049/1_ru2hof.jpg",
    },
    {
      type: "video",
      url: "https://res.cloudinary.com/da6gk23w6/video/upload/v1763631074/4_uvaxxy.mp4",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763631055/2_ctjbrr.jpg",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763631057/3_umlvwn.jpg",
    },
    {
      type: "video",
      url: "https://res.cloudinary.com/da6gk23w6/video/upload/v1763633743/7216566701638_yesdyg.mp4",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763632285/8_lpodz5.jpg",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763631177/5_cjftgu.jpg",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763631179/6_jzrceq.jpg",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763631187/7_prk1cc.jpg",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763632286/9_y5tyzd.jpg",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763632291/11_w70z6l.jpg",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763632293/12_wnnxen.jpg",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763632295/13_vailmr.jpg",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763632298/14_ynbahf.jpg",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763632299/15_fx0mlw.jpg",
    },
    {
      type: "image",
      url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763632303/16_c52xje.jpg",
    },
  ];

  const feedbackItems = [
    {
        type: "image",
        url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763695579/4_o5jioy.jpg",
        
    },
    {
        type: "image",
        url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763695582/7_aztw0t.jpg", 
    },
    {
        type: "image",
        url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763695579/2_mebkij.jpg",
    },
    {
        type: "image",
        url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763695580/6_onzxkm.jpg",
    },
    {
        type: "image",
        url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763695579/5_ixc8xg.jpg",
    },
    {
        type: "image",
        url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763695579/8_kfs2gb.jpg",
    },
    {
        type: "image",
        url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763695580/3_c8bas2.jpg", 
    },
    {
        type: "image",
        url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763695580/1_vsuuah.jpg",
    },
    {
        type: "image",
        url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763716378/9_lf83fx.jpg",
    },
    {
        type: "image",
        url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763716376/10_gijelt.jpg",
    },
    {
        type: "image",
        url: "https://res.cloudinary.com/da6gk23w6/image/upload/v1763716376/11_wpxqjx.jpg",
    },
  ]

  // Gộp tất cả items vào một mảng
  const allItems = [...galleryItems, ...feedbackItems];

  const ITEMS_PER_PAGE = 6;
  const FEEDBACK_ITEMS_PER_PAGE = 4;

  const totalPages = Math.ceil(galleryItems.length / ITEMS_PER_PAGE);
  const totalFeedbackPages = Math.ceil(feedbackItems.length / FEEDBACK_ITEMS_PER_PAGE);

  const getCurrentItems = () => {
    const startIndex = currentSlideIndex * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return galleryItems.slice(startIndex, endIndex);
  };

  const getCurrentFeedbackItems = () => {
    const startIndex = currentFeedbackSlideIndex * FEEDBACK_ITEMS_PER_PAGE;
    const endIndex = startIndex + FEEDBACK_ITEMS_PER_PAGE;
    return feedbackItems.slice(startIndex, endIndex);
  };

  // Auto scroll to active thumbnail
  useEffect(() => {
    if (isGalleryOpen && thumbnailsRef.current) {
      const thumbnailItems = thumbnailsRef.current.children;
      const activeThumbnail = thumbnailItems[currentGalleryIndex];
      
      if (activeThumbnail) {
        const containerWidth = thumbnailsRef.current.offsetWidth;
        const thumbnailLeft = activeThumbnail.offsetLeft;
        const thumbnailWidth = activeThumbnail.offsetWidth;
        
        // Tính toán vị trí scroll để thumbnail active ở giữa màn hình
        const scrollPosition = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        
        thumbnailsRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [currentGalleryIndex, isGalleryOpen]);

  // Handle ESC key and prevent body scroll
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isGalleryOpen) {
        handleCloseGallery();
      }
    };

    const handleArrowKeys = (e) => {
      if (isGalleryOpen) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevGallery(e);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextGallery(e);
        }
      }
    };

    if (isGalleryOpen) {
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden';
      
      // Add event listeners
      document.addEventListener('keydown', handleEscKey);
      document.addEventListener('keydown', handleArrowKeys);
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('keydown', handleArrowKeys);
    };
  }, [isGalleryOpen, currentGalleryIndex, allItems.length]);

  const handleGalleryItemClick = (index) => {
    const actualIndex = currentSlideIndex * ITEMS_PER_PAGE + index;
    setCurrentGalleryIndex(actualIndex);
    setIsGalleryOpen(true);
  };

  const handleFeedbackItemClick = (index) => {
    const actualIndex = currentFeedbackSlideIndex * FEEDBACK_ITEMS_PER_PAGE + index;
    // Cộng thêm số lượng student items để lấy đúng index trong allItems
    const globalIndex = galleryItems.length + actualIndex;
    setCurrentGalleryIndex(globalIndex);
    setIsGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
  };

  const handlePrevGallery = (e) => {
    e.stopPropagation();
    setCurrentGalleryIndex((prev) =>
      prev === 0 ? allItems.length - 1 : prev - 1
    );
  };

  const handleNextGallery = (e) => {
    e.stopPropagation();
    setCurrentGalleryIndex((prev) =>
      prev === allItems.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentGalleryIndex(index);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const handlePrevFeedbackSlide = () => {
    setCurrentFeedbackSlideIndex((prev) => (prev === 0 ? totalFeedbackPages - 1 : prev - 1));
  };

  const handleNextFeedbackSlide = () => {
    setCurrentFeedbackSlideIndex((prev) => (prev === totalFeedbackPages - 1 ? 0 : prev + 1));
  };

  // Handle click outside - only close if clicking on the backdrop
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('gallery-lightbox')) {
      handleCloseGallery();
    }
  };

  return (
    <>
      {/* Student Gallery Section with Carousel */}
      <div className="student-gallery">
        <div className="gallery-header">
          <h2>MÌNH ĐÃ CÓ HƠN 100 HỌC VIÊN</h2>
          <p>Một số kỷ niệm mà mình đã lưu lại.</p>
        </div>

        <div className="gallery-carousel-container">
          <button
            className="carousel-nav-btn prev"
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
          >
            ❮
          </button>

          <div className="gallery-grid">
            {getCurrentItems().map((item, index) => (
              <div
                key={index}
                className="gallery-item"
                onClick={() => handleGalleryItemClick(index)}
              >
                {item.type === "image" ? (
                  <img src={item.url} alt={`Học viên ${index + 1}`} />
                ) : (
                  <div className="video-thumbnail">
                    <video src={item.url} />
                    <div className="play-icon">▶</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="carousel-nav-btn next"
            onClick={handleNextSlide}
            disabled={currentSlideIndex === totalPages - 1}
          >
            ❯
          </button>
        </div>
      </div>

      {/* Student Feedback Section */}
      <div className="student-feedback">
        <div className="feedback-header">
          <h2>PHẢN HỒI TỪ HỌC VIÊN</h2>
          <p>Những chia sẻ chân thành từ các bạn học viên.</p>
        </div>

        <div className="feedback-carousel-container">
          <button
            className="carousel-nav-btn prev"
            onClick={handlePrevFeedbackSlide}
            disabled={currentFeedbackSlideIndex === 0}
          >
            ❮
          </button>

          <div className="feedback-grid">
            {getCurrentFeedbackItems().map((item, index) => (
              <div
                key={index}
                className="feedback-item"
                onClick={() => handleFeedbackItemClick(index)}
              >
                <img src={item.url} alt={`Phản hồi ${index + 1}`} />
              </div>
            ))}
          </div>

          <button
            className="carousel-nav-btn next"
            onClick={handleNextFeedbackSlide}
            disabled={currentFeedbackSlideIndex === totalFeedbackPages - 1}
          >
            ❯
          </button>
        </div>
      </div>

      {/* Gallery Lightbox Modal */}
      {isGalleryOpen && (
        <div className="gallery-lightbox" onClick={handleBackdropClick}>
          <button className="lightbox-close" onClick={handleCloseGallery}>
            ✕
          </button>

          <button className="lightbox-nav prev" onClick={handlePrevGallery}>
            ❮
          </button>
          <button className="lightbox-nav next" onClick={handleNextGallery}>
            ❯
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {allItems[currentGalleryIndex].type === "image" ? (
              <img
                src={allItems[currentGalleryIndex].url}
                alt={`Gallery ${currentGalleryIndex + 1}`}
                className="lightbox-main-image"
              />
            ) : (
              <video
                src={allItems[currentGalleryIndex].url}
                controls
                autoPlay
                className="lightbox-main-video"
              />
            )}

            {/* Thumbnail strip - Hiển thị tất cả ảnh */}
            <div className="lightbox-thumbnails" ref={thumbnailsRef}>
              {allItems.map((item, index) => (
                <div
                  key={index}
                  className={`thumbnail-item ${
                    index === currentGalleryIndex ? "active" : ""
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  {item.type === "image" ? (
                    <img src={item.url} alt={`Thumbnail ${index + 1}`} />
                  ) : (
                    <div className="thumbnail-video">
                      <video src={item.url} />
                      <div className="thumbnail-play-icon">▶</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="lightbox-counter">
              {currentGalleryIndex + 1} / {allItems.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentGallery;