// server/routes/examRoutes.js
// 시험 라우트 정의
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const Exam = require('../models/Exam');
const ExamResult = require('../models/ExamResult');
const { authenticateUser } = require('../middleware/auth');

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateUser);

// 내 시험 목록 가져오기
router.get('/my', async (req, res) => {
  try {
    console.log('\n=== 내 시험 목록 요청 ===');
    console.log('사용자 ID:', req.user.uid);
    
    const exams = await Exam.find({ creator: req.user.uid });
    console.log('조회된 시험 수:', exams.length);
    res.json(exams);
  } catch (error) {
    console.error('시험 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 시험 생성하기
router.post('/', async (req, res) => {
  try {
    console.log('\n=== 시험 생성 요청 ===');
    console.log('요청 헤더:', req.headers);
    console.log('요청 바디:', JSON.stringify(req.body, null, 2));
    console.log('사용자 정보:', req.user);
    
    const { title, questions } = req.body;
    
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      console.log('❌ 유효하지 않은 요청 데이터');
      return res.status(400).json({ message: '제목과 최소 1개의 문제가 필요합니다.' });
    }
    
    const newExam = new Exam({
      title,
      creator: req.user.uid,
      questions
    });
    
    console.log('새 시험 데이터:', JSON.stringify(newExam, null, 2));
    
    await newExam.save();
    console.log('✅ 시험 저장 성공');
    res.status(201).json(newExam);
  } catch (error) {
    console.error('시험 생성 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 시험 상세 정보 가져오기
router.get('/:examId', async (req, res) => {
  try {
    console.log('\n=== 시험 상세 정보 요청 ===');
    const examId = req.params.examId;
    console.log('시험 ID:', examId);
    console.log('사용자 ID:', req.user.uid);
    
    // ID 유효성 검사 추가
    if (!examId || examId === 'undefined') {
      console.log('❌ 유효하지 않은 시험 ID');
      return res.status(400).json({ 
        message: '유효한 시험 ID가 제공되지 않았습니다.' 
      });
    }
    
    // ObjectId 유효성 검사
    if (!mongoose.Types.ObjectId.isValid(examId)) {
      console.log('❌ 유효하지 않은 ObjectId 형식');
      return res.status(400).json({ 
        message: '유효하지 않은 시험 ID 형식입니다.' 
      });
    }
    
    const exam = await Exam.findById(examId);
    
    if (!exam) {
      console.log('❌ 시험을 찾을 수 없음');
      return res.status(404).json({ message: '시험을 찾을 수 없습니다.' });
    }
    
    console.log('✅ 시험 조회 성공');
    res.json(exam);
  } catch (error) {
    console.error('시험 상세 정보 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 시험 수정하기
router.put('/:examId', async (req, res) => {
  try {
    console.log('\n=== 시험 수정 요청 ===');
    console.log('시험 ID:', req.params.examId);
    console.log('사용자 ID:', req.user.uid);
    console.log('수정 데이터:', JSON.stringify(req.body, null, 2));
    
    const exam = await Exam.findById(req.params.examId);
    
    if (!exam) {
      console.log('❌ 시험을 찾을 수 없음');
      return res.status(404).json({ message: '시험을 찾을 수 없습니다.' });
    }
    
    if (exam.creator.toString() !== req.user.uid) {
      console.log('❌ 권한 없음');
      return res.status(403).json({ message: '이 시험을 수정할 권한이 없습니다.' });
    }
    
    const { title, questions } = req.body;
    
    // 제목이 제공된 경우에만 업데이트
    if (title) {
      exam.title = title;
    }
    
    // 문제가 제공된 경우에만 업데이트
    if (questions && Array.isArray(questions)) {
      // 기존 문제 업데이트 및 새 문제 추가
      questions.forEach((newQuestion, index) => {
        if (newQuestion._id) {
          // 기존 문제 수정
          const existingQuestion = exam.questions.id(newQuestion._id);
          if (existingQuestion) {
            existingQuestion.question = newQuestion.question || existingQuestion.question;
            existingQuestion.options = newQuestion.options || existingQuestion.options;
            existingQuestion.correctAnswer = newQuestion.correctAnswer || existingQuestion.correctAnswer;
          }
        } else {
          // 새 문제 추가
          exam.questions.push(newQuestion);
        }
      });
    }
    
    await exam.save();
    console.log('✅ 시험 수정 성공');
    res.json(exam);
  } catch (error) {
    console.error('시험 수정 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 시험 삭제하기
router.delete('/:examId', async (req, res) => {
  try {
    console.log('\n=== 시험 삭제 요청 ===');
    console.log('시험 ID:', req.params.examId);
    console.log('사용자 ID:', req.user.uid);
    
    const exam = await Exam.findById(req.params.examId);
    
    if (!exam) {
      console.log('❌ 시험을 찾을 수 없음');
      return res.status(404).json({ message: '시험을 찾을 수 없습니다.' });
    }
    
    if (exam.creator.toString() !== req.user.uid) {
      console.log('❌ 권한 없음');
      return res.status(403).json({ message: '이 시험을 삭제할 권한이 없습니다.' });
    }
    
    await exam.deleteOne();
    console.log('✅ 시험 삭제 성공');
    res.json({ message: '시험이 삭제되었습니다.' });
  } catch (error) {
    console.error('시험 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 시험 결과 제출
router.post('/:id/results', async (req, res) => {
  try {
    const examId = req.params.id;
    const exam = await Exam.findById(examId);
    
    if (!exam) {
      return res.status(404).json({ message: '시험을 찾을 수 없습니다.' });
    }
    
    const { answers, score, totalQuestions } = req.body;
    
    const newResult = new ExamResult({
      examId,
      userId: req.user.uid,
      score,
      totalQuestions,
      answers
    });
    
    await newResult.save();
    res.status(201).json(newResult);
  } catch (error) {
    console.error('시험 결과 저장 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 오답 모의고사 생성
router.post('/incorrect/:resultId', async (req, res) => {
  try {
    const result = await ExamResult.findById(req.params.resultId);
    
    if (!result) {
      return res.status(404).json({ message: '결과를 찾을 수 없습니다.' });
    }

    // 틀린 문제만 추출
    const incorrectQuestions = result.answers
      .filter(answer => !answer.isCorrect)
      .map(answer => ({
        question: answer.question,
        options: answer.options, // 문제 옵션도 포함
        correctAnswer: answer.correctAnswer,
        answer: answer.correctAnswer // 스키마 요구사항 충족을 위해 추가
      }));
      
    // 오답이 없는 경우
    if (incorrectQuestions.length === 0) {
      return res.status(400).json({ 
        message: '틀린 문제가 없습니다. 모든 문제를 맞추셨습니다!' 
      });
    }

    // 새로운 임시 시험을 생성
    const newExam = new Exam({
      title: `오답 모의고사 (${new Date().toLocaleDateString()})`,
      creator: req.user.uid,
      questions: incorrectQuestions,
      isIncorrectExam: true, // 오답 모의고사임을 표시
      originalExamResultId: result._id // 원본 결과 ID 저장
    });
    
    await newExam.save();
    
    // 저장된 시험 ID 반환
    res.status(201).json({
      message: '오답 모의고사가 생성되었습니다.',
      _id: newExam._id,
      questionCount: incorrectQuestions.length
    });
  } catch (error) {
    console.error('오답 모의고사 생성 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});
module.exports = router;