import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import mindeaseLogo from '../assets/mindease-logo.svg';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 w-full shadow-md">
      <div className="flex justify-between items-center h-16 px-0">
        {/* Extreme Left: Logo and App Name */}
        <div className="flex items-center gap-2 ml-0 pl-0">
          <Link to="/" className="flex items-center gap-2">
            <img src={mindeaseLogo} alt="MindEase Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-blue-300">MindEase</span>
          </Link>
        </div>
        {/* Right: Account Name and Logout */}
        <div className="flex items-center ml-auto">
          {isAuthenticated && user && (
            <span className="mr-4 text-gray-200 font-medium whitespace-nowrap">{user.name || user.email}</span>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Logout
            </button>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-gray-200 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 