import { useState, useEffect, useCallback } from 'react';

// Base URL chỉ là host, không kèm /api để tránh lặp
const API_BASE = import.meta?.env?.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
  : "http://localhost:4000";

const TOPICS_API = `${API_BASE}/api/topics`;
const TOPICS_ADMIN_API = `${API_BASE}/api/admin/topics`;
const COURSES_API = `${API_BASE}/api/courses`;
const COURSES_ADMIN_API = `${API_BASE}/api/admin/courses`;

export const useTopics = (token, courseId) => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (courseId) {
        const response = await fetch(`${COURSES_API}/${courseId}`);
        const result = await response.json();

        if (result.success) {
          const courseTopics = result.data?.course?.topics ?? [];
          setTopics(courseTopics.map((t) => ({ ...t, id: t._id })));
        } else {
          setError('Lỗi khi tải topics của khóa học');
        }
      } else {
        const response = await fetch(`${TOPICS_API}`);
        const result = await response.json();

        if (result.success) {
          setTopics(result.data);
        } else {
          setError('Lỗi khi tải danh sách chủ đề');
        }
      }
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  // Fetch chi tiết topic với words - Lazy loading
  const fetchTopicDetail = useCallback(async (topicId) => {
    try {
      const response = await fetch(`${TOPICS_API}/${topicId}`);
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
    const response = await fetch(`${TOPICS_ADMIN_API}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(topicData)
    });

    const result = await response.json();
    if (result.success) {
      const newTopic = { ...result.data, id: result.data.id || result.data._id };

      setTopics((prev) => {
        const next = [...prev, newTopic];

        // Nếu đang trong một course, gắn topic mới vào course
        if (courseId && newTopic.id) {
          const updatedTopicIds = next.map((t) => t._id || t.id);
          fetch(`${COURSES_ADMIN_API}/${courseId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ topics: updatedTopicIds })
          }).catch((err) => console.error('Error attaching topic to course', err));
        }

        return next;
      });

      // Đồng bộ lại danh sách từ server để chắc chắn dữ liệu mới nhất
      await fetchTopics();
    }
    return result;
  }, [token, courseId, fetchTopics]);

  // Update topic
  const updateTopic = useCallback(async (topicId, topicData) => {
    const response = await fetch(`${TOPICS_ADMIN_API}/${topicId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(topicData)
    });

    const result = await response.json();
    if (result.success) {
      const updatedTopic = result.data ?? { ...topicData, id: topicId };
      setTopics(prev => prev.map(t => (t.id || t._id) === topicId ? { ...t, ...updatedTopic } : t));
      await fetchTopicDetail(topicId);
      await fetchTopics();
    }
    return result;
  }, [token, fetchTopicDetail, fetchTopics]);

  // Delete topic
  const deleteTopic = useCallback(async (topicId) => {
    const response = await fetch(`${TOPICS_API}/${topicId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await response.json();
    if (result.success) {
      setTopics((prev) => {
        const next = prev.filter(t => (t.id || t._id) !== topicId);

        // Nếu đang trong course, cập nhật course sau khi state tính xong
        if (courseId) {
          const remainingIds = next.map(t => t._id || t.id);
          fetch(`${COURSES_ADMIN_API}/${courseId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ topics: remainingIds })
          }).catch((err) => console.error('Error detaching topic from course', err));
        }

        return next;
      });
    }
    return result;
  }, [token, courseId, topics]);

  // Add word to topic
  const addWordToTopic = useCallback(async (topicId, wordData) => {
    const response = await fetch(`${TOPICS_API}/${topicId}/words`, {
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

  // edit word
  const updateWord = useCallback(async (topicId, wordId, wordData) => {
    const response = await fetch(`${API_URL}/topics/${topicId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(wordData)
    });

    const result = await response.json();
    if (result.success) {
      // Refresh topic detail để lấy data mới
      await fetchTopicDetail(topicId);
    }
    return result;
  }, [token, fetchTopicDetail]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // Delete word from topic
  const deleteWord = useCallback(async (topicId, wordId) => {
    const response = await fetch(`${API_URL}/topics/${topicId}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (result.success) {
      // Refresh topic detail để lấy data mới
      await fetchTopicDetail(topicId);
    }
    return result;
  }, [token, fetchTopicDetail]);

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
    updateWord,
    deleteWord,
    setSelectedTopic
  };
};
