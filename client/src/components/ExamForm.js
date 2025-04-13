// client/src/components/ExamForm.js
import React, { useState, useEffect } from 'react';
import { examApi } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const ExamForm = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [examTitle, setExamTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (examId) {
      const fetchExam = async () => {
        try {
          const response = await examApi.getExam(examId);
          const exam = response.data;
          setExamTitle(exam.title);
          setQuestions(exam.questions);
          setIsEditing(true);
        } catch (err) {
          console.error('시험 데이터 로딩 오류:', err);
          setError('시험을 불러오는 중 오류가 발생했습니다.');
        }
      };
      fetchExam();
    }
  }, [examId]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!examTitle.trim()) {
      setError('시험 제목을 입력해주세요.');
      return;
    }

    const hasEmptyFields = questions.some((q) => !q.question.trim() || !q.answer.trim());
    if (hasEmptyFields) {
      setError('모든 문제와 답변을 작성해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const examData = {
        title: examTitle,
        questions: questions,
      };

      if (isEditing) {
        await examApi.updateExam(examId, examData);
      } else {
        await examApi.createExam(examData);
      }
      navigate('/my-exams');
    } catch (err) {
      console.error('시험 저장 오류:', err);
      setError('시험을 저장하는 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{isEditing ? '시험 수정하기' : '새 시험 만들기'}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 font-medium">시험 제목</label>
          <input
            type="text"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="시험 제목을 입력하세요"
          />
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">문제</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              + 문제 추가
            </button>
          </div>

          {questions.map((q, index) => (
            <div key={index} className="mb-6 p-4 border rounded-md">
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium">문제 {index + 1}</label>
                <textarea
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="문제를 입력하세요"
                  rows="3"
                />
              </div>
              
              <div className="mb-2">
                <label className="block mb-1 text-sm font-medium">정답</label>
                <input
                  type="text"
                  value={q.answer}
                  onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="정답을 입력하세요"
                />
              </div>
              
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
          >
            {isSubmitting ? '저장 중...' : (isEditing ? '수정 완료' : '시험 저장')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamForm;