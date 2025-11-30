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

    // Hard delete - Xóa hẳn khỏi database
    await Topic.findByIdAndDelete(req.params.id);

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

// PUT: Cập nhật word trong topic
router.put('/:topicId/words/:wordId', async (req, res) => {
  try {
    const { topicId, wordId } = req.params;
    const { english, vietnamese, definition, meaning, example, exampleVN, image, wordType } = req.body;

    // console.log('Update word - topicId:', topicId, 'wordId:', wordId); // Debug log

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chủ đề'
      });
    }

    // console.log('Topic found, total words:', topic.words.length); // Debug log

    // Tìm word theo _id
    const wordIndex = topic.words.findIndex(w => {
      console.log('Checking word:', w._id ? w._id.toString() : 'NO ID'); // Debug log
      return w._id && w._id.toString() === wordId;
    });

    // console.log('Word index found:', wordIndex); // Debug log

    if (wordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy từ vựng',
        debug: {
          wordId,
          availableIds: topic.words.map(w => w._id ? w._id.toString() : 'NO_ID')
        }
      });
    }

    // Cập nhật word - Giữ nguyên _id
    const existingWord = topic.words[wordIndex];
    topic.words[wordIndex] = {
      _id: existingWord._id, // ← Quan trọng: giữ lại _id
      english: english || existingWord.english,
      vietnamese: vietnamese || existingWord.vietnamese,
      definition: definition !== undefined ? definition : existingWord.definition,
      meaning: meaning !== undefined ? meaning : existingWord.meaning,
      example: example !== undefined ? example : existingWord.example,
      exampleVN: exampleVN !== undefined ? exampleVN : existingWord.exampleVN,
      image: image || existingWord.image,
      wordType: wordType || existingWord.wordType
    };

    await topic.save();

    res.json({
      success: true,
      message: 'Cập nhật từ vựng thành công',
      data: topic.words[wordIndex]
    });
  } catch (error) {
    console.error('Error updating word:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật từ vựng',
      error: error.message
    });
  }
});

// Delete word khỏi topic
router.delete('/:topicId/words/:wordId', async (req, res) => {
  try {
    const { topicId, wordId } = req.params;

    // console.log('Delete word - topicId:', topicId, 'wordId:', wordId);

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chủ đề'
      });
    }

    const wordIndex = topic.words.findIndex(w => 
      w._id && w._id.toString() === wordId
    );

    if (wordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy từ vựng'
      });
    }

    // Lưu lại thông tin word trước khi xóa
    const deletedWord = topic.words[wordIndex];

    // Xóa word khỏi array
    topic.words.splice(wordIndex, 1);

    await topic.save();

    res.json({
      success: true,
      message: 'Xóa từ vựng thành công',
      data: {
        deletedWord,
        remainingWords: topic.words.length
      }
    });
  } catch (error) {
    console.error('Error deleting word:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa từ vựng',
      error: error.message
    });
  }
});


export default router;