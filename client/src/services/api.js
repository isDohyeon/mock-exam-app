// client/src/services/api.js
import axios from 'axios';
import { auth } from './firebase';

// API 클라이언트 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',  // 명시적으로 서버 주소 지정
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // 자격 증명 포함
});

// 요청 인터셉터 - 토큰 추가
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    console.log('인증 토큰 상태:', {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      currentUser: auth.currentUser ? '로그인됨' : '로그인 안됨'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('요청 헤더:', config.headers);
    } else {
      console.warn('인증 토큰이 없습니다. 사용자가 로그인되어 있지 않을 수 있습니다.');
    }
    return config;
  } catch (error) {
    console.error('토큰 처리 중 오류 발생:', error);
    return Promise.reject(error);
  }
});

// 응답 인터셉터 - 인증 오류 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API 오류 응답:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.status === 403) {
        console.error('인증 오류 상세:', {
          status: error.response.status,
          message: error.response.data?.message,
          headers: error.response.headers
        });
      }
    } else if (error.request) {
      console.error('요청은 보냈으나 응답을 받지 못함:', error.request);
    } else {
      console.error('요청 설정 중 오류 발생:', error.message);
    }
    return Promise.reject(error);
  }
);

// 토큰 가져오기
const getAuthToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.warn('현재 로그인된 사용자가 없습니다.');
    return null;
  }
  try {
    const token = await currentUser.getIdToken(true);  // true를 전달하여 토큰 강제 새로고침
    return token;
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return null;
  }
};

export const examApi = {
  // 내 시험 목록 가져오기
  getMyExams: () => apiClient.get('/exams/my'),

  // 시험 생성하기
  createExam: (examData) => apiClient.post('/exams', examData),

  // 시험 상세 정보 가져오기
  getExam: (examId) => apiClient.get(`/exams/${examId}`),

  // 시험 업데이트
  updateExam: (examId, examData) => apiClient.put(`/exams/${examId}`, examData),

  // 시험 삭제
  deleteExam: (examId) => apiClient.delete(`/exams/${examId}`),

  // 시험 응시 결과 저장
  submitExamResult: (examId, results) => apiClient.post(`/exams/${examId}/results`, results),

  // 내 시험 결과 가져오기
  getMyResults: () => apiClient.get('/results/my'),

  // 시험 결과 상세 정보 가져오기
  getResult: (resultId) => {
    if (!resultId || resultId === 'undefined') {
      console.error('유효하지 않은 결과 ID로 요청 시도:', resultId);
      return Promise.reject(new Error('유효한 결과 ID가 필요합니다.'));
    }
    return apiClient.get(`/results/${resultId}`);
  },

  // 시험 결과 삭제
  deleteResult: (resultId) => {
    if (!resultId || resultId === 'undefined') {
      console.error('유효하지 않은 결과 ID로 삭제 시도:', resultId);
      return Promise.reject(new Error('유효한 결과 ID가 필요합니다.'));
    }
    return apiClient.delete(`/results/${resultId}`);
  },

  // 오답 모의고사 생성
createIncorrectExam: (resultId) => {
  if (!resultId || resultId === 'undefined') {
    console.error('유효하지 않은 결과 ID로 오답 모의고사 생성 시도:', resultId);
    return Promise.reject(new Error('유효한 결과 ID가 필요합니다.'));
  }
  // 응답 구조 로깅 추가
  return apiClient.post(`/exams/incorrect/${resultId}`)
    .then(response => {
      // 응답 구조 확인을 위한 로깅
      console.log('오답 모의고사 생성 응답:', response.data);
      if (!response.data._id) {
        console.error('오답 모의고사 응답에 _id가 없음:', response.data);
      }
      return response;
    });
},

  getExamResult: (examId) => {
    if (!examId || examId === 'undefined') {
      console.error('유효하지 않은 시험 ID로 요청 시도:', examId);
      return Promise.reject(new Error('유효한 시험 ID가 필요합니다.'));
    }
    return apiClient.get(`/exams/${examId}/latest-result`);
  },
};

// 오답 모의고사 결과 가져오기
export const getIncorrectResults = async (userId) => {
  const response = await apiClient.get(`/incorrect-results/${userId}`);
  return response.data;
};