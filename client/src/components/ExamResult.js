// client/src/components/ExamResult.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { examApi } from '../services/api';

const ExamResult = () => {
  const { resultId, examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // 추가: location 가져오기
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 추가: state를 통해 결과 데이터가 전달된 경우 사용
    if (location.state && location.state.results) {
      console.log('state에서 결과 데이터 사용');
      setResult(location.state.results);
      setLoading(false);
      return;
    }

    // ID 유효성 검증 및 로깅
    const id = resultId || examId;
    
    console.log('ExamResult 컴포넌트 마운트. 경로:', location.pathname);
    console.log('ID 정보:', { resultId, examId });
    
    if (!id || id === 'undefined') {
      console.error('유효하지 않은 ID (컴포넌트 마운트):', id);
      setError('유효하지 않은 ID입니다.');
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        console.log('결과 조회 시도:', id);
        
        let response;
        // URL 경로에 따라 다른 API 호출
        if (location.pathname.includes('/result/')) {
          // /result/:resultId 경로인 경우
          response = await examApi.getResult(resultId);
        } else if (location.pathname.includes('/exam-result/')) {
          // /exam-result/:examId 경로인 경우
          try {
            response = await examApi.getExamResult(examId);
          } catch (err) {
            console.error('시험 ID로 결과 조회 실패:', err);
            // API가 없는 경우, 결과 목록 조회 후 필터링
            const allResults = await examApi.getMyResults();
            const examResults = allResults.data.filter(
              r => r.examId && r.examId._id === examId
            );
            
            if (examResults.length > 0) {
              // 가장 최근 결과 사용
              response = { data: examResults[0] };
            } else {
              throw new Error('해당 시험의 결과를 찾을 수 없습니다.');
            }
          }
        }
        
        setResult(response.data);
        setLoading(false);
      } catch (err) {
        console.error('결과 조회 오류:', err);
        setError(err.message || '결과를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId, examId, location, navigate]);

  if (loading) {
    return <div className="text-center mt-8">결과를 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => navigate('/my-results')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          결과 목록으로
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center mt-8">
        <p>결과 데이터를 찾을 수 없습니다.</p>
        <button 
          onClick={() => navigate('/my-results')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          결과 목록으로
        </button>
      </div>
    );
  }

  const { score, totalQuestions, answers } = result;
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // 틀린 문제와 맞은 문제 분리
  const incorrectAnswers = answers.filter(a => !a.isCorrect);
  const correctAnswers = answers.filter(a => a.isCorrect);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">시험 결과</h2>
        <div className="p-4 bg-blue-50 rounded-lg inline-block">
          <p className="text-lg">
            총 <span className="font-bold">{totalQuestions}</span>문제 중{' '}
            <span className="font-bold text-blue-600">{score}</span>문제 정답
          </p>
          <p className="text-2xl font-bold mt-1">
            {percentage}점
          </p>
        </div>
      </div>

      {/* 오답 노트 섹션 */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-red-600">
          틀린 문제 ({incorrectAnswers.length})
        </h3>
        
        {incorrectAnswers.length === 0 ? (
          <p className="text-center p-4 bg-green-50 rounded-md">
            모든 문제를 맞혔습니다! 축하합니다! 🎉
          </p>
        ) : (
          incorrectAnswers.map((answer, index) => (
            <div key={index} className="mb-6 p-4 border border-red-200 rounded-md bg-red-50">
              <p className="font-medium mb-2">문제:</p>
              <p className="mb-4">{answer.question}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-red-600">내 답변:</p>
                  <p className="p-2 bg-white rounded-md">{answer.userAnswer || '(답변 없음)'}</p>
                </div>
                
                <div>
                  <p className="font-medium text-green-600">정답:</p>
                  <p className="p-2 bg-white rounded-md">{answer.correctAnswer}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 맞은 문제 섹션 */}
      <div>
        <h3 className="text-xl font-bold mb-4 text-green-600">
          맞은 문제 ({correctAnswers.length})
        </h3>
        
        {correctAnswers.map((answer, index) => (
          <div key={index} className="mb-4 p-4 border border-green-200 rounded-md bg-green-50">
            <p className="font-medium mb-2">문제:</p>
            <p className="mb-4">{answer.question}</p>
            
            <div>
              <p className="font-medium text-green-600">정답:</p>
              <p className="p-2 bg-white rounded-md">{answer.correctAnswer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => navigate('/my-results')}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          결과 목록으로
        </button>
      </div>
    </div>
  );
};

export default ExamResult;