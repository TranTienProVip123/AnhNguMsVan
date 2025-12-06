import mongoose from 'mongoose';

// Schema cho từng từ đã học
const completedWordSchema = new mongoose.Schema({
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  attempts: {
    type: Number,
    default: 1
  },
  isCorrectFirstTime: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const topicProgressSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },

  // danh sách từ đã học trong topic này
  completedWords: [completedWordSchema],  // Số từ đã học

  totalWordsInTopic: {
    type: Number,
    default: 0
  },

  // Thời gian
  startedAt: Date,
  lastAccessedAt: Date,
  completedAt: Date
}, { _id: false }); // <-- Không cần _id cho từng topic progress
  

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true, // mỗi user chỉ có 1 bản ghi tiến độ
    required: true
  },

  // Object lưu progress của từng topic
  topics: {
    type: Map,
    of: topicProgressSchema,
    default: {}
  },

}, {
  timestamps: true
});

// Index để tăng hiệu suất query
userProgressSchema.index({ userId: 1}, { unique: true });

export default mongoose.model('UserProgress', userProgressSchema);