// server/middleware/auth.js
const admin = require('firebase-admin');
const User = require('../models/User');

console.log('Firebase 설정 확인:');
console.log('- Project ID:', process.env.FIREBASE_PROJECT_ID ? '설정됨' : '없음');
console.log('- Client Email:', process.env.FIREBASE_CLIENT_EMAIL ? '설정됨' : '없음');
console.log('- Private Key:', process.env.FIREBASE_PRIVATE_KEY ? '설정됨' : '없음');

// Firebase 초기화 - 실제 값으로 대체 필요
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
    console.log('Firebase Admin SDK 초기화 성공');
  }
} catch (error) {
  console.error('Firebase Admin SDK 초기화 오류:', error);
}

// 사용자 인증 미들웨어
const authenticateUser = async (req, res, next) => {
  try {
    console.log('\n===============================');
    console.log('🔐 인증 미들웨어 시작');
    console.log('📍 요청 경로:', req.path);
    console.log('📝 요청 메서드:', req.method);
    console.log('🔑 요청 헤더:', JSON.stringify({
      authorization: req.headers.authorization ? '존재함' : '없음',
      contentType: req.headers['content-type']
    }, null, 2));
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('❌ Authorization 헤더 없음');
      return res.status(401).json({ 
        message: '인증 토큰이 필요합니다.',
        error: 'NO_AUTH_HEADER'
      });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      console.log('❌ 잘못된 토큰 형식');
      return res.status(401).json({ 
        message: '잘못된 인증 토큰 형식입니다.',
        error: 'INVALID_TOKEN_FORMAT'
      });
    }
    
    const token = authHeader.split('Bearer ')[1];
    console.log('✅ 토큰 추출됨:', token.substring(0, 10) + '...');
    
    try {
      console.log('🔍 토큰 검증 시도 중...');
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('✅ 토큰 검증 성공:', {
        uid: decodedToken.uid,
        email: decodedToken.email
      });
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || '',
        picture: decodedToken.picture || ''
      };
      
      // 사용자 정보 DB에 저장 또는 업데이트
      try {
        await User.findOneAndUpdate(
          { uid: decodedToken.uid },
          {
            email: decodedToken.email,
            displayName: decodedToken.name || '',
            $setOnInsert: { createdAt: new Date() }
          },
          { upsert: true, new: true }
        );
        console.log('✅ 사용자 정보 DB 업데이트 성공');
      } catch (dbError) {
        console.error('⚠️ 사용자 정보 DB 업데이트 실패:', dbError);
        // DB 오류는 인증 실패로 처리하지 않음
      }
      
      console.log('✅ 인증 미들웨어 완료');
      console.log('===============================\n');
      next();
    } catch (error) {
      console.error('❌ 토큰 검증 실패:', {
        code: error.code,
        message: error.message
      });
      
      if (error.code === 'auth/id-token-expired') {
        return res.status(401).json({ 
          message: '인증 토큰이 만료되었습니다.',
          error: 'TOKEN_EXPIRED'
        });
      }
      
      return res.status(403).json({ 
        message: '유효하지 않은 인증 토큰입니다.',
        error: error.code || 'INVALID_TOKEN'
      });
    }
  } catch (error) {
    console.error('❌ 인증 미들웨어 오류:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다.',
      error: 'SERVER_ERROR'
    });
  }
};

module.exports = { authenticateUser };