import { validationResult } from 'express-validator';
import {
    listTopics, getTopicDetail, createTopic, updateTopic, softDeleteTopic, addWordToTopic , updateWordInTopic, deleteWordInTopic
} from '../services/topicService.js';

export const getTopics = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: errors.array() });
    try {
        const data = await listTopics({ category: req.query.category });
        return res.json({ success: true, data });
    } catch (err) { next(err); }
};

export const getTopic = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: errors.array() });
    try {
        const result = await getTopicDetail(req.params.id);
        if (result.reason === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Không tìm thấy chủ đề' });
        return res.json({ success: true, data: result.topic });
    } catch (err) { next(err); }
};

export const createTopicController = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: errors.array() });
    try {
        const result = await createTopic(req.body);
        // if (result.reason === 'DUPLICATE') return res.status(400).json({ success: false, message: 'Chủ đề này đã tồn tại' });
        return res.status(201).json({ success: true, message: 'Tạo chủ đề thành công', data: result.topic });
    } catch (err) { next(err); }
};

export const updateTopicController = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: errors.array() });
    try {
        const result = await updateTopic(req.params.id, req.body);
        if (result.reason === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Không tìm thấy chủ đề' });
        return res.json({ success: true, message: 'Cập nhật chủ đề thành công', data: result.topic });
    } catch (err) { next(err); }
};

export const deleteTopicController = async (req, res, next) => {
    try {
        const result = await softDeleteTopic(req.params.id);
        if (result.reason === 'NOT_FOUND') return res.status(404).json({ success: false, message: 'Không tìm thấy chủ đề' });
        return res.json({ success: true, message: 'Xóa chủ đề thành công' });
    } catch (err) { next(err); }
};

export const addWordController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await addWordToTopic(id, req.body);
    if (result.reason === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chủ đề' });
    }
    return res.status(201).json({ success: true, message: 'Thêm từ vựng thành công', data: result.topic });
  } catch (err) { next(err); }
};

export const updateWordController = async (req, res, next) => {
  try {
    const { topicId, wordId } = req.params;
    const result = await updateWordInTopic(topicId, wordId, req.body);

    if (result.reason === 'NOT_FOUND_TOPIC') {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chủ đề' });
    }

    if (result.reason === 'NOT_FOUND_WORD') {
      return res.status(404).json({ success: false, message: 'Không tìm thấy từ vựng' });
    }

    return res.json({
      success: true,
      message: 'Cập nhật từ vựng thành công',
      data: result.word
    });

  } catch (err) {
    next(err);
  }
};

export const deleteWordController = async (req, res, next) => {
  try {
    const { topicId, wordId } = req.params;
    const result = await deleteWordInTopic(topicId, wordId);

    if (result.reason === 'NOT_FOUND_TOPIC') {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chủ đề' });
    }

    if (result.reason === 'NOT_FOUND_WORD') {
      return res.status(404).json({ success: false, message: 'Không tìm thấy từ vựng' });
    }

    return res.json({
      success: true,
      message: 'Xóa từ vựng thành công',
      data: {
        deletedWord: result.deletedWord,
        remainingWords: result.remaining
      }
    });

  } catch (err) {
    next(err);
  }
};
