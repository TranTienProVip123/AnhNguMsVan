import {
  updateWordProgress,
  getTopicProgress,
  getCourseProgress,
  getAllCoursesProgress
} from '../services/progressService.js';

// POST /api/progress/word - Update progress khi học xong 1 từ
export const updateWordProgressController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // VALIDATION: Kiểm tra userId
    if (!userId) {
      console.error('❌ [CONTROLLER] No userId - req.user:', req.user);
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No user ID found'
      });
    }

    console.log('✅ [CONTROLLER] userId:', userId);
    const { courseId, topicId, wordId, isCorrect } = req.body;

    if (!courseId || !topicId || !wordId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin courseId, topicId hoặc wordId'
      });
    }

    const result = await updateWordProgress(
      userId,
      courseId,
      topicId,
      wordId,
      isCorrect || false
    );

    return res.json(result);

  } catch (error) {
    next(error);
  }
};

// GET /api/progress/topic/:topicId - Lấy progress của 1 topic
export const getTopicProgressController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { topicId } = req.params;
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu courseId trong query'
      });
    }

    const progress = await getTopicProgress(userId, courseId, topicId);

    return res.json({
      success: true,
      data: progress
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/progress/course/:courseId - Lấy progress của course
export const getCourseProgressController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    const result = await getCourseProgress(userId, courseId);

    return res.json(result);

  } catch (error) {
    next(error);
  }
};

// GET /api/progress/overview - Lấy tổng quan tất cả courses
export const getOverviewProgressController = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await getAllCoursesProgress(userId);

    return res.json(result);

  } catch (error) {
    next(error);
  }
};