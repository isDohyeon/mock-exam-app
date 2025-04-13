import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { examApi } from '../services/api';

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0); // 새로고침 트리거 추가

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await examApi.getMyResults();
        console.log('결과 목록 응답:', response.data);
        
        const validResults = response.data.filter(result => 
          result && result._id && typeof result._id === 'string'
        );
        
        if (validResults.length !== response.data.length) {
          console.warn('일부 결과에 유효하지 않은 ID가 있습니다', {
            총결과수: response.data.length,
            유효결과수: validResults.length
          });
        }
        
        setResults(validResults);
        setLoading(false);
      } catch (err) {
        console.error('결과 목록 조회 오류:', err);
        setError('결과 목록을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchResults();
  }, [refreshTrigger]); // refreshTrigger 의존성 추가

  const handleRetakeIncorrect = async (resultId) => {
    try {
      if (!resultId) {
        alert('유효한 결과 ID가 필요합니다.');
        return;
      }
      
      const button = document.getElementById(`incorrect-btn-${resultId}`);
      if (button) button.textContent = "생성 중...";
      
      console.log('오답 모의고사 생성 요청. 결과 ID:', resultId);
      const response = await examApi.createIncorrectExam(resultId);
      console.log('오답 모의고사 응답:', response.data);
      
      if (response.data && response.data._id) {
        const examId = response.data._id;
        console.log('오답 모의고사로 이동. 시험 ID:', examId);
        
        window.location.href = `/take-exam/${examId}`;
      } else {
        console.error('오답 모의고사 ID가 없음:', response.data);
        alert('오답 모의고사가 생성되었지만 ID를 찾을 수 없습니다.');
        
        if (response.data.message) {
          alert(`서버 메시지: ${response.data.message}`);
        }
        
        if (button) button.textContent = "오답 모의고사";
      }
    } catch (err) {
      console.error('오답 모의고사 생성 오류:', err);
      
      if (err.response?.data?.message) {
        alert(`오류: ${err.response.data.message}`);
      } else {
        alert(`오류: ${err.message || '오답 모의고사 생성 중 오류가 발생했습니다.'}`);
      }
      
      const button = document.getElementById(`incorrect-btn-${resultId}`);
      if (button) button.textContent = "오답 모의고사";
    }
  };

  const handleDeleteResult = async (resultId) => {
    try {
      if (!resultId) {
        return; // 유효하지 않은 ID면 조용히 종료
      }
      
      // 삭제 처리 중 버튼 상태 변경
      const button = document.getElementById(`delete-btn-${resultId}`);
      if (button) button.textContent = "삭제 중...";
      
      // 결과 삭제 API 호출
      await examApi.deleteResult(resultId);
      
      // 목록 새로고침을 위한 트리거 증가
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('결과 삭제 오류:', err);
      // 오류가 발생해도 목록 새로고침
      setRefreshTrigger(prev => prev + 1);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">결과 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">내 시험 결과</h2>
      </div>

      {results.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="mb-4">아직 응시한 시험 결과가 없습니다.</p>
          <Link
            to="/my-exams"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            시험 보러가기
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">시험 제목</th>
                <th className="px-6 py-3 text-left text-gray-700">점수</th>
                <th className="px-6 py-3 text-left text-gray-700">응시일</th>
                <th className="px-6 py-3 text-center text-gray-700">상세보기</th>
                <th className="px-6 py-3 text-center text-gray-700">오답 모의고사</th>
                <th className="px-6 py-3 text-center text-gray-700">삭제</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result._id}>
                  <td className="px-6 py-4">
                    <span className="font-medium">
                      {result.examId && result.examId.title ? result.examId.title : '삭제된 시험'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600">
                      {result.score}
                    </span>
                    /{result.totalQuestions} ({Math.round((result.score / result.totalQuestions) * 100)}%)
                  </td>
                  <td className="px-6 py-4">
                    {new Date(result.date).toLocaleDateString()} {new Date(result.date).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/result/${result._id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      결과 보기
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      id={`incorrect-btn-${result._id}`}
                      onClick={() => handleRetakeIncorrect(result._id)}
                      className={`px-3 py-1 rounded-md ${
                        result.score === result.totalQuestions 
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                      disabled={result.score === result.totalQuestions}
                    >
                      {result.score === result.totalQuestions ? '모두 정답' : '오답 모의고사'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      id={`delete-btn-${result._id}`}
                      onClick={() => handleDeleteResult(result._id)}
                      className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      삭제
                    </button>
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

export default MyResults;