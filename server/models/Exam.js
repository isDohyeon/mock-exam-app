// server/models/Exam.js
// 시험 모델 정의
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  creator: {
    type: String,  // Firebase UID
    required: true,
    ref: 'User'
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  isPublic: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Exam', examSchema);

