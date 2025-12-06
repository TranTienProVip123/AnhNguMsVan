import React, { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/Header/Header.jsx";
import PracticeCard from "./components/PracticeCard.jsx";
import TopicList from "./components/TopicList.jsx";
import {
  LoadingState,
  LoadingTopicDetail,
  NoTopicsState,
} from "./components/LoadingStates.jsx";
import { useTopics } from "./hooks/useTopics.js";
import { useWordNavigation } from "./hooks/useWordNavigation.js";
import "./Vocabulary.css";

// Lazy load modals - chỉ load khi cần
const AddTopicModal = lazy(() => import("./components/modals/AddTopicModal.jsx"));
const EditTopicModal = lazy(() => import("./components/modals/EditTopicModal.jsx"));
const AddWordModal = lazy(() => import("./components/modals/AddWordModal.jsx"));
const EditWordModal = lazy(() => import("./components/modals/EditWordModal.jsx"));

const Vocabulary = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const courseId = queryParams.get('courseId');
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [openMenuId, setOpenMenuId] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  // state - component cha quản lý
  const [topicsProgress, setTopicsProgress] = useState({});

  // Modals state
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [isEditTopicModalOpen, setIsEditTopicModalOpen] = useState(false);
  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false);
  const [isEditWordModalOpen, setIsEditWordModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [selectedTopicForWord, setSelectedTopicForWord] = useState(null);
  const [editingWord, setEditingWord] = useState(null);

  const isAdmin = user?.role === "admin";

  // Custom hooks
  const {
    topics,
    selectedTopic,
    isLoading,
    error,
    fetchTopicDetail,
    addTopic,
    updateTopic,
    deleteTopic,
    addWordToTopic,
    updateWord,
    deleteWord,
  } = useTopics(token, courseId);

  const {
    currentWordIndex,
    userAnswer,
    showAnswer,
    isCorrect,
    setUserAnswer,
    handleCheckAnswer,
    handleDontKnow,
    handleNextWord,
    resetWordState,
    setCurrentWordIndex,
  } = useWordNavigation(selectedTopic, currentTopicIndex, topics);

  // Auto load topic đầu tiên khi có topics
  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      fetchTopicDetail(topics[0].id);
    }
  }, [topics, selectedTopic, fetchTopicDetail]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openMenuId]);

  // Topic handlers
  // Vocabulary.jsx - Thêm console.log để debug
  const handleTopicClick = useCallback(
    (topicIndex) => {
      const topic = topics[topicIndex];
      
      console.log('📌 Topic clicked:', {
        index: topicIndex,
        topic: topic,
        topicId: topic.id || topic._id,
        courseId: courseId
      });

      setCurrentTopicIndex(topicIndex);
      resetWordState();
      fetchTopicDetail(topic.id);
    },
    [topics, resetWordState, fetchTopicDetail, courseId]
  );

  const toggleMenu = useCallback((e, topicId) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === topicId ? null : topicId));
  }, []);

  const openAddWordModal = useCallback((e, topic) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setSelectedTopicForWord(topic);
    setIsAddWordModalOpen(true);
  }, []);

  const openEditTopicModal = useCallback((e, topic) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setEditingTopic(topic);
    setIsEditTopicModalOpen(true);
  }, []);

  const handleDeleteFromMenu = useCallback(
    async (e, topicId) => {
      e.stopPropagation();
      setOpenMenuId(null);

      if (!window.confirm("Bạn có chắc muốn xóa chủ đề này?")) return;

      const result = await deleteTopic(topicId);
      if (result.success) {
        alert("Xóa chủ đề thành công!");
        // Điều chỉnh currentTopicIndex nếu cần
        if (currentTopicIndex >= topics.length - 1) {
          setCurrentTopicIndex(Math.max(0, topics.length - 2));
        }
      } else {
        alert(result.message || "Có lỗi xảy ra");
      }
    },
    [deleteTopic, currentTopicIndex, topics.length]
  );

  // handler cho edit word
  const handleEditWord = useCallback((word) => {
    setEditingWord(word);
    setIsEditWordModalOpen(true);
  }, []);

  // ← Thêm handler cho delete word
  const handleDeleteWord = useCallback(
    async (word) => {
      if (!selectedTopic?.id || !word._id) {
        alert("Lỗi: Không xác định được từ vựng cần xóa");
        return;
      }

      const result = await deleteWord(selectedTopic.id, word._id);

      if (result.success) {
        alert("Xóa từ vựng thành công!");

        // Điều chỉnh currentWordIndex nếu cần
        const totalWords = selectedTopic.words.length;
        if (totalWords === 1) {
          // Nếu xóa từ cuối cùng, quay lại danh sách topic
          alert("Đã xóa hết từ vựng trong chủ đề này");
          resetWordState();
        } else if (currentWordIndex >= totalWords - 1) {
          // Nếu đang ở từ cuối, quay về từ trước đó
          setCurrentWordIndex(Math.max(0, totalWords - 2));
        }
        // Nếu không phải từ cuối, giữ nguyên index (sẽ hiển thị từ tiếp theo)
      } else {
        alert(result.message || "Có lỗi xảy ra khi xóa từ vựng");
      }
    },
    [
      selectedTopic,
      deleteWord,
      currentWordIndex,
      resetWordState,
      setCurrentWordIndex,
    ]
  );

  const handleNext = useCallback(() => {
    const result = handleNextWord();

    if (result.nextTopic) {
      setCurrentTopicIndex(result.nextTopicIndex);
      resetWordState();
      fetchTopicDetail(topics[result.nextTopicIndex].id);
    } else if (result.completed) {
      alert("🎉 Chúc mừng! Bạn đã hoàn thành tất cả các từ!");
    }
  }, [handleNextWord, resetWordState, fetchTopicDetail, topics]);

  // Fetch course progress khi component mount
  useEffect(() => {
    const fetchCourseProgress = async () => {
      if (!user || !token || !courseId) return;

      try {
        // console.log('📊 Fetching course progress...');
        const response = await fetch(
          `${API_BASE_URL}/api/progress/course/${courseId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const data = await response.json();
        // console.log('📊 Course progress response:', data);

        if (data.success && data.data.topics) {
          // Convert array to map: topicId -> progress
          const progressMap = {};
          data.data.topics.forEach(tp => {
            progressMap[tp.topicId.toString()] = {
              totalWordsLearned: tp.totalWordsLearned,
              totalWordsInTopic: tp.totalWordsInTopic,
              completionRate: tp.completionRate,
              status: tp.status
            };
          });
          
          // console.log('📊 Progress map:', progressMap);
          setTopicsProgress(progressMap);
        }
      } catch (error) {
        console.error('❌ Fetch course progress failed:', error);
      }
    };

    fetchCourseProgress();
  }, [user, token, courseId, API_BASE_URL]);

  // ✅ CALLBACK để update progress từ PracticeCard
  const handleProgressUpdate = useCallback((topicId, newProgress) => {
    
    setTopicsProgress(prev => {
      const updated = {
        ...prev,
        [topicId.toString()]: {
          totalWordsLearned: newProgress.totalWordsLearned,
          totalWordsInTopic: newProgress.totalWordsInTopic,
          completionRate: newProgress.completionRate,
          status: newProgress.status
        }
      };
      
      return updated;
    });
  }, []);
  // Handle error state
  if (error) {
    return (
      <>
        <Header />
        <div className="vocabulary-page">
          <div className="error-container">
            <p className="error-message">❌ {error}</p>
            <button
              className="btn-retry"
              onClick={() => window.location.reload()}
            >
              🔄 Thử lại
            </button>
          </div>
        </div>
      </>
    );
  }

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // No topics
  if (!topics.length) {
    return (
      <>
        <Header />
        <div className="vocabulary-page">
          <NoTopicsState 
            isAdmin={isAdmin}
            onAddTopicClick={() => setIsAddTopicModalOpen(true)}
          />
        </div>
        <Suspense fallback={null}>
          {isAddTopicModalOpen && (
            <AddTopicModal
              isOpen={isAddTopicModalOpen}
              onClose={() => setIsAddTopicModalOpen(false)}
              onSubmit={addTopic}
            />
          )}
        </Suspense>
      </>
    );
  }

  // Loading topic detail
  if (!selectedTopic) {
    return <LoadingTopicDetail />;
  }

  const currentWord = selectedTopic.words[currentWordIndex];
  const totalWordsInTopic = selectedTopic.words.length;

  return (
    <>
      <Header />
      <div className="vocabulary-page">
        <h1>1000 từ tiếng Anh thông dụng</h1>
        <div className="vocabulary-container">
          {/* Practice Panel */}
          <div className="practice-panel">
            <div className="practice-header">
              <h2 className="topic-name">Chủ đề: {selectedTopic.name}</h2>
              <div className="word-counter">
                câu {currentWordIndex + 1}/{totalWordsInTopic}
              </div>
            </div>

            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${
                    ((currentWordIndex + 1) / totalWordsInTopic) * 100
                  }%`,
                }}
              />
            </div>

            <PracticeCard
              word={currentWord}
              courseId={courseId}
              topicId={selectedTopic?.id || selectedTopic?._id}
              wordIndex={currentWordIndex}
              totalWords={totalWordsInTopic}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              showAnswer={showAnswer}
              isCorrect={isCorrect}
              correctAnswer={currentWord}
              onCheckAnswer={handleCheckAnswer}
              onDontKnow={handleDontKnow}
              onNext={handleNext}
              onProgressUpdate={handleProgressUpdate} // ← Truyền callback
              progress={topicsProgress[selectedTopic.id?.toString()]}
              isAdmin={isAdmin}
              onEditWord={handleEditWord}
              onDeleteWord={handleDeleteWord}
            />
          </div>

          {/* Topics Panel - Sử dụng TopicList component */}
          <TopicList
            topics={topics}
            currentTopicIndex={currentTopicIndex}
            isAdmin={isAdmin}
            openMenuId={openMenuId}
            topicsProgress={topicsProgress}  // <- truyền state xuống
            onTopicClick={handleTopicClick}
            onToggleMenu={toggleMenu}
            onAddWord={openAddWordModal}
            onEditTopic={openEditTopicModal}
            onDeleteTopic={handleDeleteFromMenu}
            onAddTopicClick={() => setIsAddTopicModalOpen(true)}
          />
        </div>

        {/* Lazy loaded modals */}
        <Suspense fallback={null}>
          {isAddTopicModalOpen && (
            <AddTopicModal
              isOpen={isAddTopicModalOpen}
              onClose={() => setIsAddTopicModalOpen(false)}
              onSubmit={addTopic}
            />
          )}

          {isEditTopicModalOpen && editingTopic && (
            <EditTopicModal
              isOpen={isEditTopicModalOpen}
              topic={editingTopic}
              onClose={() => {
                setIsEditTopicModalOpen(false);
                setEditingTopic(null);
              }}
              onSubmit={updateTopic}
            />
          )}

          {isAddWordModalOpen && selectedTopicForWord && (
            <AddWordModal
              isOpen={isAddWordModalOpen}
              topic={selectedTopicForWord}
              onClose={() => {
                setIsAddWordModalOpen(false);
                setSelectedTopicForWord(null);
              }}
              onSubmit={addWordToTopic}
            />
          )}

          {isEditWordModalOpen && editingWord && (
            <EditWordModal
              isOpen={isEditWordModalOpen}
              word={editingWord}
              topicId={selectedTopic.id}
              onClose={() => {
                setIsEditWordModalOpen(false);
                setEditingWord(null);
              }}
              onSubmit={updateWord}
            />
          )}
        </Suspense>
      </div>
    </>
  );
};

export default Vocabulary;
