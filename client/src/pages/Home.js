// client/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">나만의 모의고사</h1>
      <p className="text-xl mb-8">
        자신만의 시험 문제를 만들고 풀어보세요. 학습 효과를 극대화하고 자신의 지식을 테스트하세요!
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
        {currentUser ? (
          <>
            <Link
              to="/create-exam"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg"
            >
              시험 만들기
            </Link>
            <Link
              to="/my-exams"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 text-lg"
            >
              내 시험 보기
            </Link>
          </>
        ) : (
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg"
          >
            로그인하고 시작하기
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">시험 만들기</h3>
          <p>내가 공부한 내용으로 시험 문제를 만들고 데이터베이스에 저장하세요.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">문제 풀기</h3>
          <p>저장된 문제를 랜덤하게 풀어보며 자신의 지식을 테스트하세요.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-3">오답 노트</h3>
          <p>틀린 문제를 바로 확인하고 복습하여 학습 효과를 높이세요.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
