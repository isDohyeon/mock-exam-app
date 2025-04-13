import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logOut } from '../services/firebase';
import mylogo from '../assets/mylogo.png';

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={mylogo} 
                alt="My Own Exam Logo" 
                className="h-10 w-auto object-contain"
                style={{ maxHeight: '40px' }}
              />
              <span className="text-xl font-bold ml-2">My Own Exam</span>
            </Link>
          </div>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/my-exams" className="hover:text-blue-200">
                  내 시험
                </Link>
                <Link to="/my-results" className="hover:text-blue-200">
                  시험 결과
                </Link>
                <span className="text-blue-100">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-800"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-800"
              >
                로그인
              </Link>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {currentUser ? (
              <>
                <Link
                  to="/my-exams"
                  className="block py-2 hover:text-blue-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  내 시험
                </Link>
                <Link
                  to="/my-results"
                  className="block py-2 hover:text-blue-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  시험 결과
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-blue-200"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 hover:text-blue-200"
                onClick={() => setIsMenuOpen(false)}
              >
                로그인
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;