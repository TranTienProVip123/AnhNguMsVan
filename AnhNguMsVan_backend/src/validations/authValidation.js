import { body } from "express-validator";

export const registerValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage("Email bắt buộc!")
        .bail() //nếu email trống dừng,ko validate tiếp
        .isEmail().withMessage("Email không hợp lệ!")
        .bail()
        .isLength({ max: 100 }).withMessage("Email quá dài!")
        .normalizeEmail(),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Tên bắt buộc!"),

    body('password')
        .isLength({ min: 8, max: 72 }).withMessage('Password ≥ 8 ký tự')
        .matches(/[a-z]/).withMessage('Cần chữ thường')
        .matches(/[A-Z]/).withMessage('Cần chữ hoa')
        .matches(/[0-9]/).withMessage('Cần số')
]