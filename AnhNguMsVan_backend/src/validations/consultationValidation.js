import { body } from "express-validator";

export const consultationValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Họ và tên không được để trống")
    .isLength({ min: 2, max: 100 }).withMessage("Họ và tên phải từ 2–100 ký tự"),

  body("phone")
    .trim()
    .notEmpty().withMessage("Số điện thoại không được để trống")
    .matches(/^0\d{9,10}$/)
    .withMessage("Số điện thoại phải bắt đầu bằng 0 và có 10–11 chữ số.")
];

export const updateStatusValidator = [
  body("status")
    .trim()
    .notEmpty().withMessage("Trạng thái không được để trống")
    .isIn(["new", "contacted", "closed"]).withMessage("Trạng thái không hợp lệ")
];

export const deleteConsultationValidator = [
  body("id")
    .trim()
    .notEmpty().withMessage("ID yêu cầu tư vấn không được để trống")
    .isMongoId().withMessage("ID yêu cầu tư vấn không hợp lệ")
];
