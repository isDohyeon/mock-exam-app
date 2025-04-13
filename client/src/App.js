// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ExamForm from './components/ExamForm';
import MyExams from './pages/MyExams';
import TakeExam from './components/TakeExam';
import ExamResult from './components/ExamResult';
import MyResults from './pages/MyResults';
import IncorrectExam from './pages/IncorrectExam';

// 인증이 필요한 라우트를 위한 래퍼 컴포넌트
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* 공개 라우트 */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              
              {/* 인증 필요한 라우트들 */}
              <Route
                path="/create-exam"
                element={
                  <PrivateRoute>
                    <ExamForm />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/edit-exam/:examId"
                element={
                  <PrivateRoute>
                    <ExamForm />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/my-exams"
                element={
                  <PrivateRoute>
                    <MyExams />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/take-exam/:examId"
                element={
                  <PrivateRoute>
                    <TakeExam />
                  </PrivateRoute>
                }
              />
              
              {/* 시험 결과 경로 - 직접 ExamResult 컴포넌트 사용 */}
              <Route
                path="/exam-result"
                element={
                  <PrivateRoute>
                    <Navigate to="/my-results" replace />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/exam-result/:examId"
                element={
                  <PrivateRoute>
                    <ExamResult />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/my-results"
                element={
                  <PrivateRoute>
                    <MyResults />
                  </PrivateRoute>
                }
              />
              
              {/* 결과 관련 경로 처리 */}
              <Route
                path="/result"
                element={
                  <PrivateRoute>
                    <Navigate to="/my-results" replace />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/result/undefined"
                element={
                  <PrivateRoute>
                    <Navigate to="/my-results" replace />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/result/:resultId"
                element={
                  <PrivateRoute>
                    <ExamResult />
                  </PrivateRoute>
                }
              />
              
              {/* 오답 모의고사 경로 */}
              <Route
                path="/incorrect-exam"
                element={
                  <PrivateRoute>
                    <IncorrectExam />
                  </PrivateRoute>
                }
              />
              
              {/* 존재하지 않는 경로는, 인증 상태에 따라 홈 또는 내 시험 목록으로 리다이렉션 */}
              <Route 
                path="*" 
                element={
                  <PrivateRoute>
                    <Navigate to="/my-exams" replace />
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;