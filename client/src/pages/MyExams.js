// client/src/pages/MyExams.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examApi } from '../services/api';

const MyExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await examApi.getMyExams();
        setExams(response.data);
        setLoading(false);
      } catch (err) {
        console.error('시험 목록 조회 오류:', err);
        setError('시험 목록을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleDeleteExam = async (examId) => {
    if (window.confirm('정말로 이 시험을 삭제하시겠습니까?')) {
      try {
        await examApi.deleteExam(examId);
        setExams(exams.filter(exam => exam._id !== examId));
      } catch (err) {
        console.error('시험 삭제 오류:', err);
        alert('시험을 삭제하는 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-8">시험 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">내 시험 목록</h2>
        <Link
          to="/create-exam"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          + 새 시험 만들기
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="mb-4">아직 만든 시험이 없습니다.</p>
          <Link
            to="/create-exam"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            첫 시험 만들기
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">시험 제목</th>
                <th className="px-6 py-3 text-left text-gray-700">문제 수</th>
                <th className="px-6 py-3 text-left text-gray-700">생성일</th>
                <th className="px-6 py-3 text-center text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td className="px-6 py-4">
                    <span className="font-medium">{exam.title}</span>
                  </td>
                  <td className="px-6 py-4">{exam.questions.length}문제</td>
                  <td className="px-6 py-4">
                    {new Date(exam.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/take-exam/${exam._id}`}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        풀기
                      </Link>
                      <Link
                        to={`/edit-exam/${exam._id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDeleteExam(exam._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyExams;
