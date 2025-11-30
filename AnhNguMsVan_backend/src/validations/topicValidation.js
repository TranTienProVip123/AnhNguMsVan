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

export const addWordValidator = [
  param('id').isMongoId(),
  body('english').isString().trim().notEmpty().withMessage('english là bắt buộc'),
  body('vietnamese').isString().trim().notEmpty().withMessage('vietnamese là bắt buộc'),
  body('definition').optional().isString(),
  body('meaning').optional().isString(),
  body('example').optional().isString(),
  body('exampleVN').optional().isString(),
  body('image').optional().isString(),
  body('wordType')
    .optional()
    .isIn(['noun', 'verb', 'adjective', 'adverb', 'other'])
    .withMessage('wordType không hợp lệ')
];

export const updateWordValidator = [
  param('id').isMongoId(),
  param('index').isInt({ min: 0 }).toInt(),
  body('english').optional().isString().trim().notEmpty(),
  body('vietnamese').optional().isString().trim().notEmpty(),
  body('definition').optional().isString(),
  body('meaning').optional().isString(),
  body('example').optional().isString(),
  body('exampleVN').optional().isString(),
  body('image').optional().isString(),
  body('wordType').optional().isIn(['noun','verb','adjective','adverb','other'])
];

export const deleteWordValidator = [
  param('id').isMongoId(),
  param('index').isInt({ min: 0 }).toInt()
];

export const deleteTopicValidator = [param('id').isMongoId()];
