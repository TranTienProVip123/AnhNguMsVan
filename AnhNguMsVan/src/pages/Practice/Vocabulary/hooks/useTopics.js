import { useState, useEffect, useCallback } from 'react';

// Base URL
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

  // ==================== FETCH TOPICS ====================
  const fetchTopics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (courseId) {
        const response = await fetch(`${COURSES_API}/${courseId}`);
        const result = await response.json();

        if (result.success) {
          const courseTopics = result.data?.course?.topics ?? [];
          setTopics(courseTopics.map((t) => ({ 
            ...t, 
            id: t._id || t.id 
          })));
        } else {
          setError('Lỗi khi tải topics của khóa học');
        }
      } else {
        const response = await fetch(`${TOPICS_API}`);
        const result = await response.json();

        if (result.success) {
          setTopics(result.data.map(t => ({
            ...t,
            id: t._id || t.id
          })));
        } else {
          setError('Lỗi khi tải danh sách chủ đề');
        }
      }
    } catch (err) {
      console.error('❌ Error fetching topics:', err);
      setError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  // ==================== FETCH TOPIC DETAIL ====================
  const fetchTopicDetail = useCallback(async (topicId) => {
    if (!topicId) {
      return null;
    }

    try {
      const response = await fetch(`${TOPICS_API}/${topicId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const topic = {
          ...result.data,
          id: result.data._id || result.data.id
        };
        
        setSelectedTopic(topic);
          
        return topic; // ✅ Return topic để caller sử dụng
      } else {
        console.error('❌ [useTopics] Invalid response:', result);
        return null;
      }
    } catch (err) {
      console.error('❌ [useTopics] Error fetching topic detail:', err);
      setError('Không thể tải chi tiết chủ đề');
      return null;
    }
  }, []);

  // ==================== ADD TOPIC ====================
  const addTopic = useCallback(async (topicData) => {
    try {
      console.log('➕ [useTopics] Adding topic:', topicData);

      // ✅ Validate courseId
      if (!topicData.courseId) {
        console.error('❌ courseId is required');
        return {
          success: false,
          message: 'courseId là bắt buộc'
        };
      }

      const response = await fetch(`${TOPICS_ADMIN_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(topicData)
      });

      const result = await response.json();
      console.log('📦 [useTopics] Add topic response:', result);

      if (result.success && result.data) {
        // ✅ Normalize topic data
        const newTopic = {
          ...result.data,
          id: result.data._id || result.data.id,
          _id: result.data._id || result.data.id
        };

        console.log('✅ [useTopics] New topic created:', newTopic);

        // ✅ Check newTopic có id không
        if (!newTopic.id) {
          console.error('❌ [useTopics] New topic missing id:', newTopic);
          return {
            success: false,
            message: 'Lỗi: Topic được tạo nhưng không có ID'
          };
        }

        // Cập nhật state
        setTopics((prev) => [...prev, newTopic]);

        // ✅ Nếu đang trong course, cập nhật course
        if (courseId) {
          console.log('🔗 [useTopics] Attaching topic to course:', courseId);
          
          const updatedTopicIds = [
            ...topics.map((t) => t._id || t.id),
            newTopic.id
          ];

          try {
            await fetch(`${COURSES_ADMIN_API}/${courseId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ topics: updatedTopicIds })
            });
            
            console.log('✅ [useTopics] Topic attached to course');
          } catch (err) {
            console.error('❌ Error attaching topic to course:', err);
          }
        }

        // Refresh topics list
        await fetchTopics();

        return {
          success: true,
          data: newTopic,
          message: 'Tạo chủ đề thành công'
        };
      } else {
        console.error('❌ [useTopics] Add topic failed:', result);
        return result;
      }
    } catch (err) {
      console.error('❌ [useTopics] Error adding topic:', err);
      return {
        success: false,
        message: err.message || 'Lỗi khi tạo chủ đề'
      };
    }
  }, [token, courseId, fetchTopics, topics]);

  // ==================== UPDATE TOPIC ====================
  const updateTopic = useCallback(async (topicId, topicData) => {
    try {
      console.log('✏️ [useTopics] Updating topic:', topicId, topicData);

      const response = await fetch(`${TOPICS_ADMIN_API}/${topicId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(topicData)
      });

      const result = await response.json();
      console.log('📦 [useTopics] Update topic response:', result);

      if (result.success) {
        const updatedTopic = {
          ...(result.data || topicData),
          id: topicId,
          _id: topicId
        };

        // Update local state
        setTopics(prev => prev.map(t => 
          (t.id || t._id) === topicId 
            ? { ...t, ...updatedTopic } 
            : t
        ));

        // Refresh topic detail nếu đang xem topic này
        if (selectedTopic && (selectedTopic.id || selectedTopic._id) === topicId) {
          await fetchTopicDetail(topicId);
        }

        console.log('✅ [useTopics] Topic updated successfully');
      }

      return result;
    } catch (err) {
      console.error('❌ [useTopics] Error updating topic:', err);
      return {
        success: false,
        message: err.message || 'Lỗi khi cập nhật chủ đề'
      };
    }
  }, [token, fetchTopicDetail, selectedTopic]);

  // ==================== DELETE TOPIC ====================
  const deleteTopic = useCallback(async (topicId) => {
    try {
      console.log('🗑️ [useTopics] Deleting topic:', topicId);

      const response = await fetch(`${TOPICS_ADMIN_API}/${topicId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });

      const result = await response.json();
      console.log('📦 [useTopics] Delete topic response:', result);

      if (result.success) {
        setTopics((prev) => {
          const next = prev.filter(t => (t.id || t._id) !== topicId);

          // Nếu đang trong course, cập nhật course
          if (courseId) {
            const remainingIds = next.map(t => t._id || t.id);
            
            fetch(`${COURSES_ADMIN_API}/${courseId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ topics: remainingIds })
            }).catch((err) => {
              console.error('❌ Error detaching topic from course:', err);
            });
          }

          return next;
        });

        console.log('✅ [useTopics] Topic deleted successfully');
      }

      return result;
    } catch (err) {
      console.error('❌ [useTopics] Error deleting topic:', err);
      return {
        success: false,
        message: err.message || 'Lỗi khi xóa chủ đề'
      };
    }
  }, [token, courseId]);

  // ==================== ADD WORD ====================
  const addWordToTopic = useCallback(async (topicId, wordData) => {
    try {
      console.log('➕ [useTopics] Adding word to topic:', topicId, wordData);

      const response = await fetch(`${TOPICS_ADMIN_API}/${topicId}/words`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(wordData)
      });

      const result = await response.json();
      console.log('📦 [useTopics] Add word response:', result);

      if (result.success) {
        // Update totalWords count
        setTopics(prev => prev.map(t =>
          (t.id || t._id) === topicId 
            ? { ...t, totalWords: (t.totalWords || 0) + 1 } 
            : t
        ));

        // Refresh topic detail
        await fetchTopicDetail(topicId);

        console.log('✅ [useTopics] Word added successfully');
      }

      return result;
    } catch (err) {
      console.error('❌ [useTopics] Error adding word:', err);
      return {
        success: false,
        message: err.message || 'Lỗi khi thêm từ vựng'
      };
    }
  }, [token, fetchTopicDetail]);

  // ==================== UPDATE WORD ====================
  const updateWord = useCallback(async (topicId, wordId, wordData) => {
    try {
      console.log('✏️ [useTopics] Updating word:', topicId, wordId, wordData);

      const response = await fetch(`${TOPICS_ADMIN_API}/${topicId}/words/${wordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(wordData)
      });

      const result = await response.json();
      console.log('📦 [useTopics] Update word response:', result);

      if (result.success) {
        await fetchTopicDetail(topicId);
        console.log('✅ [useTopics] Word updated successfully');
      }

      return result;
    } catch (err) {
      console.error('❌ [useTopics] Error updating word:', err);
      return {
        success: false,
        message: err.message || 'Lỗi khi cập nhật từ vựng'
      };
    }
  }, [token, fetchTopicDetail]);

  // ==================== DELETE WORD ====================
  const deleteWord = useCallback(async (topicId, wordId) => {
    try {
      console.log('🗑️ [useTopics] Deleting word:', topicId, wordId);

      const response = await fetch(`${TOPICS_ADMIN_API}/${topicId}/words/${wordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      console.log('📦 [useTopics] Delete word response:', result);

      if (result.success) {
        // Update totalWords count
        setTopics(prev => prev.map(t =>
          (t.id || t._id) === topicId 
            ? { ...t, totalWords: Math.max(0, (t.totalWords || 0) - 1) } 
            : t
        ));

        // Refresh topic detail
        await fetchTopicDetail(topicId);

        console.log('✅ [useTopics] Word deleted successfully');
      }

      return result;
    } catch (err) {
      console.error('❌ [useTopics] Error deleting word:', err);
      return {
        success: false,
        message: err.message || 'Lỗi khi xóa từ vựng'
      };
    }
  }, [token, fetchTopicDetail]);

  // ==================== INITIAL LOAD ====================
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
    updateWord,
    deleteWord,
    setSelectedTopic
  };
};