import React, { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/Header/Header.jsx";
import PracticeCard from "./components/PracticeCard/index.jsx";
import TopicList from "./components/TopicList.jsx";
import {LoadingState,LoadingTopicDetail,NoTopicsState} from "./components/LoadingStates.jsx";
import { useTopics } from "./hooks/useTopics.js";
import { useWordNavigation } from "./hooks/useWordNavigation.js";
import "./Vocabulary.css";

// Lazy load modals
const AddTopicModal = lazy(() => import("./components/modals/AddTopicModal.jsx"));
const EditTopicModal = lazy(() => import("./components/modals/EditTopicModal.jsx"));
const AddWordModal = lazy(() => import("./components/modals/AddWordModal.jsx"));
const EditWordModal = lazy(() => import("./components/modals/EditWordModal.jsx"));

const Vocabulary = () => {
  // ==================== HOOKS ====================
  const { user, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state?.title || "Vocabulary Practice";
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('courseId');
  const courseTitle = queryParams.get('courseTitle') || 'Khóa học';
  const decodedTitle = decodeURIComponent(courseTitle);

  const userId = user?._id || user?.id;
  const isAdmin = user?.role === "admin";
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // ==================== STORAGE KEY ====================
  const storageKey = `vocab_${userId}_${courseId}`;

  // ==================== STATE - UI ====================
  const [openMenuId, setOpenMenuId] = useState(null);
  const [completedTopics, setCompletedTopics] = useState(new Set());

  // ==================== STATE - MODALS ====================
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [isEditTopicModalOpen, setIsEditTopicModalOpen] = useState(false);
  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false);
  const [isEditWordModalOpen, setIsEditWordModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [selectedTopicForWord, setSelectedTopicForWord] = useState(null);
  const [editingWord, setEditingWord] = useState(null);

  // ==================== STATE - PROGRESS ====================
  const [topicsProgress, setTopicsProgress] = useState({});

  // ==================== STATE - TOPIC INDEX (với localStorage) ====================
  const [currentTopicIndex, setCurrentTopicIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_current_topic`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // ==================== STATE - WORD POSITIONS (với localStorage) ====================
  const [topicWordPositions, setTopicWordPositions] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_positions`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // ==================== CUSTOM HOOKS ====================
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

  // ==================== EFFECTS - SAVE TO LOCALSTORAGE ====================
  
  // Save currentTopicIndex
  useEffect(() => {
    if (userId && courseId && currentTopicIndex !== undefined) {
      localStorage.setItem(`${storageKey}_current_topic`, currentTopicIndex.toString());
    }
  }, [currentTopicIndex, storageKey, userId, courseId]);

  // Save topicWordPositions
  useEffect(() => {
    if (userId && courseId) {
      localStorage.setItem(`${storageKey}_positions`, JSON.stringify(topicWordPositions));
    }
  }, [topicWordPositions, storageKey, userId, courseId]);

  // ==================== EFFECTS - AUTO LOAD TOPIC ====================
  
  useEffect(() => {
    if (topics.length > 0 && !selectedTopic && userId && courseId) {
      const topicIndexToLoad = Math.min(currentTopicIndex, topics.length - 1);
      const topicToLoad = topics[topicIndexToLoad];
      const topicId = (topicToLoad.id || topicToLoad._id).toString();
      
      if (topicIndexToLoad !== currentTopicIndex) {
        setCurrentTopicIndex(topicIndexToLoad);
      }
      
      fetchTopicDetail(topicToLoad.id).then(() => {
        const savedPosition = topicWordPositions[topicId];
        
        if (savedPosition !== undefined && savedPosition >= 0) {
          setCurrentWordIndex(savedPosition);
        } else {
          setCurrentWordIndex(0);
        }
      });
    }
  }, [topics, selectedTopic, userId, courseId]);

  // ==================== EFFECTS - FETCH PROGRESS ====================
  
  useEffect(() => {
  const fetchCourseProgress = async () => {
    if (!user || !token || !courseId) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/progress/course/${courseId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success && data.data.topics) {
        const progressMap = {};
        const completed = new Set();
        
        data.data.topics.forEach(tp => {
          const topicIdStr = tp.topicId.toString();
          const isCompleted = tp.completionRate >= 100;
          
          progressMap[topicIdStr] = {
            totalWordsLearned: tp.totalWordsLearned,
            totalWordsInTopic: tp.totalWordsInTopic,
            completionRate: tp.completionRate,
            status: tp.status,
            isCompleted
          };

          if (isCompleted) {
            completed.add(topicIdStr);
          }
        });
        
        setTopicsProgress(progressMap);
        setCompletedTopics(completed);

      }
    } catch (error) {
      console.error('❌ Fetch course progress failed:', error);
    }
  };

  fetchCourseProgress();
}, [user, token, courseId, API_BASE_URL]);

  // ==================== EFFECTS - CLOSE MENU ON OUTSIDE CLICK ====================
  
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

  // ==================== HANDLERS - PROGRESS ====================
  
  const handleProgressUpdate = useCallback((topicId, newProgress) => {
    
    setTopicsProgress(prev => {
      const topicIdStr = topicId.toString();
      const updated = {
        ...prev,
        [topicIdStr]: {
          totalWordsLearned: newProgress.totalWordsLearned,
          totalWordsInTopic: newProgress.totalWordsInTopic,
          completionRate: newProgress.completionRate,
          status: newProgress.status,
          isCompleted: newProgress.isCompleted
        }
      };
      
      return updated;
    });

    // Track completed topics
    if (newProgress.isCompleted) {
      setCompletedTopics(prev => new Set(prev).add(topicId.toString()));
    }
  }, []);

  // ==================== HANDLERS - RESET TOPIC ====================
  
  const handleResetTopicProgress = useCallback(async (topicId) => {
    if (!window.confirm('Bạn có muốn làm lại chủ đề này không?\n\nTiến độ hiện tại sẽ được giữ lại.')) {
      return;
    }

    try {
      const topic = topics.find(t => (t.id || t._id).toString() === topicId.toString());
      if (!topic) return;

      const topicIndex = topics.findIndex(t => (t.id || t._id).toString() === topicId.toString());
      // Reset về từ đầu tiên
      if (topicIndex === currentTopicIndex) {
        setCurrentWordIndex(0);
        resetWordState();
      }

      // Clear saved position
      setTopicWordPositions(prev => {
        const updated = { ...prev };
        delete updated[topicId.toString()];
        return updated;
      });

      alert('✅ Bạn có thể làm lại chủ đề này. Tiến độ cũ vẫn được giữ lại!');

    } catch (error) {
      console.error('❌ [Vocabulary] Error resetting topic:', error);
      alert('Có lỗi xảy ra khi reset chủ đề');
    }
  }, [topics, currentTopicIndex, resetWordState, setCurrentWordIndex]);

  // ==================== HANDLERS - NAVIGATION ====================
  
  const handleNext = useCallback(() => {
    const result = handleNextWord();

    // Lưu vị trí mới
    if (selectedTopic && !result.completed) {
      const topicId = (selectedTopic.id || selectedTopic._id).toString();
      const nextPosition = result.nextTopic ? 0 : currentWordIndex + 1;
      
      setTopicWordPositions(prev => ({
        ...prev,
        [topicId]: nextPosition
      }));
    }

    if (result.nextTopic) {
      // Chuyển sang topic tiếp theo
      const nextIndex = result.nextTopicIndex;
      
      setCurrentTopicIndex(nextIndex);
      resetWordState();
      fetchTopicDetail(topics[nextIndex].id);
      
    } else if (result.completed) {
      // Hoàn thành topic hiện tại
      const currentTopicId = (selectedTopic.id || selectedTopic._id).toString();
      const isTopicCompleted = completedTopics.has(currentTopicId);

      if (isTopicCompleted) {
        // Đã hoàn thành rồi - Hiện option làm lại
        const shouldRestart = window.confirm(
          '🎉 Bạn đã hoàn thành chủ đề này!\n\n' +
          '✅ Tiến độ của bạn đã được lưu.\n\n' +
          'Bạn có muốn làm lại không?'
        );

        if (shouldRestart) {
          handleResetTopicProgress(currentTopicId);
        } else {
          // Chuyển sang topic tiếp theo nếu có
          const nextTopicIndex = currentTopicIndex + 1;
          if (nextTopicIndex < topics.length) {
            setCurrentTopicIndex(nextTopicIndex);
            resetWordState();
            fetchTopicDetail(topics[nextTopicIndex].id);
          } else {
            alert('🎉 Bạn đã hoàn thành tất cả các chủ đề!');
          }
        }
      } else {
        // Lần đầu hoàn thành
        alert('🎉 Chúc mừng! Bạn đã hoàn thành chủ đề này lần đầu!');
        
        // Mark as completed
        setCompletedTopics(prev => {
          const updated = new Set(prev);
          updated.add(currentTopicId);
          return updated;
        });

        // Giữ ở vị trí cuối cùng
        const lastWordIndex = selectedTopic.words.length - 1;
        setCurrentWordIndex(lastWordIndex);
      }
    }
  }, [
    handleNextWord,
    selectedTopic,
    currentWordIndex,
    completedTopics,
    topics,
    currentTopicIndex,
    resetWordState,
    fetchTopicDetail,
    handleResetTopicProgress,
    setCurrentWordIndex
  ]);

  // ==================== HANDLERS - TOPIC ACTIONS ====================
  
  const handleTopicClick = useCallback(
    (topicIndex) => {
      const topic = topics[topicIndex];
      const topicId = (topic.id || topic._id).toString();

      // Nếu click vào topic đang làm → Không làm gì
      if (topicIndex === currentTopicIndex) {
        return;
      }

      // Lưu vị trí hiện tại của topic cũ
      if (selectedTopic) {
        const currentTopicId = (selectedTopic.id || selectedTopic._id).toString();
        
        setTopicWordPositions(prev => ({
          ...prev,
          [currentTopicId]: currentWordIndex
        }));
      }

      // Chuyển sang topic mới
      setCurrentTopicIndex(topicIndex);
      
      // Fetch và restore vị trí
      fetchTopicDetail(topic.id).then((fetchedTopic) => {
        const topicWords = fetchedTopic?.words || [];
        const isTopicCompleted = completedTopics.has(topicId);
        const savedPosition = topicWordPositions[topicId];
        
        if (isTopicCompleted) {
        // ✅ Topic đã hoàn thành → Giữ ở vị trí cuối cùng
        const lastWordIndex = Math.max(0, topicWords.length - 1);
        setCurrentWordIndex(lastWordIndex);
        
      } else if (savedPosition !== undefined && savedPosition >= 0) {
        // Topic chưa hoàn thành → Restore saved position
        setCurrentWordIndex(savedPosition);
        
      } else {
        // Topic mới → Bắt đầu từ đầu
        resetWordState();
      }
    });
    },
    [
      topics,
      currentTopicIndex,
      currentWordIndex,
      selectedTopic,
      topicWordPositions,
      completedTopics,
      fetchTopicDetail,
      resetWordState,
      setCurrentWordIndex
    ]
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
        
        if (currentTopicIndex >= topics.length - 1) {
          setCurrentTopicIndex(Math.max(0, topics.length - 2));
        }
      } else {
        alert(result.message || "Có lỗi xảy ra");
      }
    },
    [deleteTopic, currentTopicIndex, topics.length]
  );

  // ==================== HANDLERS - WORD ACTIONS ====================
  
  const handleEditWord = useCallback((word) => {
    setEditingWord(word);
    setIsEditWordModalOpen(true);
  }, []);

  const handleDeleteWord = useCallback(
    async (word) => {
      if (!selectedTopic?.id || !word._id) {
        alert("Lỗi: Không xác định được từ vựng cần xóa");
        return;
      }

      const result = await deleteWord(selectedTopic.id, word._id);

      if (result.success) {
        alert("Xóa từ vựng thành công!");

        const totalWords = selectedTopic.words.length;
        if (totalWords === 1) {
          alert("Đã xóa hết từ vựng trong chủ đề này");
          resetWordState();
        } else if (currentWordIndex >= totalWords - 1) {
          setCurrentWordIndex(Math.max(0, totalWords - 2));
        }
      } else {
        alert(result.message || "Có lỗi xảy ra khi xóa từ vựng");
      }
    },
    [selectedTopic, deleteWord, currentWordIndex, resetWordState, setCurrentWordIndex]
  );

  // ==================== RENDER - ERROR STATE ====================
  
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

  // ==================== RENDER - LOADING STATE ====================
  
  if (isLoading) {
    return <LoadingState />;
  }

  // ==================== RENDER - NO TOPICS ====================
  
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

  // ==================== RENDER - LOADING TOPIC DETAIL ====================
  
  if (!selectedTopic) {
    return <LoadingTopicDetail />;
  }

  // ==================== RENDER - MAIN CONTENT ====================
  
  const currentWord = selectedTopic.words[currentWordIndex];
  const totalWordsInTopic = selectedTopic.words.length;

  return (
    <>
      <Header />
      <div className="vocabulary-page">
        <div className="vocabulary-header">
          <h1>{title}</h1>
        </div>

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
                  width: `${((currentWordIndex + 1) / totalWordsInTopic) * 100}%`,
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
              onProgressUpdate={handleProgressUpdate}
              progress={topicsProgress[selectedTopic.id?.toString()]}
              isAdmin={isAdmin}
              onEditWord={handleEditWord}
              onDeleteWord={handleDeleteWord}
            />
          </div>

          {/* Topics Panel */}
          <TopicList
            topics={topics}
            currentTopicIndex={currentTopicIndex}
            isAdmin={isAdmin}
            openMenuId={openMenuId}
            topicsProgress={topicsProgress}
            completedTopics={completedTopics}
            onTopicClick={handleTopicClick}
            onToggleMenu={toggleMenu}
            onAddWord={openAddWordModal}
            onEditTopic={openEditTopicModal}
            onDeleteTopic={handleDeleteFromMenu}
            onAddTopicClick={() => setIsAddTopicModalOpen(true)}
            onResetTopic={handleResetTopicProgress}
          />
        </div>

        {/* Modals */}
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