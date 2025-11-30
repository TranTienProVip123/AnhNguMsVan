import { query, body, param } from 'express-validator';

export const listTopicValidator = [
    query('category').optional().isString().trim()
];
export const getTopicValidator = [param('id').isMongoId()];
export const createTopicValidator = [
    body('name').isLength({ min: 2 }),
    body('image').isString(),
    body('description').optional().isString(),
    body('category').optional().isString()
];
export const updateTopicValidator = [
    param('id').isMongoId(),
    body('name').optional().isLength({ min: 2 }),
    body('image').optional().isString(),
    body('description').optional().isString(),
    body('category').optional().isString(),
    body('isActive').optional().isBoolean()
];
export const deleteTopicValidator = [param('id').isMongoId()];
