import { body, param } from 'express-validator';

export const updateUserValidator = [
    param('id').isMongoId().withMessage('User id không hợp lệ'),
    body('name').optional().isLength({ min: 2, max: 50 }).withMessage('Tên 2-50 ký tự'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role không hợp lệ'),
    body('isVerified').optional().isBoolean().withMessage('isVerified phải là boolean'),
];

export const deleteUserValidator = [
    param('id').isMongoId().withMessage('User id không hợp lệ'),
];