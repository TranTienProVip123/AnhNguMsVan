import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  
  // Thống kê từ vựng
  completedWords: [{
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
  }],
  
  // Tổng số từ đã học của topic này
  totalWordsLearned: {
    type: Number,
    default: 0
  },
  
  // Tổng số từ trong topic
  totalWordsInTopic: {
    type: Number,
    default: 0
  },
  
  // Phần trăm hoàn thành
  completionRate: {
    type: Number,
    default: 0
  },
  
  // Trạng thái topic
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  
  // Thời gian
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date

}, { 
  timestamps: true 
});

// Index để tăng hiệu suất query
userProgressSchema.index({ userId: 1, courseId: 1, topicId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, courseId: 1 });

// Method: Update progress khi user học xong 1 từ
userProgressSchema.methods.markWordAsCompleted = function(wordId, isCorrectFirstTime = false) {
  // Kiểm tra từ đã học chưa
  const existingWord = this.completedWords.find(
    w => w.wordId.toString() === wordId.toString()
  );

  if (existingWord) {
    // Đã học rồi, tăng attempts
    existingWord.attempts += 1;
  } else {
    // Chưa học, thêm mới
    this.completedWords.push({
      wordId,
      isCorrectFirstTime,
      attempts: 1
    });
    this.totalWordsLearned += 1;
  }

  // Update completion rate
  if (this.totalWordsInTopic > 0) {
    this.completionRate = Math.round(
      (this.totalWordsLearned / this.totalWordsInTopic) * 100
    );
  }

  // Update status
  if (this.completionRate === 100) {
    this.status = 'completed';
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  } else if (this.totalWordsLearned > 0) {
    this.status = 'in_progress';
  }

  this.lastAccessedAt = new Date();
};

export default mongoose.model('UserProgress', userProgressSchema);