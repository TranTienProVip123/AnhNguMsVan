import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../../../context/AuthContext';

export const usePracticeProgress = (courseId, topicId, word) => {
  const { user, token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [topicProgress, setTopicProgress] = useState({
    totalWordsLearned: 0,
    totalWordsInTopic: 0,
    completionRate: 0,
  });

  // Fetch initial progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user || !token || !courseId || !topicId) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/progress/topic/${topicId}?courseId=${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await response.json();
        if (data.success) {
          setTopicProgress(data.data);
        }
      } catch (error) {
        console.error('❌ Fetch progress failed:', error);
      }
    };

    fetchProgress();
  }, [user, token, courseId, topicId, API_BASE_URL]);

  // Save word progress
  const saveWordProgress = useCallback(async (isCorrect, onProgressUpdate) => {
    if (!user || !token || !courseId || !topicId || !word?._id) {
      console.warn('⚠️ Missing required data for progress');
      return { success: false, error: 'Missing data' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/progress/word`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          topicId,
          wordId: word._id,
          isCorrect,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (data.success) {
        setTopicProgress(data.data);
        
        if (onProgressUpdate) {
          onProgressUpdate(topicId, data.data);
        }

        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || 'Failed to save progress');
      }
    } catch (error) {
      console.error('❌ Save progress error:', error);
      return { success: false, error: error.message };
    }
  }, [user, token, courseId, topicId, word?._id, API_BASE_URL]);

  return {
    topicProgress,
    saveWordProgress,
  };
};