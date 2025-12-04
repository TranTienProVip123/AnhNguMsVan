import UserProgress from '../models/UserProgress.js';
import Topic from '../models/Topic.js';
import Course from '../models/Course.js';

// Lấy hoặc tạo progress cho user
export const getOrCreateProgress = async (userId, courseId, topicId) => {
  try {
    let progress = await UserProgress.findOne({ userId, courseId, topicId });

    if (!progress) {
      // Lấy topic để tính totalWords
      const topic = await Topic.findById(topicId);
      
      if (!topic) {
        throw new Error('Topic not found');
      }

      const totalWords = topic.words?.length || 0; // UPDATED: Lấy từ words array

      progress = new UserProgress({
        userId,
        courseId,
        topicId,
        totalWordsInTopic: totalWords, // Set đúng số từ hiện tại
        status: 'not_started'
      });

      await progress.save();
    } else {
      // SYNC: Nếu progress đã tồn tại, sync lại totalWordsInTopic
      const topic = await Topic.findById(topicId);
      const currentTotalWords = topic?.words?.length || 0;
      
      if (progress.totalWordsInTopic !== currentTotalWords) {
        progress.totalWordsInTopic = currentTotalWords;
        
        // Recalculate completion rate
        if (currentTotalWords > 0) {
          progress.completionRate = Math.round(
            (progress.totalWordsLearned / currentTotalWords) * 100
          );
        }
        
        await progress.save();
      }
    }

    return progress;
  } catch (error) {
    console.error('Error in getOrCreateProgress:', error);
    throw error;
  }
};

// Update progress khi user học xong 1 từ
export const updateWordProgress = async (userId, courseId, topicId, wordId, isCorrect) => {
  try {
    const progress = await getOrCreateProgress(userId, courseId, topicId);

    // Mark word as completed
    progress.markWordAsCompleted(wordId, isCorrect);

    await progress.save();

    return {
      success: true,
      data: {
        totalWordsLearned: progress.totalWordsLearned,
        totalWordsInTopic: progress.totalWordsInTopic,
        completionRate: progress.completionRate,
        status: progress.status
      }
    };
  } catch (error) {
    console.error('Error in updateWordProgress:', error);
    throw error;
  }
};

// Lấy progress của 1 topic
export const getTopicProgress = async (userId, courseId, topicId) => {
  try {
    const progress = await UserProgress.findOne({ userId, courseId, topicId })
      .populate('topicId', 'name description')
      .lean();

    if (!progress) {
      return {
        totalWordsLearned: 0,
        totalWordsInTopic: 0,
        completionRate: 0,
        status: 'not_started'
      };
    }

    return progress;
  } catch (error) {
    console.error('Error in getTopicProgress:', error);
    throw error;
  }
};

// Lấy progress của toàn bộ course
export const getCourseProgress = async (userId, courseId) => {
  try {
    const allProgress = await UserProgress.find({ userId, courseId })
      .populate('topicId', 'name')
      .lean();

    // Tính tổng số từ đã học trong course
    const totalWordsLearned = allProgress.reduce(
      (sum, p) => sum + p.totalWordsLearned, 
      0
    );

    // Lấy tất cả topics trong course để tính tổng từ
    const course = await Course.findById(courseId).populate('topics');
    const totalWordsInCourse = course?.topics?.reduce(
      (sum, topic) => sum + (topic.words?.length || 0),
      0
    ) || 0;

    const completionRate = totalWordsInCourse > 0 
      ? Math.round((totalWordsLearned / totalWordsInCourse) * 100)
      : 0;

    return {
      success: true,
      data: {
        totalWordsLearned,
        totalWordsInCourse,
        completionRate,
        topicsProgress: allProgress
      }
    };
  } catch (error) {
    console.error('Error in getCourseProgress:', error);
    throw error;
  }
};

// Lấy overview của tất cả courses
export const getAllCoursesProgress = async (userId) => {
  try {
    const allProgress = await UserProgress.find({ userId })
      .populate('courseId', 'title coverImage')
      .populate('topicId', 'name')
      .lean();

    // Group by courseId
    const progressByCourse = allProgress.reduce((acc, progress) => {
      const courseId = progress.courseId._id.toString();
      
      if (!acc[courseId]) {
        acc[courseId] = {
          courseId: progress.courseId._id,
          courseTitle: progress.courseId.title,
          courseCoverImage: progress.courseId.coverImage,
          totalWordsLearned: 0,
          topics: []
        };
      }

      acc[courseId].totalWordsLearned += progress.totalWordsLearned;
      acc[courseId].topics.push({
        topicId: progress.topicId._id,
        topicName: progress.topicId.name,
        totalWordsLearned: progress.totalWordsLearned,
        completionRate: progress.completionRate,
        status: progress.status
      });

      return acc;
    }, {});

    return {
      success: true,
      data: Object.values(progressByCourse)
    };
  } catch (error) {
    console.error('Error in getAllCoursesProgress:', error);
    throw error;
  }
};