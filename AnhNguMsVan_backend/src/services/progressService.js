import UserProgress from '../models/UserProgress.js';
import Topic from '../models/Topic.js';
import Course from '../models/Course.js';

// Lấy hoặc tạo UserProgress document (1 per user)
export const getOrCreateUserProgress = async (userId) => {
  try {
    let userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      console.log('📝 Creating new UserProgress for user:', userId);
      userProgress = new UserProgress({ 
        userId,
        topics: new Map()
      });
      await userProgress.save();
    }

    return userProgress;
  } catch (error) {
    console.error('Error in getOrCreateUserProgress:', error);
    throw error;
  }
};

// Lấy hoặc tạo progress của 1 topic
const getOrCreateTopicProgress = (userProgress, topicId, totalWords = 0) => {
  const topicIdStr = topicId.toString();
  
  let topicProgress = userProgress.topics.get(topicIdStr);

  if (!topicProgress) {
    console.log('📝 Creating new topic progress for:', topicIdStr);
    topicProgress = {
      topicId,
      completedWords: [],
      totalWordsInTopic: totalWords
    };
    userProgress.topics.set(topicIdStr, topicProgress);
  }

  return topicProgress;
};

// Đánh dấu từ đã hoàn thành
const markWordAsCompleted = (topicProgress, wordId, isCorrectFirstTime = false) => {
  const wordIdStr = wordId.toString();

  // Kiểm tra từ đã học chưa
  const existingWord = topicProgress.completedWords.find(
    w => w.wordId.toString() === wordIdStr
  );

  if (existingWord) {
    // Đã học rồi, tăng attempts
    existingWord.attempts += 1;
    existingWord.completedAt = new Date();
  } else {
    // Chưa học, thêm mới
    topicProgress.completedWords.push({
      wordId,
      isCorrectFirstTime,
      attempts: 1,
      completedAt: new Date()
    });
  }
};

// Tính completion rate của topic
const calculateTopicCompletionRate = (topicProgress) => {
  if (
    !topicProgress ||
    !topicProgress.totalWordsInTopic ||
    topicProgress.totalWordsInTopic === 0
  ) {
    return 0;
  }

  const learned = topicProgress.completedWords?.length || 0;
  const total = topicProgress.totalWordsInTopic;

  const percent = Math.round((learned / total) * 100);

  // Giới hạn từ 0 đến 100%
  return Math.min(Math.max(percent, 0), 100);
};

// Tính status của topic
const getTopicStatus = (topicProgress) => {
  if (!topicProgress || topicProgress.completedWords.length === 0) {
    return 'not_started';
  }

  const completionRate = calculateTopicCompletionRate(topicProgress);
  
  if (completionRate >= 100) return 'completed';
  if (completionRate > 0) return 'in_progress';
  return 'not_started';
};

// Tính tổng số từ đã học trong tất cả topics
const calculateTotalWordsLearned = (userProgress) => {
  let total = 0;
  
  for (const [topicId, topicProgress] of userProgress.topics) {
    total += topicProgress.completedWords.length;
  }

  return total;
};

// Lấy tất cả topic IDs của một course
const getCourseTopicIds = async (courseId) => {
  const course = await Course.findById(courseId).populate('topics', '_id');
  return course?.topics?.map(t => t._id.toString()) || [];
};

// Tính tổng số từ đã học trong course
const calculateCourseWordsLearned = (userProgress, courseTopicIds) => {
  let total = 0;

  for (const topicId of courseTopicIds) {
    const topicProgress = userProgress.topics.get(topicId);
    if (topicProgress) {
      total += topicProgress.completedWords.length;
    }
  }

  return total;
};

// Tính tổng số từ trong course
const calculateTotalWordsInCourse = async (courseId) => {
  const course = await Course.findById(courseId).populate('topics');
  return course?.topics?.reduce(
    (sum, topic) => sum + (topic.words?.length || 0),
    0
  ) || 0;
};

// Tính completion rate của course
const calculateCourseCompletionRate = (userProgress, courseTopicIds) => {
  let totalWords = 0;
  let learnedWords = 0;

  for (const topicId of courseTopicIds) {
    const topicProgress = userProgress.topics.get(topicId);
    if (topicProgress) {
      totalWords += topicProgress.totalWordsInTopic;
      learnedWords += topicProgress.completedWords.length;
    }
  }

  if (totalWords === 0) return 0;
  return Math.round((learnedWords / totalWords) * 100);
};

// Tính status của course
const getCourseStatus = (completionRate) => {
  if (completionRate === 100) return 'completed';
  if (completionRate > 0) return 'in_progress';
  return 'not_started';
};

// ============ PUBLIC API FUNCTIONS ============

// Update progress khi học xong 1 từ
export const updateWordProgress = async (userId, courseId, topicId, wordId, isCorrect) => {
  try {
   
    // Validation
    if (!userId) throw new Error('userId is required');
    if (!courseId) throw new Error('courseId is required');
    if (!topicId) throw new Error('topicId is required');
    if (!wordId) throw new Error('wordId is required');

    // Lấy user progress
    const userProgress = await getOrCreateUserProgress(userId);

    // Lấy topic info
    const topic = await Topic.findById(topicId);
    if (!topic) {
      throw new Error('Topic not found');
    }
    const totalWords = topic.words?.length || 0;

    // Lấy hoặc tạo topic progress
    const topicIdStr = topicId.toString();
    let topicProgress = userProgress.topics.get(topicIdStr);

    if (!topicProgress) {
      console.log('📝 [SERVICE] Creating new topic progress');
      topicProgress = {
        topicId,
        completedWords: [],
        totalWordsInTopic: totalWords
      };
      userProgress.topics.set(topicIdStr, topicProgress);
    } else {
      console.log('  Current learned:', topicProgress.completedWords.length);
      console.log('  Completed words:', topicProgress.completedWords.map(w => w.wordId.toString()));
    }
        
    const isAlreadyCompleted = topicProgress.completedWords.length >= topicProgress.totalWordsInTopic;

    // BEFORE mark
    const beforeCount = topicProgress.completedWords.length;
    // Mark word completed
    markWordAsCompleted(topicProgress, wordId, isCorrect);
    // AFTER mark
    const afterCount = topicProgress.completedWords.length;

    // Update totalWordsInTopic
    topicProgress.totalWordsInTopic = totalWords;

    // ✅ FIX 1: Set lại vào Map để trigger change detection
    userProgress.topics.set(topicIdStr, topicProgress);

    // ✅ FIX 2: Mark as modified để Mongoose biết Map đã thay đổi
    userProgress.markModified('topics');

    // Save to DB
    await userProgress.save();

    // ✅ FIX 3: Verify by fetching lại
    const verified = await UserProgress.findById(userProgress._id);
    const verifiedTopic = verified.topics.get(topicIdStr);

    // Calculate metrics
    const completionRate = calculateTopicCompletionRate(topicProgress);
    const status = getTopicStatus(topicProgress);

    const result = {
      success: true,
      data: {
        totalWordsLearned: topicProgress.completedWords.length,
        totalWordsInTopic: topicProgress.totalWordsInTopic,
        completionRate,
        status,
        isCompleted: completionRate >= 100,
        isAlreadyCompleted
      }
    };

    return result;

  } catch (error) {
    console.error('💥 [SERVICE] Error in updateWordProgress:', error);
    throw error;
  }
};

// Lấy progress của 1 topic
export const getTopicProgress = async (userId, courseId, topicId) => {
  try {
    // console.log('📊 [SERVICE] getTopicProgress:', { userId, topicId });

    const userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      return {
        totalWordsLearned: 0,
        totalWordsInTopic: 0,
        completionRate: 0,
        status: 'not_started',
        isCompleted: false
      };
    }

    const topicProgress = userProgress.topics.get(topicId.toString());

    if (!topicProgress) {
      return {
        totalWordsLearned: 0,
        totalWordsInTopic: 0,
        completionRate: 0,
        status: 'not_started',
        isCompleted: false
      };
    }

    const completionRate = calculateTopicCompletionRate(topicProgress);

    return {
      totalWordsLearned: topicProgress.completedWords.length,
      totalWordsInTopic: topicProgress.totalWordsInTopic,
      completionRate,
      status: getTopicStatus(topicProgress),
      isCompleted: completionRate >= 100,
    };

  } catch (error) {
    console.error('💥 [SERVICE] Error in getTopicProgress:', error);
    throw error;
  }
};

// Lấy progress của toàn bộ course
export const getCourseProgress = async (userId, courseId) => {
  try {
    // console.log('📊 [SERVICE] getCourseProgress:', { userId, courseId });

    const userProgress = await UserProgress.findOne({ userId });

    // Lấy tất cả topic IDs của course
    const courseTopicIds = await getCourseTopicIds(courseId);

    if (!userProgress || courseTopicIds.length === 0) {
      const totalWordsInCourse = await calculateTotalWordsInCourse(courseId);
      
      return {
        success: true,
        data: {
          totalWordsLearned: 0,
          totalWordsInCourse,
          completionRate: 0,
          status: 'not_started',
          topics: []
        }
      };
    }

    // Tính toán các metrics
    const totalWordsLearned = calculateCourseWordsLearned(userProgress, courseTopicIds);
    const totalWordsInCourse = await calculateTotalWordsInCourse(courseId);
    const completionRate = calculateCourseCompletionRate(userProgress, courseTopicIds);
    const status = getCourseStatus(completionRate);

    // Lấy progress của từng topic
    const topicsProgress = [];
    for (const topicId of courseTopicIds) {
      const topicProgress = userProgress.topics.get(topicId);
      if (topicProgress) {
        topicsProgress.push({
          topicId: topicProgress.topicId,
          totalWordsLearned: topicProgress.completedWords.length,
          totalWordsInTopic: topicProgress.totalWordsInTopic,
          completionRate: calculateTopicCompletionRate(topicProgress),
          status: getTopicStatus(topicProgress)
        });
      }
    }

    return {
      success: true,
      data: {
        totalWordsLearned,
        totalWordsInCourse,
        completionRate,
        status,
        topics: topicsProgress
      }
    };

  } catch (error) {
    console.error('💥 [SERVICE] Error in getCourseProgress:', error);
    throw error;
  }
};

// Lấy overview của tất cả courses
export const getAllCoursesProgress = async (userId) => {
  try {
    // console.log('📊 [SERVICE] getAllCoursesProgress:', { userId });

    const userProgress = await UserProgress.findOne({ userId });

    if (!userProgress || userProgress.topics.size === 0) {
      return {
        success: true,
        data: []
      };
    }

    // Lấy tất cả courses user đã học
    const allCourses = await Course.find().populate('topics');
    const progressData = [];

    for (const course of allCourses) {
      const courseTopicIds = course.topics.map(t => t._id.toString());
      
      // Check nếu user có học course này không
      const hasProgress = courseTopicIds.some(topicId => 
        userProgress.topics.has(topicId)
      );

      if (!hasProgress) continue;

      // Tính metrics
      const totalWordsLearned = calculateCourseWordsLearned(userProgress, courseTopicIds);
      const completionRate = calculateCourseCompletionRate(userProgress, courseTopicIds);
      const status = getCourseStatus(completionRate);

      // Lấy progress từng topic
      const topicsProgress = [];
      for (const topicId of courseTopicIds) {
        const topicProgress = userProgress.topics.get(topicId);
        if (topicProgress) {
          // Lấy topic name
          const topic = course.topics.find(t => t._id.toString() === topicId);
          
          topicsProgress.push({
            topicId,
            topicName: topic?.name || 'Unknown',
            totalWordsLearned: topicProgress.completedWords.length,
            totalWordsInTopic: topicProgress.totalWordsInTopic,
            completionRate: calculateTopicCompletionRate(topicProgress),
            status: getTopicStatus(topicProgress)
          });
        }
      }

      progressData.push({
        courseId: course._id,
        courseTitle: course.title,
        courseCoverImage: course.coverImage,
        totalWordsLearned,
        completionRate,
        status,
        topics: topicsProgress
      });
    }

    return {
      success: true,
      data: progressData
    };

  } catch (error) {
    console.error('💥 [SERVICE] Error in getAllCoursesProgress:', error);
    throw error;
  }
};

// Lấy tổng thống kê của user
export const getUserStats = async (userId) => {
  try {
    const userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      return {
        success: true,
        data: {
          totalWordsLearned: 0,
          totalTopicsStarted: 0,
          totalTopicsCompleted: 0,
          totalCoursesStarted: 0
        }
      };
    }

    const totalWordsLearned = calculateTotalWordsLearned(userProgress);
    
    let totalTopicsStarted = 0;
    let totalTopicsCompleted = 0;

    for (const [topicId, topicProgress] of userProgress.topics) {
      if (topicProgress.completedWords.length > 0) {
        totalTopicsStarted++;
        
        if (calculateTopicCompletionRate(topicProgress) === 100) {
          totalTopicsCompleted++;
        }
      }
    }

    // Đếm số courses đã bắt đầu
    const allCourses = await Course.find().select('topics');
    let totalCoursesStarted = 0;

    for (const course of allCourses) {
      const courseTopicIds = course.topics.map(t => t.toString());
      const hasProgress = courseTopicIds.some(topicId => 
        userProgress.topics.has(topicId)
      );
      if (hasProgress) totalCoursesStarted++;
    }

    return {
      success: true,
      data: {
        totalWordsLearned,
        totalTopicsStarted,
        totalTopicsCompleted,
        totalCoursesStarted
      }
    };

  } catch (error) {
    console.error('💥 [SERVICE] Error in getUserStats:', error);
    throw error;
  }
};