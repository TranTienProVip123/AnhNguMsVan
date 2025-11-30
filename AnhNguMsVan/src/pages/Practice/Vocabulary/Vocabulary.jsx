import React, { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/Header/Header.jsx";
import TopicList from "./components/TopicList.jsx";
import { LoadingState, LoadingTopicDetail, NoTopicsState } from "./components/LoadingStates.jsx";
import { useTopics } from "./hooks/useTopics.js";
import { useWordNavigation } from "./hooks/useWordNavigation.js";
import "./Vocabulary.css";
import "./styles/index.css";
import PracticeCard from "./components/PracticeCard.jsx";

// Lazy load modals - chỉ load khi cần
const AddTopicModal = lazy(() => import('./components/modals/AddTopicModal.jsx'));
const EditTopicModal = lazy(() => import('./components/modals/EditTopicModal.jsx'));
const AddWordModal = lazy(() => import('./components/modals/AddWordModal.jsx'));

const Vocabulary = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const courseIdFromQuery = new URLSearchParams(location.search).get("courseId");
  const courseId = courseIdFromQuery || location.state?.courseId;
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // Modals state
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [isEditTopicModalOpen, setIsEditTopicModalOpen] = useState(false);
  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [selectedTopicForWord, setSelectedTopicForWord] = useState(null);

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
    addWordToTopic
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
    resetWordState
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
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  // Topic handlers
  const handleTopicClick = useCallback((topicIndex) => {
    setCurrentTopicIndex(topicIndex);
    resetWordState();
    fetchTopicDetail(topics[topicIndex].id);
  }, [topics, resetWordState, fetchTopicDetail]);

  const toggleMenu = useCallback((e, topicId) => {
    e.stopPropagation();
    setOpenMenuId(prev => prev === topicId ? null : topicId);
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

  const handleDeleteFromMenu = useCallback(async (e, topicId) => {
    e.stopPropagation();
    setOpenMenuId(null);
    
    if (!window.confirm('Bạn có chắc muốn xóa chủ đề này?')) return;
    
    const result = await deleteTopic(topicId);
    if (result.success) {
      alert('Xóa chủ đề thành công!');
      // Điều chỉnh currentTopicIndex nếu cần
      if (currentTopicIndex >= topics.length - 1) {
        setCurrentTopicIndex(Math.max(0, topics.length - 2));
      }
    } else {
      alert(result.message || 'Có lỗi xảy ra');
    }
  }, [deleteTopic, currentTopicIndex, topics.length]);

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
                style={{ width: `${((currentWordIndex + 1) / totalWordsInTopic) * 100}%` }}
              />
            </div>

            <PracticeCard 
              word={currentWord} 
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
            />
          </div>

          {/* Topics Panel - Sử dụng TopicList component */}
          <TopicList
            topics={topics}
            currentTopicIndex={currentTopicIndex}
            isAdmin={isAdmin}
            openMenuId={openMenuId}
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
        </Suspense>
      </div>
    </>
  );
};

export default Vocabulary;
