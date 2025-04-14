# 📘 나만의 모의고사 (Mock Exam App)

"나만의 모의고사"는 사용자가 직접 시험 문제를 생성하고 응시하며, 오답을 복습할 수 있는 웹 기반 모의고사 플랫폼입니다.  
React + Firebase + Node.js + MongoDB를 활용하여 풀스택 환경으로 구축되었습니다.

---

## 🔍 주요 기능
- 🏠 **홈 화면**
<img width="700" alt="로그인이된홈화면" src="https://github.com/user-attachments/assets/7923d82f-dff3-41c2-b661-adbd8f68e944" />
<br><br>

- 🔐 **Firebase 로그인** (Google 계정 인증)
<img width="700" alt="로그인화면" src="https://github.com/user-attachments/assets/00b51060-c0c6-4b55-98dc-df49710d96e4" />
<br><br>

- 📝 **시험 문제 생성** (제목, 문제, 정답 입력)
<img width="700" alt="시험만들기화면" src="https://github.com/user-attachments/assets/f289b1ad-d3a9-4e33-860d-873123d45613" />
<img width="700" alt="시험이 생성된 내 시험 목록" src="https://github.com/user-attachments/assets/2901b419-2baa-4246-9263-7b2b8da66d89" />
<br><br>

- 🛠️ **기존 시험 문제 수정**
<img width="700" alt="시험 수정하기 화면" src="https://github.com/user-attachments/assets/9071a38a-1d50-43c4-8387-381cb7000931" />
<br><br>

- 📚 **시험 응시 및 시험 문제 정렬**
<img width="700" alt="시험 화면" src="https://github.com/user-attachments/assets/9e3f2d0c-a34c-4173-8e73-9a024fe5aa5a" />
<img width="700" alt="문제가 정렬된 화면" src="https://github.com/user-attachments/assets/9af0f9a2-439f-45d7-adf0-a0c8d4327ffa" />
<br><br>

- 📊 **내 시험 및 결과 목록 확인**
<img width="700" alt="시험결과화면" src="https://github.com/user-attachments/assets/973fec27-bda8-4d87-aef8-8fa7073b6ecd" />
<img width="700" alt="내 시험결과 목록" src="https://github.com/user-attachments/assets/c75d1653-0266-471f-a6fa-e0761b325186" />
<br><br>

- ❌ **오답 모의고사 생성 및 복습**
<img width="700" alt="오답모의고사 화면" src="https://github.com/user-attachments/assets/6bf0f614-cfa4-443e-af90-1f9e86a152d1" />
<br><br>

- 🗑️ **항목 삭제 기능**: 불필요한 시험을 삭제
<img width="700" alt="시험 삭제하기" src="https://github.com/user-attachments/assets/c269d376-c33f-4ba3-8eef-824bccaaaa34" />
<img width="700" alt="시험이없는 시험목록화면" src="https://github.com/user-attachments/assets/9aaf6cb7-5587-48a2-be29-602dda5e6b2a" />
<br><br>

- 🎨 **Tailwind CSS** 기반 반응형 UI

---

## 🧱 기술 스택

<table>
  <thead>
    <tr>
      <th style="text-align:center; width: 220px;">프론트엔드</th>
      <th style="text-align:center; width: 220px;">백엔드</th>
      <th style="text-align:center; width: 220px;">인증/DB</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="50"/><br/>
        React 19
      </td>
      <td align="center">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="50"/><br/>
        Node.js + Express
      </td>
      <td align="center">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg" width="50"/><br/>
        Firebase Auth
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" width="50"/><br/>
        Tailwind CSS
      </td>
      <td align="center">
        <img src="https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/rest-api-icon.png" width="50"/><br/>
        RESTful API
      </td>
      <td align="center">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" width="50"/><br/>
        MongoDB + Mongoose
      </td>
    </tr>
  </tbody>
</table>

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
