const mongoose = require('mongoose');

const answerResultSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
});

const examResultSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  userId: {
    type: String,  // Firebase UID
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  answers: [answerResultSchema],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ExamResult', examResultSchema);
