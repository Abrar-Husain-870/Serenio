import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiBook, FiSmile, FiActivity, FiBarChart2, FiSettings, FiMoon, FiSun, FiMenu, FiChevronLeft, FiPieChart, FiInfo } from 'react-icons/fi';
import { useAppSelector } from '../store/hooks';
import mindeaseLogo from '../assets/mindease-logo.svg';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAppSelector(state => state.auth);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/journal', icon: FiBook, label: 'Journal' },
    { path: '/mood', icon: FiSmile, label: 'Mood' },
    { path: '/activities', icon: FiActivity, label: 'Activities' },
    { path: '/progress', icon: FiBarChart2, label: 'Progress' },
    { path: '/review', icon: FiPieChart, label: 'Review' },
    { path: '/awareness', icon: FiInfo, label: 'Awareness' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  // If not authenticated, don't render the layout
  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar (without page names) */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-20 h-16">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={mindeaseLogo} alt="MindEase Logo" className="h-10 w-10" />
              <span className="font-bold text-xl text-primary-600 dark:text-primary-400">MindEase</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <FiMenu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Navigation Sidebar */}
      <div 
        className={`hidden md:block fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-2">
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isCollapsed ? <FiMenu /> : <FiChevronLeft />}
            </button>
          </div>
          
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 ${
                location.pathname === item.path
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-gray-700'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                <item.icon className="w-6 h-6" />
              </div>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 ${
                location.pathname === item.path
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className={`pt-16 pb-20 md:pb-6 transition-all duration-300 ${
        isCollapsed ? 'md:pl-16' : 'md:pl-64'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 