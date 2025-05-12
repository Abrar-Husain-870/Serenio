import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { API_BASE_URL } from '../utils/api';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector(state => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    // Check if there's a Google session
    const isGoogleSession = localStorage.getItem('isGoogleLogin') === 'true';
    
    // Clear Redux state and local storage
    dispatch(logout());
    
    // If this was a Google login session, need to also clear Google's session
    if (isGoogleSession) {
      // Create an invisible iframe to trigger Google logout
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'https://accounts.google.com/logout';
      document.body.appendChild(iframe);
      
      // Remove iframe after logout completes
      setTimeout(() => {
        document.body.removeChild(iframe);
        navigate('/login');
      }, 1000);
    } else {
      navigate('/login');
    }
  };

  // Define navigation links
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Journal', path: '/journal' },
    { name: 'Activities', path: '/activities' },
    { name: 'Progress', path: '/progress' },
    { name: 'Review', path: '/review' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              MindEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium ${
                  isActive(link.path)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline flex items-center"
                >
                  <FiLogOut className="w-4 h-4 mr-1" />
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn btn-sm btn-outline">
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-sm btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {menuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {token ? (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <div className="flex items-center mb-2">
                    <FiUser className="mr-2" />
                    <span>{user?.name || 'User'}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="btn btn-sm btn-outline w-full mt-2"
                  >
                    <FiLogOut className="w-4 h-4 mr-1" />
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 px-3 py-2 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="btn btn-sm btn-outline w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-sm btn-primary w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 