import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  english: {
    type: String,
    required: true
  },
  vietnamese: {
    type: String,
    required: true
  },
  phoneticUS: String,
  phoneticUK: String,
  definition: String,
  meaning: String,
  example: String,
  exampleVN: String,
  image: String,
  wordType: {
    type: String,
    enum: ['noun', 'verb', 'adjective', 'adverb', 'other'],
    default: 'noun'
  }
}, { 
  _id: true, // ← Thêm dòng này để tự động tạo _id cho mỗi word
  timestamps: false 
});

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['vocabulary', 'toeic', 'ielts', 'conversation', 'other'],
    default: 'vocabulary'
  },
  words: {
    type: [wordSchema], // Sử dụng wordSchema
    default: []
  },
  totalWords: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Virtual field: progress - Với safe check
topicSchema.virtual('progress').get(function() {
  const total = this.totalWords || 0;
  const learned = this.learnedWords || 0;
  return total > 0 ? Math.round((learned / total) * 100) : 0;
});

// Đảm bảo virtuals được included khi convert to JSON
topicSchema.set('toJSON', { 
  virtuals: true,
  versionKey: false // Ẩn __v field
});

topicSchema.set('toObject', { 
  virtuals: true,
  versionKey: false
});

// Index để tăng performance
topicSchema.index({ name: 1 });
topicSchema.index({ category: 1 });
topicSchema.index({ isActive: 1 });

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
