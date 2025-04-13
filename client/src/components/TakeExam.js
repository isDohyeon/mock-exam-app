// client/src/components/TakeExam.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examApi } from '../services/api';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRandomized, setIsRandomized] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await examApi.getExam(examId);
        setExam(response.data);
        
        // 초기 질문 순서 설정
        const initialQuestions = [...response.data.questions];
        setQuestions(initialQuestions);
        
        // 초기 답변 배열 설정
        setAnswers(new Array(initialQuestions.length).fill(''));
        
        setLoading(false);
      } catch (err) {
        console.error('시험 데이터 로딩 오류:', err);
        setError('시험을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const toggleRandomize = () => {
    if (!isRandomized) {
      // 질문 섞기
      const shuffledQuestions = [...exam.questions].sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
      // 답변 초기화
      setAnswers(new Array(shuffledQuestions.length).fill(''));
      setCurrentQuestionIndex(0);
    } else {
      // 원래 순서로 돌아가기
      setQuestions([...exam.questions]);
      setAnswers(new Array(exam.questions.length).fill(''));
      setCurrentQuestionIndex(0);
    }
    setIsRandomized(!isRandomized);
  };

  const handleAnswerChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // 결과 계산
      const results = questions.map((question, index) => {
        const userAnswer = answers[index].trim();
        const correctAnswer = question.answer.trim();
        const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
        
        return {
          question: question.question,
          correctAnswer,
          userAnswer,
          isCorrect
        };
      });
      
      const resultData = {
        examId,
        answers: results,
        score: results.filter(r => r.isCorrect).length,
        totalQuestions: results.length,
        date: new Date()
      };
      
      // 시험 결과 제출
      const response = await examApi.submitExamResult(examId, resultData);
      console.log('시험 결과 제출 응답:', response.data);
      
      // 결과 페이지로 이동 (응답에 결과 ID가 있는 경우)
      if (response.data && response.data._id) {
        navigate(`/result/${response.data._id}`);
      } else {
        // 응답에 ID가 없는 경우에도 state를 통해 결과 데이터 전달
        navigate(`/exam-result/${examId}`, { 
          state: { 
            results: resultData
          } 
        });
      }
    } catch (err) {
      console.error('시험 제출 오류:', err);
      setError('시험 결과를 제출하는 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">시험을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  if (!exam) {
    return <div className="text-center mt-8">시험을 찾을 수 없습니다.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{exam.title}</h2>
        <p className="text-gray-600 mt-1">
          문제 {currentQuestionIndex + 1} / {questions.length}
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={toggleRandomize}
          className={`px-4 py-2 rounded-md ${
            isRandomized
              ? 'bg-gray-200 text-gray-800'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isRandomized ? '기본 순서로 돌아가기' : '문제 랜덤 정렬'}
        </button>
      </div>

      <div className="mb-8 p-4 border rounded-md">
        <h3 className="font-medium mb-3">문제:</h3>
        <p className="mb-6 text-lg">{currentQuestion.question}</p>

        <div>
          <label className="block mb-2">답변:</label>
          <textarea
            value={answers[currentQuestionIndex] || ''}
            onChange={handleAnswerChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="답변을 입력하세요"
            rows="3"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={goToPrevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
        >
          이전 문제
        </button>

        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={goToNextQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            다음 문제
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            시험 제출하기
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeExam;