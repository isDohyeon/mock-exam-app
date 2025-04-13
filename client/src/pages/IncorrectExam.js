import React, { useEffect, useState } from 'react';
import { examApi } from '../services/api';
import { Link } from 'react-router-dom';

const IncorrectExam = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIncorrectExams = async () => {
      try {
        setLoading(true);
        // 기존 API 구조를 활용하여 오답 모의고사 목록 가져오기
        const response = await examApi.getMyExams(); // 내 시험 목록을 가져온 후
        
        // isIncorrectExam 속성이 true인 시험만 필터링 (서버에서 이런 구분이 있다고 가정)
        const incorrectExams = response.data.filter(exam => exam.isIncorrectExam);
        
        setExams(incorrectExams);
        setLoading(false);
      } catch (error) {
        console.error('오답 모의고사 목록 가져오기 오류:', error);
        setError('오답 모의고사 목록을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchIncorrectExams();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">오답 모의고사 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">오답 모의고사 목록</h1>
      
      {exams.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="mb-4">생성된 오답 모의고사가 없습니다.</p>
          <Link
            to="/my-results"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            시험 결과 보기
          </Link>
        </div>
      ) : (
        <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
          {exams.map(exam => (
            <li key={exam._id} className="p-4 hover:bg-gray-50">
              <Link 
                to={`/take-exam/${exam._id}`}
                className="flex justify-between items-center"
              >
                <span className="font-medium">{exam.title}</span>
                <span className="text-blue-500 hover:text-blue-700">
                  시험 보기 &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IncorrectExam;