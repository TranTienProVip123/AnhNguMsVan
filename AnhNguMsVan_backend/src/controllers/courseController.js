import { validationResult } from "express-validator";
import { listCourses, createCourse, updateCourse, deleteCourse } from "../services/courseService.js";

export const getCourses = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: errors.array(),
    });
  }

  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const { type, topic, category, level } = req.query;
    const result = await listCourses({ page, limit, type, topic, category, level });
    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const createCourseController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: errors.array(),
    });
  }

  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      topic: req.body.topic,
      category: req.body.category,
      level: req.body.level,
      coverImage: req.body.coverImage,
      isPro: req.body.isPro ?? false,
      isPublished: req.body.isPublished ?? false,
      stats: {
        wordCount: req.body.stats?.wordCount ?? 0,
        learnerCount: req.body.stats?.learnerCount ?? 0,
      },
      createdBy: req.user?.userId,
    };

    const { course } = await createCourse(payload);
    return res.status(201).json({
      success: true,
      message: "Tạo course thành công",
      data: { course },
    });
  } catch (err) {
    next(err);
  }
};

export const updateCourseController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: errors.array(),
    });
  }

  try {
    const { id } = req.params;
    const result = await updateCourse( id, req.body );
    if (result.reason === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Course không tồn tại",
      });
    }
    return res.json({
      success: true,
      message: "Cập nhật course thành công",
      data: { course: result.course },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCourseController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteCourse(id);
    if (result.reason === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Course không tồn tại",
      });
    }
    return res.json({
      success: true,
      message: "Xóa course thành công",
    });
  } catch (err) {
    next(err);
  }
};
