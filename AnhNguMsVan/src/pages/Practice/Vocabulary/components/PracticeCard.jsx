import React, { memo, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext.jsx";

const PracticeCard = memo(
  ({
    word,
    wordIndex,
    totalWords,
    userAnswer,
    setUserAnswer,
    showAnswer,
    isCorrect,
    correctAnswer,
    onCheckAnswer,
    onDontKnow,
    onNext,
    isAdmin,
    onEditWord,
    onDeleteWord,
  }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const courseId = queryParams.get('courseId');
    const topicId = queryParams.get('topicId');
    
    const { user, token } = useAuth();
    const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
    const navigate = useNavigate();
    const [showAuthBanner, setShowAuthBanner] = useState(false);
    // Existing hooks
    const [revealedHints, setRevealedHints] = useState(new Set());
    const [hintCount, setHintCount] = useState(0);
    // NEW: Flip state - chỉ lật nội dung
    const [isFlipped, setIsFlipped] = useState(false);
    const audioRefUS = useRef(null);
    const audioRefUK = useRef(null);

    // NEW: State cho progress
    const [topicProgress, setTopicProgress] = useState({
      totalWordsLearned: 0,
      totalWordsInTopic: 0,
      completionRate: 0
    });

    const wordChars = useMemo(() => {
      if (!correctAnswer?.english) return [];
      return correctAnswer.english.split("");
    }, [correctAnswer?.english]);

    // Dòng 50-70: UPDATED - Fetch topic progress khi mount
    useEffect(() => {
      const fetchTopicProgress = async () => {
        if (!user || !token || !courseId || !topicId) return;

        try {
          const response = await fetch(
            `${API_BASE_URL}/api/progress/topic/${topicId}?courseId=${courseId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );

          const data = await response.json();
          if (data.success) {
            setTopicProgress(data.data);
          }
        } catch (error) {
          console.error('Fetch progress failed:', error);
        }
      };

      fetchTopicProgress();
    }, [user, token, courseId, topicId]);

    const displayChars = useMemo(() => {
      return wordChars.map((char, index) => {
        if (revealedHints.has(index)) {
          return char;
        }
        return char === " " ? " " : "*";
      });
    }, [wordChars, revealedHints]);

    useEffect(() => {
      setRevealedHints(new Set());
      setHintCount(0);
      setIsFlipped(false); // Reset flip khi chuyển từ mới
    }, [word?._id]);

    const handleHintClick = () => {
      if (hintCount >= 3) {
        // lần thứ 4: phát âm
        playPronunciation("US");
        return;
      }

      const availableIndexes = wordChars
        .map((char, index) =>
          char !== " " && !revealedHints.has(index) ? index : null
        )
        .filter((index) => index !== null);

      if (availableIndexes.length === 0) {
        alert("Đã hiện hết tất cả ký tự!");
        return;
      }

      const randomIndex =
        availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
      setRevealedHints((prev) => new Set([...prev, randomIndex]));
      setHintCount((prev) => prev + 1);
    };

    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !showAnswer) {
        handleCheckAnswer();
      }
    };

    const handleDelete = () => {
      if (
        window.confirm(
          `Bạn có chắc muốn xóa từ "${word.vietnamese}" (${word.english})?`
        )
      ) {
        onDeleteWord(word);
      }
    };

    const handleCheckAuth = () => {
      if (!user) {
        setShowAuthBanner(true);
        setTimeout(() => setShowAuthBanner(false), 8000);
        return false; // ← Return false để caller biết chưa login
      }
      setShowAuthBanner(false);
      return true; // ← Return true để caller biết đã login
    };

    // UPDATED: Handle "Không biết" - Gọi onDontKnow và flip card
    const handleDontKnow = () => {
      // Kiểm tra auth
      if(!handleCheckAuth()) {
        return;
      } 

      onDontKnow(); // Gọi callback từ parent để set showAnswer = true
      handleViewDetail(); // Auto flip để xem chi tiết
    };

    const handleCheckAnswer = async () => {
      // Kiểm tra auth trước
      if (!handleCheckAuth()) {
        return; // Dừng lại nếu chưa login
      }

      // Kiểm tra đáp án
      const normalizedUserAnswer = userAnswer.trim().toLowerCase();
      const normalizedCorrectAnswer = word.english.trim().toLowerCase();

      if (normalizedUserAnswer === normalizedCorrectAnswer) {
        // Đúng: Flip và gọi onCheckAnswer
        onCheckAnswer();
        handleViewDetail();
      // Save progress to backend
        if (user && token && courseId && topicId) {
          try {
            const response = await fetch(`${API_BASE_URL}/api/progress/word`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                courseId,
                topicId,
                wordId: word._id,
                isCorrect: true
              })
            });

            const data = await response.json();
            if (data.success) {
              // Update local progress
              setTopicProgress(data.data);
            }
          } catch (error) {
            console.error('Save progress failed:', error);
          }
        }
      } else {
        // Sai: Chỉ báo lỗi, không flip, cho phép nhập lại
        // Thêm class shake để hiệu ứng rung
        const inputElement = document.querySelector(
          ".answer-input-group input"
        );
        if (inputElement) {
          inputElement.classList.add("shake-error");
          setTimeout(() => {
            inputElement.classList.remove("shake-error");
          }, 500);
        }
      }
    };

    // NEW: Handle flip - Lật nội dung
    const handleViewDetail = () => {
      setIsFlipped(true);
      // Auto play US pronunciation
      setTimeout(() => {
        playPronunciation("US");
      }, 300);
    };

    // Helper function: Lấy loại từ tiếng Việt
    const getVietnameseWordType = (type) => {
      const typeMap = {
        noun: "Danh từ",
        verb: "Động từ",
        adjective: "Tính từ",
        adverb: "Trạng từ",
        other: "Khác",
      };
      return typeMap[type] || "Danh từ";
    };

    // Helper function: Lấy loại từ tiếng Anh
    const getEnglishWordType = (type) => {
      const typeMap = {
        noun: "Noun",
        verb: "Verb",
        adjective: "Adjective",
        adverb: "Adverb",
        other: "Other",
      };
      return typeMap[type] || "Noun";
    };

    // NEW: Handle pronunciation
    const playPronunciation = (accent) => {
      // Kiểm tra browser support
      if (!("speechSynthesis" in window)) {
        console.error("Browser không hỗ trợ Text-to-Speech");
        alert("Trình duyệt của bạn không hỗ trợ phát âm");
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word.english);

      // Chọn giọng theo accent
      const voices = window.speechSynthesis.getVoices();

      if (accent === "US") {
        // Tìm giọng US
        const usVoice = voices.find(
          (voice) =>
            voice.lang === "en-US" ||
            voice.name.includes("US") ||
            voice.name.includes("United States")
        );
        if (usVoice) {
          utterance.voice = usVoice;
        }
        utterance.lang = "en-US";
      } else {
        // Tìm giọng UK
        const ukVoice = voices.find(
          (voice) =>
            voice.lang === "en-GB" ||
            voice.name.includes("UK") ||
            voice.name.includes("British")
        );
        if (ukVoice) {
          utterance.voice = ukVoice;
        }
        utterance.lang = "en-GB";
      }

      utterance.rate = 0.8; // Tốc độ nói (0.8 = 80% speed)
      utterance.pitch = 1; // Cao độ giọng nói
      utterance.volume = 1; // Âm lượng

      window.speechSynthesis.speak(utterance);
    };

    // Preload voices khi component mount
    useEffect(() => {
      if ("speechSynthesis" in window) {
        // Load voices
        window.speechSynthesis.getVoices();

        // Lắng nghe event voices changed
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }, []);

    if (!word) return null;

    return (
      <div className="practice-content">
        {/* Image Container */}
        <div className="word-image-container">
          <img
            src={word.image}
            alt={word.english}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Info Panel with Flip Content */}
        <div className="word-info">
          {/* Header with Admin Actions */}
          <div className="word-header">
            {/* Title with Flip Animation */}
            <div
              className={`word-title-container ${isFlipped ? "flipped" : ""}`}
            >
              {/* FRONT - Tiếng Việt */}
              <div className="word-title-front-wrapper">
                <h3 className="word-title word-title-front">
                  {word.vietnamese}
                </h3>
                <p className="word-type word-type-front">
                  {getVietnameseWordType(word.wordType)}
                </p>
              </div>

              {/* BACK - Tiếng Anh */}
              <div className="word-title-back-wrapper">
                <h3 className="word-title word-title-back">{word.english}</h3>
                <p className="word-type word-type-back">
                  {getEnglishWordType(word.wordType)}
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="word-actions">
                <button
                  className="edit-word-btn"
                  onClick={() => onEditWord(word)}
                  type="button"
                  title="Sửa từ vựng"
                >
                  ✏️
                </button>
                <button
                  className="delete-word-btn"
                  onClick={handleDelete}
                  type="button"
                  title="Xóa từ vựng"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>

          {/* Phonetics - Hiển thị khi đã flip */}
          {isFlipped && (
            <div className="phonetics-section">
              <div className="phonetic-row">
                <div className="phonetic-item">
                  <span className="phonetic-label">US</span>
                  <button
                    className="audio-btn"
                    onClick={() => playPronunciation("US")}
                    type="button"
                    title="Phát âm US"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="black"
                    >
                      <path d="M3 10v4h4l5 5V5L7 10H3z" />
                      <path d="M16.5 12c0-2.49-1.51-4.6-3.5-5.5v11c1.99-.9 3.5-3.01 3.5-5.5z" />
                      <path d="M19 12c0 3.86-2.2 7.16-5.33 8.65v-2.02c2.38-1.23 4.03-3.66 4.03-6.63s-1.65-5.4-4.03-6.63V3.35C16.8 4.84 19 8.14 19 12z" />
                    </svg>
                  </button>
                  <span className="phonetic-text">
                    /{word.phoneticUS || word.english}/
                  </span>

                  <span className="phonetic-label">UK</span>
                  <button
                    className="audio-btn"
                    onClick={() => playPronunciation("UK")}
                    type="button"
                    title="Phát âm UK"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="black"
                    >
                      <path d="M3 10v4h4l5 5V5L7 10H3z" />
                      <path d="M16.5 12c0-2.49-1.51-4.6-3.5-5.5v11c1.99-.9 3.5-3.01 3.5-5.5z" />
                      <path d="M19 12c0 3.86-2.2 7.16-5.33 8.65v-2.02c2.38-1.23 4.03-3.66 4.03-6.63s-1.65-5.4-4.03-6.63V3.35C16.8 4.84 19 8.14 19 12z" />
                    </svg>
                  </button>
                  <span className="phonetic-text">
                    /{word.phoneticUK || word.english}/
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Definitions */}
          <div className="word-definitions">
            {word.definition && (
              <p className="definition-en">
                <strong>Định nghĩa tiếng Anh:</strong> {word.definition}
              </p>
            )}
            {word.meaning && (
              <p className="definition-vn">
                <strong>Định nghĩa tiếng Việt:</strong> {word.meaning}
              </p>
            )}
            {word.example && (
              <p className="example-en">
                <strong>Ví dụ tiếng Anh:</strong> {word.example}
              </p>
            )}
            {word.exampleVN && (
              <p className="example-vn">
                <strong>Ví dụ tiếng Việt:</strong> {word.exampleVN}
              </p>
            )}
          </div>
          
          {/* UPDATED: Hint System - Ẩn khi showAnswer = true */}
          {!showAnswer && (
            <div className="hint-section">
              <div className="hint-display">
                {displayChars.map((char, index) => (
                  <span
                    key={index}
                    className={`hint-char ${
                      char !== "*" && char !== " " ? "revealed" : ""
                    } ${char === " " ? "space" : ""}`}
                  >
                    {char}
                  </span>
                ))}
              </div>

              <button
                className={`hint-btn ${hintCount >= 3 ? "hint-btn-audio" : ""}`}
                onClick={handleHintClick}
                type="button"
              >
                <span className="hint-icon">
                  {hintCount >= 3 ? "🔊" : "💡"}
                </span>
                {hintCount >= 3 ? "Phát âm" : "Gợi ý"}
              </button>
            </div>
          )}

          {/* UPDATED: Answer Section - Ẩn khi showAnswer = true */}
          {!showAnswer && (
            <div className="answer-section">
              {/* NEW: Auth Banner */}
              {showAuthBanner && (
                <div className="auth-banner">
                  <div className="auth-banner-content">
                    <span className="auth-banner-icon">🔒</span>
                    <div className="auth-banner-text">
                      <strong>Yêu cầu đăng nhập</strong>
                      <p>
                        Bạn cần đăng nhập để kiểm tra đáp án và lưu tiến độ học.
                      </p>
                    </div>
                    <button
                      className="auth-banner-login-btn"
                      onClick={() => navigate("/login")}
                      type="button"
                    >
                      Đăng nhập ngay
                    </button>
                    <button
                      className="auth-banner-close"
                      onClick={() => setShowAuthBanner(false)}
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="answer-input-group">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập từ tiếng Anh"
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  className="btn-dont-know"
                  onClick={handleDontKnow}
                  type="button"
                >
                  <span>🤷</span>
                  Không biết
                </button>
                <button
                  className="btn-check"
                  onClick={handleCheckAnswer}
                  type="button"
                >
                  <span>🔍</span>
                  Kiểm tra đáp án
                </button>
              </div>
            </div>
          )}

          {/* Feedback & Next Button - Chỉ hiện khi đã trả lời */}
          {showAnswer && isFlipped && (
            <div className="answer-result-section">
              <div className="answer-feedback correct">
                {correctAnswer.english}
              </div>

              <div className="action-buttons">
                {/* {!isFlipped && (
                  <button
                    className="btn-view-detail"
                    onClick={handleViewDetail}
                    type="button"
                  >
                    <span>📖</span>
                    Xem chi tiết
                  </button>
                )} */}
                <button className="btn-next" onClick={onNext} type="button">
                  Tiếp theo →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

PracticeCard.displayName = "PracticeCard";

export default PracticeCard;
