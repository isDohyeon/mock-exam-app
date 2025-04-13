// server/routes/resultRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const ExamResult = require('../models/ExamResult');
const { authenticateUser } = require('../middleware/auth');

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateUser);

// 내 시험 결과 목록 가져오기
router.get('/my', async (req, res) => {
  try {
    const results = await ExamResult.find({ userId: req.user.uid })
      .populate('examId')
      .sort({ date: -1 });
    res.json(results);
  } catch (error) {
    console.error('결과 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 시험 결과 상세 정보 가져오기
router.get('/:resultId', async (req, res) => {
  try {
    console.log('=== 결과 상세 조회 ===');
    const resultId = req.params.resultId;
    console.log('결과 ID:', resultId);
    
    // ID 유효성 검사 추가
    if (!resultId || resultId === 'undefined') {
      console.log('❌ 유효하지 않은 결과 ID');
      return res.status(400).json({ 
        message: '유효한 결과 ID가 제공되지 않았습니다.' 
      });
    }
    
    // ObjectId 유효성 검사
    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      console.log('❌ 유효하지 않은 ObjectId 형식');
      return res.status(400).json({ 
        message: '유효하지 않은 결과 ID 형식입니다.' 
      });
    }
    
    const result = await ExamResult.findById(resultId);
    
    if (!result) {
      console.log('❌ 결과를 찾을 수 없음');
      return res.status(404).json({ message: '결과를 찾을 수 없습니다.' });
    }
    
    // 결과가 현재 사용자의 것인지 확인
    if (result.userId !== req.user.uid) {
      console.log('❌ 권한 없음');
      return res.status(403).json({ message: '이 결과를 볼 권한이 없습니다.' });
    }
    
    console.log('✅ 결과 조회 성공');
    res.json(result);
  } catch (error) {
    console.error('결과 상세 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// server/routes/resultRoutes.js에 추가
// 결과 삭제하기
router.delete('/:resultId', async (req, res) => {
  try {
    console.log('\n=== 결과 삭제 요청 ===');
    const resultId = req.params.resultId;
    console.log('결과 ID:', resultId);
    console.log('사용자 ID:', req.user.uid);
    
    // ID 유효성 검사
    if (!resultId || resultId === 'undefined') {
      console.log('❌ 유효하지 않은 결과 ID');
      return res.status(400).json({ 
        message: '유효한 결과 ID가 제공되지 않았습니다.' 
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      console.log('❌ 유효하지 않은 ObjectId 형식');
      return res.status(400).json({ 
        message: '유효하지 않은 결과 ID 형식입니다.' 
      });
    }
    
    const result = await ExamResult.findById(resultId);
    
    if (!result) {
      console.log('❌ 결과를 찾을 수 없음');
      return res.status(404).json({ message: '결과를 찾을 수 없습니다.' });
    }
    
    // 사용자 권한 확인
    if (result.userId !== req.user.uid) {
      console.log('❌ 권한 없음');
      return res.status(403).json({ message: '이 결과를 삭제할 권한이 없습니다.' });
    }
    
    await result.deleteOne();
    console.log('✅ 결과 삭제 성공');
    res.json({ message: '결과가 삭제되었습니다.' });
  } catch (error) {
    console.error('결과 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;