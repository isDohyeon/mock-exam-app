// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const examRoutes = require('./routes/examRoutes');
const resultRoutes = require('./routes/resultRoutes');

// 로그 디렉토리 생성
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 로그 파일 생성
const logFile = path.join(logDir, `server-${new Date().toISOString().split('T')[0]}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// 로그 함수
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  logStream.write(logMessage);
};

const app = express();
const PORT = process.env.PORT;

// CORS 설정
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  optionsSuccessStatus: 200
};

// 모든 라우트에 CORS 적용
app.use(cors(corsOptions));

// OPTIONS 요청에 대한 프리플라이트 처리
app.options('*', cors(corsOptions));

// Express 미들웨어
app.use(express.json());

// 로깅 미들웨어
app.use((req, res, next) => {
  log('\n=== 새로운 요청 ===');
  log(`시간: ${new Date().toISOString()}`);
  log(`메서드: ${req.method}`);
  log(`URL: ${req.url}`);
  log(`Origin: ${req.headers.origin || 'N/A'}`);
  log(`헤더: ${JSON.stringify(req.headers, null, 2)}`);
  if (req.method !== 'OPTIONS') {
    log(`바디: ${JSON.stringify(req.body, null, 2)}`);
  }
  next();
});

// 데이터베이스 연결
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => log('MongoDB에 연결되었습니다.'))
  .catch((err) => log(`MongoDB 연결 오류: ${err.message}`));

// API 라우트
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('모의고사 앱 API 서버가 실행 중입니다.');
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  log(`서버 오류: ${err.stack || err.message}`);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
  log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});