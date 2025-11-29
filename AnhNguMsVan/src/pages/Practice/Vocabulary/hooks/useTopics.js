// Quản lý các chủ đề
import { useState, useEffect, useCallback } from 'react';

const API_URL = "http://localhost:4000/api";

export const useTopics = (token) => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch danh sách topics
  const fetchTopics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/topics`);
      const result = await response.json();

      if (result.success) {
        setTopics(result.data);
      } else {
        setError('Lỗi khi tải danh sách chủ đề');
      }
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch chi tiết topic với words - Lazy loading
  const fetchTopicDetail = useCallback(async (topicId) => {
    try {
      const response = await fetch(`${API_URL}/topics/${topicId}`);
      const result = await response.json();

      if (result.success) {
        setSelectedTopic(result.data);
        return result.data;
      }
    } catch (err) {
      console.error('Error fetching topic detail:', err);
      setError('Không thể tải chi tiết chủ đề');
    }
  }, []);

  // Add topic
  const addTopic = useCallback(async (topicData) => {
    const response = await fetch(`${API_URL}/topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(topicData)
    });

    const result = await response.json();
    if (result.success) {
      setTopics(prev => [...prev, result.data]);
    }
    return result;
  }, [token]);

  // Update topic
  const updateTopic = useCallback(async (topicId, topicData) => {
    const response = await fetch(`${API_URL}/topics/${topicId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(topicData)
    });

    const result = await response.json();
    if (result.success) {
      setTopics(prev => prev.map(t => t.id === topicId ? { ...t, ...topicData } : t));
      await fetchTopicDetail(topicId);
    }
    return result;
  }, [token, fetchTopicDetail]);

  // Delete topic
  const deleteTopic = useCallback(async (topicId) => {
    const response = await fetch(`${API_URL}/topics/${topicId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await response.json();
    if (result.success) {
      setTopics(prev => prev.filter(t => t.id !== topicId));
    }
    return result;
  }, [token]);

  // Add word to topic
  const addWordToTopic = useCallback(async (topicId, wordData) => {
    const response = await fetch(`${API_URL}/topics/${topicId}/words`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(wordData)
    });

    const result = await response.json();
    if (result.success) {
      setTopics(prev => prev.map(t => 
        t.id === topicId ? { ...t, totalWords: t.totalWords + 1 } : t
      ));
      await fetchTopicDetail(topicId);
    }
    return result;
  }, [token, fetchTopicDetail]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return {
    topics,
    selectedTopic,
    isLoading,
    error,
    fetchTopicDetail,
    addTopic,
    updateTopic,
    deleteTopic,
    addWordToTopic,
    setSelectedTopic
  };
};