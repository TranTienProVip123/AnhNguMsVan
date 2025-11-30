import { query, body, param } from "express-validator";

export const listCourseValidator = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("type").optional().isString().trim(),
];

export const createCourseValidator = [
  body("title").isLength({ min: 2 }).withMessage("Tiêu đề tối thiểu 2 ký tự"),
  body("type").isString().withMessage("Type bắt buộc"),
  body("coverImage").optional().isString().trim(),
  body("description").optional().isString(),
  body("isPublished").optional().isBoolean(),
  body("topics").optional().isArray(),
  body("topics.*").optional().isMongoId(),
  body("stats.wordCount").optional().isInt({ min: 0 }),
  body("stats.learnerCount").optional().isInt({ min: 0 }),
];

export const updateCourseValidator = [
  param("id").isMongoId(),
  body("title").optional().isLength({ min: 2 }),
  body("type").optional().isString(),
  body("coverImage").optional().isString().trim(),
  body("description").optional().isString(),
  body("isPublished").optional().isBoolean(),
  body("topics").optional().isArray(),
  body("topics.*").optional().isMongoId(),
  body("stats.wordCount").optional().isInt({ min: 0 }),
  body("stats.learnerCount").optional().isInt({ min: 0 }),
];

export const deleteCourseValidator = [param("id").isMongoId()];

export const getCourseDetailValidator = [param("id").isMongoId()];
