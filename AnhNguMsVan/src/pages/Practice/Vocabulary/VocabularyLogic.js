import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useTopics } from './hooks/useTopics';
import { useWordNavigation } from './hooks/useWordNavigation';

export const useVocabularyLogic = () => {
  // ==================== HOOKS ====================
  const { user, token } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('courseId');
  const courseTitle = queryParams.get('courseTitle') || 'Khóa học';
  const decodedTitle = decodeURIComponent(courseTitle);

  const userId = user?._id || user?.id;
  const isAdmin = user?.role === "admin";
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const storageKey = userId ? `vocab_${userId}_${courseId}` : `vocab_guest_${courseId}`;

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

  // ==================== STATE - TOPIC INDEX ====================
  const [currentTopicIndex, setCurrentTopicIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_current_topic`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // ==================== STATE - WORD POSITIONS ====================
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
  
  useEffect(() => {
    if (courseId && currentTopicIndex !== undefined) {
      localStorage.setItem(`${storageKey}_current_topic`, currentTopicIndex.toString());
    }
  }, [currentTopicIndex, storageKey, courseId]);

  useEffect(() => {
    if (courseId) {
      localStorage.setItem(`${storageKey}_positions`, JSON.stringify(topicWordPositions));
    }
  }, [topicWordPositions, storageKey, courseId]);

  // ==================== EFFECTS - AUTO LOAD TOPIC ====================
  
  useEffect(() => {
    if (topics.length > 0 && !selectedTopic && courseId) {
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
  }, [topics, selectedTopic, courseId]);

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

  // ==================== EFFECTS - CLOSE MENU ====================
  
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

  // ==================== PROGRESS HANDLER ====================
  
  const handleProgressUpdate = useCallback((topicId, newProgress) => {
    if(!user) {
      return;
    }

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

    if (newProgress.isCompleted) {
      setCompletedTopics(prev => new Set(prev).add(topicId.toString()));
    }
  }, [user]);

  // ==================== RETURN ====================
  
  return {
    // Auth & Config
    user,
    token,
    userId,
    isAdmin,
    courseId,
    decodedTitle,
    storageKey,

    // UI State
    openMenuId,
    setOpenMenuId,
    completedTopics,
    setCompletedTopics,

    // Modal State
    isAddTopicModalOpen,
    setIsAddTopicModalOpen,
    isEditTopicModalOpen,
    setIsEditTopicModalOpen,
    isAddWordModalOpen,
    setIsAddWordModalOpen,
    isEditWordModalOpen,
    setIsEditWordModalOpen,
    editingTopic,
    setEditingTopic,
    selectedTopicForWord,
    setSelectedTopicForWord,
    editingWord,
    setEditingWord,

    // Progress State
    topicsProgress,
    setTopicsProgress,
    handleProgressUpdate,

    // Navigation State
    currentTopicIndex,
    setCurrentTopicIndex,
    topicWordPositions,
    setTopicWordPositions,

    // Topics Data
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

    // Word Navigation
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
  };
};