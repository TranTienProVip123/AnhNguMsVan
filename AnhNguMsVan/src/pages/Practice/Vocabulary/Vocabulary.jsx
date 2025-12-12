import React, { lazy, Suspense } from "react";
import Header from "../../../components/Header/Header.jsx";
import PracticeCard from "./components/PracticeCard/index.jsx";
import TopicList from "./components/TopicList.jsx";
import {LoadingState, LoadingTopicDetail, NoTopicsState} from "./components/LoadingStates.jsx";
import { useVocabularyLogic } from "./VocabularyLogic.js";
import { useVocabularyHandlers } from "./VocabularyHandlers.js";
import "./Vocabulary.css";

// Lazy load modals
const AddTopicModal = lazy(() => import("./components/modals/AddTopicModal.jsx"));
const EditTopicModal = lazy(() => import("./components/modals/EditTopicModal.jsx"));
const AddWordModal = lazy(() => import("./components/modals/AddWordModal.jsx"));
const EditWordModal = lazy(() => import("./components/modals/EditWordModal.jsx"));

const Vocabulary = () => {
  // ==================== LOGIC HOOK ====================
  const logic = useVocabularyLogic();

  // ==================== HANDLERS HOOK ====================
  const handlers = useVocabularyHandlers({
    topics: logic.topics,
    selectedTopic: logic.selectedTopic,
    currentTopicIndex: logic.currentTopicIndex,
    currentWordIndex: logic.currentWordIndex,
    completedTopics: logic.completedTopics,
    topicWordPositions: logic.topicWordPositions,
    setCurrentTopicIndex: logic.setCurrentTopicIndex,
    setCurrentWordIndex: logic.setCurrentWordIndex,
    setTopicWordPositions: logic.setTopicWordPositions,
    setCompletedTopics: logic.setCompletedTopics,
    setOpenMenuId: logic.setOpenMenuId,
    setSelectedTopicForWord: logic.setSelectedTopicForWord,
    setIsAddWordModalOpen: logic.setIsAddWordModalOpen,
    setEditingTopic: logic.setEditingTopic,
    setIsEditTopicModalOpen: logic.setIsEditTopicModalOpen,
    setEditingWord: logic.setEditingWord,
    setIsEditWordModalOpen: logic.setIsEditWordModalOpen,
    fetchTopicDetail: logic.fetchTopicDetail,
    resetWordState: logic.resetWordState,
    handleNextWord: logic.handleNextWord,
    deleteTopic: logic.deleteTopic,
    deleteWord: logic.deleteWord,
  });

  // ==================== RENDER - ERROR STATE ====================
  
  if (logic.error) {
    return (
      <>
        <Header />
        <div className="vocabulary-page">
          <div className="error-container">
            <p className="error-message">❌ {logic.error}</p>
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
  
  if (logic.isLoading) {
    return <LoadingState />;
  }

  // ==================== RENDER - NO TOPICS ====================
  
  if (!logic.topics.length) {
    return (
      <>
        <Header />
        <div className="vocabulary-page">
          <NoTopicsState 
            isAdmin={logic.isAdmin}
            onAddTopicClick={() => logic.setIsAddTopicModalOpen(true)}
          />
        </div>
        <Suspense fallback={null}>
          {logic.isAddTopicModalOpen && (
            <AddTopicModal
              isOpen={logic.isAddTopicModalOpen}
              onClose={() => logic.setIsAddTopicModalOpen(false)}
              onSubmit={logic.addTopic}
            />
          )}
        </Suspense>
      </>
    );
  }

  // ==================== RENDER - LOADING TOPIC DETAIL ====================
  
  if (!logic.selectedTopic) {
    return <LoadingTopicDetail />;
  }

  // ✅ ADDED: Check if selectedTopic has words
  if (!logic.selectedTopic.words || !logic.selectedTopic.words.length) {
    return (
      <>
        <Header />
        <div className="vocabulary-page">
          <div className="vocabulary-header">
            <h1>{logic.decodedTitle}</h1>
          </div>

          <div className="vocabulary-container">
            <div className="practice-panel">
              <div className="practice-header">
                <h2 className="topic-name">Chủ đề: {logic.selectedTopic.name}</h2>
              </div>
              
              <div className="no-words-container">
                <p className="no-words-message">
                  📚 Chủ đề này chưa có từ vựng nào
                </p>
                {logic.isAdmin && (
                  <button
                    className="btn-add-word"
                    onClick={() => {
                      logic.setSelectedTopicForWord(logic.selectedTopic);
                      logic.setIsAddWordModalOpen(true);
                    }}
                  >
                    ➕ Thêm từ vựng
                  </button>
                )}
              </div>
            </div>

            {/* Topics Panel */}
            <TopicList
              topics={logic.topics}
              currentTopicIndex={logic.currentTopicIndex}
              isAdmin={logic.isAdmin}
              openMenuId={logic.openMenuId}
              topicsProgress={logic.topicsProgress}
              completedTopics={logic.completedTopics}
              onTopicClick={handlers.handleTopicClick}
              onToggleMenu={handlers.toggleMenu}
              onAddWord={handlers.openAddWordModal}
              onEditTopic={handlers.openEditTopicModal}
              onDeleteTopic={handlers.handleDeleteFromMenu}
              onAddTopicClick={() => logic.setIsAddTopicModalOpen(true)}
              onResetTopic={handlers.handleResetTopicProgress}
            />
          </div>

          {/* Modals */}
          <Suspense fallback={null}>
            {logic.isAddTopicModalOpen && (
              <AddTopicModal
                isOpen={logic.isAddTopicModalOpen}
                onClose={() => logic.setIsAddTopicModalOpen(false)}
                onSubmit={logic.addTopic}
              />
            )}

            {logic.isAddWordModalOpen && logic.selectedTopicForWord && (
              <AddWordModal
                isOpen={logic.isAddWordModalOpen}
                topic={logic.selectedTopicForWord}
                onClose={() => {
                  logic.setIsAddWordModalOpen(false);
                  logic.setSelectedTopicForWord(null);
                }}
                onSubmit={logic.addWordToTopic}
              />
            )}
          </Suspense>
        </div>
      </>
    );
  }

  // ✅ ADDED: Safety check for currentWord
  const currentWord = logic.selectedTopic.words[logic.currentWordIndex];
  
  if (!currentWord) {
    console.error('❌ Current word is undefined:', {
      currentWordIndex: logic.currentWordIndex,
      totalWords: logic.selectedTopic.words.length,
      topicId: logic.selectedTopic.id || logic.selectedTopic._id
    });
    
    return (
      <>
        <Header />
        <div className="vocabulary-page">
          <div className="error-container">
            <p className="error-message">
              ❌ Không tìm thấy từ vựng (Index: {logic.currentWordIndex})
            </p>
            <button
              className="btn-retry"
              onClick={() => {
                logic.setCurrentWordIndex(0);
                window.location.reload();
              }}
            >
              🔄 Reset về đầu
            </button>
          </div>
        </div>
      </>
    );
  }

  // ==================== RENDER - MAIN CONTENT ====================
  
  const totalWordsInTopic = logic.selectedTopic.words.length;

  return (
    <>
      <Header />
      <div className="vocabulary-page">
        <div className="vocabulary-header">
          <h1>{logic.decodedTitle}</h1>
        </div>

        <div className="vocabulary-container">
          {/* Practice Panel */}
          <div className="practice-panel">
            <div className="practice-header">
              <h2 className="topic-name">Chủ đề: {logic.selectedTopic.name}</h2>
              <div className="word-counter">
                câu {logic.currentWordIndex + 1}/{totalWordsInTopic}
              </div>
            </div>

            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${((logic.currentWordIndex + 1) / totalWordsInTopic) * 100}%`,
                }}
              />
            </div>

            <PracticeCard
              key={currentWord._id || currentWord.id}
              word={currentWord}
              courseId={logic.courseId}
              topicId={logic.selectedTopic?.id || logic.selectedTopic?._id}
              wordIndex={logic.currentWordIndex}
              totalWords={totalWordsInTopic}
              userAnswer={logic.userAnswer}
              setUserAnswer={logic.setUserAnswer}
              showAnswer={logic.showAnswer}
              isCorrect={logic.isCorrect}
              correctAnswer={currentWord}
              onCheckAnswer={logic.handleCheckAnswer}
              onDontKnow={logic.handleDontKnow}
              onNext={handlers.handleNext}
              onProgressUpdate={logic.handleProgressUpdate}
              progress={logic.topicsProgress[logic.selectedTopic.id?.toString()]}
              isAdmin={logic.isAdmin}
              onEditWord={handlers.handleEditWord}
              onDeleteWord={handlers.handleDeleteWord}
            />
          </div>

          {/* Topics Panel */}
          <TopicList
            topics={logic.topics}
            currentTopicIndex={logic.currentTopicIndex}
            isAdmin={logic.isAdmin}
            openMenuId={logic.openMenuId}
            topicsProgress={logic.topicsProgress}
            completedTopics={logic.completedTopics}
            onTopicClick={handlers.handleTopicClick}
            onToggleMenu={handlers.toggleMenu}
            onAddWord={handlers.openAddWordModal}
            onEditTopic={handlers.openEditTopicModal}
            onDeleteTopic={handlers.handleDeleteFromMenu}
            onAddTopicClick={() => logic.setIsAddTopicModalOpen(true)}
            onResetTopic={handlers.handleResetTopicProgress}
          />
        </div>

        {/* Modals */}
        <Suspense fallback={null}>
          {logic.isAddTopicModalOpen && (
            <AddTopicModal
              isOpen={logic.isAddTopicModalOpen}
              onClose={() => logic.setIsAddTopicModalOpen(false)}
              onSubmit={logic.addTopic}
            />
          )}

          {logic.isEditTopicModalOpen && logic.editingTopic && (
            <EditTopicModal
              isOpen={logic.isEditTopicModalOpen}
              topic={logic.editingTopic}
              onClose={() => {
                logic.setIsEditTopicModalOpen(false);
                logic.setEditingTopic(null);
              }}
              onSubmit={logic.updateTopic}
            />
          )}

          {logic.isAddWordModalOpen && logic.selectedTopicForWord && (
            <AddWordModal
              isOpen={logic.isAddWordModalOpen}
              topic={logic.selectedTopicForWord}
              onClose={() => {
                logic.setIsAddWordModalOpen(false);
                logic.setSelectedTopicForWord(null);
              }}
              onSubmit={logic.addWordToTopic}
            />
          )}

          {logic.isEditWordModalOpen && logic.editingWord && (
            <EditWordModal
              isOpen={logic.isEditWordModalOpen}
              word={logic.editingWord}
              topicId={logic.selectedTopic.id}
              onClose={() => {
                logic.setIsEditWordModalOpen(false);
                logic.setEditingWord(null);
              }}
              onSubmit={logic.updateWord}
            />
          )}
        </Suspense>
      </div>
    </>
  );
};

export default Vocabulary;