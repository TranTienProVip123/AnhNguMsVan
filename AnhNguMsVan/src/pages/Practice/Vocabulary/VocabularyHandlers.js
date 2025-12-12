import { useCallback } from 'react';

export const useVocabularyHandlers = ({
  topics,
  selectedTopic,
  currentTopicIndex,
  currentWordIndex,
  completedTopics,
  topicWordPositions,
  setCurrentTopicIndex,
  setCurrentWordIndex,
  setTopicWordPositions,
  setCompletedTopics,
  setOpenMenuId,
  setSelectedTopicForWord,
  setIsAddWordModalOpen,
  setEditingTopic,
  setIsEditTopicModalOpen,
  setEditingWord,
  setIsEditWordModalOpen,
  fetchTopicDetail,
  resetWordState,
  handleNextWord,
  deleteTopic,
  deleteWord,
}) => {

  // ==================== HANDLERS - RESET TOPIC ====================
  
  const handleResetTopicProgress = useCallback(async (topicId) => {
    if (!window.confirm('Bạn có muốn làm lại chủ đề này không?\n\nTiến độ hiện tại sẽ được giữ lại.')) {
      return;
    }

    try {
      const topic = topics.find(t => (t.id || t._id).toString() === topicId.toString());
      if (!topic) return;

      const topicIndex = topics.findIndex(t => (t.id || t._id).toString() === topicId.toString());
      
      if (topicIndex === currentTopicIndex) {
        setCurrentWordIndex(0);
        resetWordState();
      }

      setTopicWordPositions(prev => {
        const updated = { ...prev };
        delete updated[topicId.toString()];
        return updated;
      });

      alert('✅ Bạn có thể làm lại chủ đề này. Tiến độ cũ vẫn được giữ lại!');

    } catch (error) {
      console.error('❌ Error resetting topic:', error);
      alert('Có lỗi xảy ra khi reset chủ đề');
    }
  }, [topics, currentTopicIndex, resetWordState, setCurrentWordIndex, setTopicWordPositions]);

  // ==================== HANDLERS - NAVIGATION ====================
  
  const handleNext = useCallback(() => {
    const result = handleNextWord();

    if (selectedTopic && !result.completed) {
      const topicId = (selectedTopic.id || selectedTopic._id).toString();
      const nextPosition = result.nextTopic ? 0 : currentWordIndex + 1;
      
      setTopicWordPositions(prev => ({
        ...prev,
        [topicId]: nextPosition
      }));
    }

    if (result.nextTopic) {
      const nextIndex = result.nextTopicIndex;
      setCurrentTopicIndex(nextIndex);
      resetWordState();
      fetchTopicDetail(topics[nextIndex].id);
      
    } else if (result.completed) {
      const currentTopicId = (selectedTopic.id || selectedTopic._id).toString();
      const isTopicCompleted = completedTopics.has(currentTopicId);

      if (isTopicCompleted) {
        const shouldRestart = window.confirm(
          '🎉 Bạn đã hoàn thành chủ đề này!\n\n' +
          '✅ Tiến độ của bạn đã được lưu.\n\n' +
          'Bạn có muốn làm lại không?'
        );

        if (shouldRestart) {
          handleResetTopicProgress(currentTopicId);
        } else {
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
        alert('🎉 Chúc mừng! Bạn đã hoàn thành chủ đề này lần đầu!');
        
        setCompletedTopics(prev => {
          const updated = new Set(prev);
          updated.add(currentTopicId);
          return updated;
        });

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
    setCurrentWordIndex,
    setTopicWordPositions,
    setCurrentTopicIndex,
    setCompletedTopics
  ]);

  // ==================== HANDLERS - TOPIC ACTIONS ====================
  
  const handleTopicClick = useCallback(
    (topicIndex) => {
      const topic = topics[topicIndex];
      const topicId = (topic.id || topic._id).toString();

      if (topicIndex === currentTopicIndex) {
        return;
      }

      if (selectedTopic) {
        const currentTopicId = (selectedTopic.id || selectedTopic._id).toString();
        
        setTopicWordPositions(prev => ({
          ...prev,
          [currentTopicId]: currentWordIndex
        }));
      }

      setCurrentTopicIndex(topicIndex);
      
      fetchTopicDetail(topic.id).then((fetchedTopic) => {
        const topicWords = fetchedTopic?.words || [];
        const isTopicCompleted = completedTopics.has(topicId);
        const savedPosition = topicWordPositions[topicId];
        
        if (isTopicCompleted) {
          const lastWordIndex = Math.max(0, topicWords.length - 1);
          setCurrentWordIndex(lastWordIndex);
        } else if (savedPosition !== undefined && savedPosition >= 0) {
          setCurrentWordIndex(savedPosition);
        } else {
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
      setCurrentWordIndex,
      setCurrentTopicIndex,
      setTopicWordPositions
    ]
  );

  const toggleMenu = useCallback((e, topicId) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === topicId ? null : topicId));
  }, [setOpenMenuId]);

  const openAddWordModal = useCallback((e, topic) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setSelectedTopicForWord(topic);
    setIsAddWordModalOpen(true);
  }, [setOpenMenuId, setSelectedTopicForWord, setIsAddWordModalOpen]);

  const openEditTopicModal = useCallback((e, topic) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setEditingTopic(topic);
    setIsEditTopicModalOpen(true);
  }, [setOpenMenuId, setEditingTopic, setIsEditTopicModalOpen]);

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
    [deleteTopic, currentTopicIndex, topics.length, setOpenMenuId, setCurrentTopicIndex]
  );

  // ==================== HANDLERS - WORD ACTIONS ====================
  
  const handleEditWord = useCallback((word) => {
    setEditingWord(word);
    setIsEditWordModalOpen(true);
  }, [setEditingWord, setIsEditWordModalOpen]);

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

  return {
    handleResetTopicProgress,
    handleNext,
    handleTopicClick,
    toggleMenu,
    openAddWordModal,
    openEditTopicModal,
    handleDeleteFromMenu,
    handleEditWord,
    handleDeleteWord,
  };
};