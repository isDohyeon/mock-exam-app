# 📘 나만의 모의고사 (Mock Exam App)

"나만의 모의고사"는 사용자가 직접 시험 문제를 생성하고 응시하며, 오답을 복습할 수 있는 웹 기반 모의고사 플랫폼입니다.  
React + Firebase + Node.js + MongoDB를 활용하여 풀스택 환경으로 구축되었습니다.

---

## 🔍 주요 기능

- 🔐 **Firebase 로그인** (Google 계정 인증)
- 📝 **시험 문제 생성** (제목, 문제, 정답 입력)
- 📚 **시험 응시 및 결과 확인**
- ❌ **오답 모의고사 생성 및 복습**
- 📊 **내 시험 및 결과 목록 확인**
- 🎨 **Tailwind CSS** 기반 반응형 UI

---

## 🧱 기술 스택

|    프론트엔드   |        백엔드      |          인증/DB           |
|--------------|-------------------|---------------------------|
| React 19     | Node.js + Express | Firebase Authentication |
| Tailwind CSS |     REST API      |    MongoDB + Mongoose   |

---

## 📁 프로젝트 구조
```bash
├── client/              # React 프론트엔드
│   ├── src/
│   │   ├── pages/       # 주요 화면 (Home, Login, MyExams 등)
│   │   ├── components/  # 재사용 가능한 컴포넌트
│   │   └── services/    # firebase 설정, api 통신 등
├── server/              # Express 서버
│   ├── routes/          # API 라우터
│   ├── models/          # Mongoose 모델
│   └── middleware/      # 인증 미들웨어
├── .env                 # 환경변수
└── README.md
```