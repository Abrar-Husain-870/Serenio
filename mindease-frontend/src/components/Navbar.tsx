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
        <div className="flex items-center gap-3 pr-4">
          {isAuthenticated && (
            <>
              {/* Initials beside account name */}
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-200">
                <span className="text-primary-600 font-bold text-lg">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              <span className="text-white font-semibold">{user?.name || 'Account'}</span>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 