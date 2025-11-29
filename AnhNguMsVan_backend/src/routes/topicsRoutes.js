import { Router } from "express";
import Topic from '../models/Topic.js';

const router = Router();

// GET: Lấy tất cả topics (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    const filter = { isActive: true };
    if (category) {
      filter.category = category;
    }

    const topics = await Topic.find(filter)
      .select('-words') // Không lấy words để tối ưu performance
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: topics.map(topic => ({
        id: topic._id,
        name: topic.name,
        image: topic.image,
        description: topic.description,
        category: topic.category,
        totalWords: topic.totalWords,
        progress: 0, // TODO: Lấy từ user progress
        learnedWords: 0 // TODO: Lấy từ user progress
      }))
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách chủ đề',
      error: error.message
    });
  }
});

// GET: Lấy chi tiết 1 topic với words
router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chủ đề'
      });
    }

    res.json({
      success: true,
      data: {
        id: topic._id,
        name: topic.name,
        image: topic.image,
        description: topic.description,
        category: topic.category,
        totalWords: topic.totalWords,
        words: topic.words,
        progress: 0, // TODO: Lấy từ user progress
        learnedWords: 0 // TODO: Lấy từ user progress
      }
    });
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin chủ đề',
      error: error.message
    });
  }
});

// POST: Tạo topic mới (chỉ admin)
router.post('/', async (req, res) => {
  try {
    const { name, image, description, category } = req.body;

    // Validation
    if (!name || !image) {
      return res.status(400).json({
        success: false,
        message: 'Tên và ảnh chủ đề là bắt buộc'
      });
    }

    // Kiểm tra trùng tên
    const existingTopic = await Topic.findOne({ name });
    if (existingTopic) {
      return res.status(400).json({
        success: false,
        message: 'Chủ đề này đã tồn tại'
      });
    }

    // Tạo topic mới
    const newTopic = new Topic({
      name,
      image,
      description,
      category: category || 'vocabulary',
      // createdBy: req.user.userId,
      words: []
    });

    await newTopic.save();

    res.status(201).json({
      success: true,
      message: 'Tạo chủ đề thành công',
      data: {
        id: newTopic._id,
        name: newTopic.name,
        image: newTopic.image,
        description: newTopic.description,
        category: newTopic.category,
        totalWords: newTopic.totalWords,
        progress: 0,
        learnedWords: 0
      }
    });
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo chủ đề',
      error: error.message
    });
  }
});

// PUT: Cập nhật topic (chỉ admin)
router.put('/:id', async (req, res) => {
  try {
    const { name, image, description, category, isActive } = req.body;

    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chủ đề'
      });
    }

    // Cập nhật thông tin
    if (name) topic.name = name;
    if (image) topic.image = image;
    if (description !== undefined) topic.description = description;
    if (category) topic.category = category;
    if (isActive !== undefined) topic.isActive = isActive;

    await topic.save();

    res.json({
      success: true,
      message: 'Cập nhật chủ đề thành công',
      data: topic
    });
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật chủ đề',
      error: error.message
    });
  }
});

// DELETE: Xóa topic (chỉ admin)
router.delete('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chủ đề'
      });
    }

    // Soft delete
    topic.isActive = false;
    await topic.save();

    res.json({
      success: true,
      message: 'Xóa chủ đề thành công'
    });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa chủ đề',
      error: error.message
    });
  }
});

// POST: Thêm từ vào topic (chỉ admin)
router.post('/:id/words', async (req, res) => {
  try {
    const { english, vietnamese, definition, meaning, example, exampleVN, image, wordType } = req.body;

    if (!english || !vietnamese) {
      return res.status(400).json({
        success: false,
        message: 'Từ tiếng Anh và nghĩa tiếng Việt là bắt buộc'
      });
    }

    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chủ đề'
      });
    }

    topic.words.push({
      english,
      vietnamese,
      definition,
      meaning,
      example,
      exampleVN,
      image,
      wordType: wordType || 'noun'
    });

    await topic.save();

    res.status(201).json({
      success: true,
      message: 'Thêm từ vựng thành công',
      data: topic
    });
  } catch (error) {
    console.error('Error adding word:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm từ vựng',
      error: error.message
    });
  }
});

export default router;