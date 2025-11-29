import { query } from "express-validator";
import { body, param } from "express-validator";

export const listCourseValidator = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("type").optional().isString().trim(),
  query("topic").optional().isString().trim(),
  query("category").optional().isString().trim(),
  query("level").optional().isString().trim(),
];

export const createCourseValidator = [
  body("title").isLength({ min: 2 }).withMessage("Tiêu đề tối thiểu 2 ký tự"),
  body("type").isString().withMessage("Type bắt buộc"),
  body("topic").optional().isString().trim(),
  body("category").optional().isString().trim(),
  body("level").optional().isString().trim(),
  body("coverImage").optional().isString().trim(),
  body("description").optional().isString(),
  body("isPro").optional().isBoolean(),
  body("isPublished").optional().isBoolean(),
  body("stats.wordCount").optional().isInt({ min: 0 }),
  body("stats.learnerCount").optional().isInt({ min: 0 }),
];

export const updateCourseValidator = [
  param("id").isMongoId(),
  body("title").optional().isLength({ min: 2 }),
  body("type").optional().isString(),
  body("topic").optional().isString().trim(),
  body("category").optional().isString().trim(),
  body("level").optional().isString().trim(),
  body("coverImage").optional().isString().trim(),
  body("description").optional().isString(),
  body("isPro").optional().isBoolean(),
  body("isPublished").optional().isBoolean(),
  body("stats.wordCount").optional().isInt({ min: 0 }),
  body("stats.learnerCount").optional().isInt({ min: 0 }),
];

export const deleteCourseValidator = [
  param("id").isMongoId(),
];

