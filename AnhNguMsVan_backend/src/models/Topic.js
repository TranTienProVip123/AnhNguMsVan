import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  english: {
    type: String,
    required: true,
    trim: true
  },
  vietnamese: {
    type: String,
    required: true,
    trim: true
  },
  definition: {
    type: String,
    trim: true
  },
  meaning: {
    type: String,
    trim: true
  },
  example: {
    type: String,
    trim: true
  },
  exampleVN: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  wordType: {
    type: String,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'other'],
    default: 'noun'
  }
}, { _id: false });

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên chủ đề là bắt buộc'],
    trim: true,
    unique: true
  },
  image: {
    type: String,
    required: [true, 'Ảnh chủ đề là bắt buộc'],
    trim: true
  },
  category: {
    type: String,
    enum: ['vocabulary', 'toeic', 'ielts', 'conversation', 'other'],
    default: 'vocabulary'
  },
  totalWords: {
    type: Number,
    default: 0
  },
  words: [wordSchema],
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual field để tính progress cho từng user
topicSchema.virtual('progress').get(function() {
  return this.totalWords > 0 ? Math.round((this.learnedWords / this.totalWords) * 100) : 0;
});

// Update totalWords khi thêm/xóa từ
topicSchema.pre('save', function(next) {
  this.totalWords = this.words.length;
  next();
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;