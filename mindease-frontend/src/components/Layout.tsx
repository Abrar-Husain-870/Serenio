import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiActivity, FiSmile, FiStar, FiSun, FiBarChart2, FiMenu, FiSettings, FiClipboard } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
  { to: '/journal', label: 'Journal', icon: <FiBook /> },
  { to: '/mood', label: 'Mood', icon: <FiSmile /> },
  { to: '/activities', label: 'Activities', icon: <FiActivity /> },
  { to: '/progress', label: 'Progress', icon: <FiBarChart2 /> },
  { to: '/review', label: 'Review', icon: <FiClipboard /> },
  { to: '/joy-corner', label: 'JoyCorner', icon: <FiStar /> },
  { to: '/awareness', label: 'Awareness', icon: <FiSun /> },
  { to: '/settings', label: 'Settings', icon: <FiSettings /> },
];

const Layout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 pt-0 px-2 flex flex-col gap-2 transition-all duration-200 ${sidebarOpen ? 'w-56' : 'w-16'} min-h-screen`}>
        {/* Hamburger at the very top left */}
        <div className="flex items-center justify-start mb-1 px-2 mt-0">
          <button
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto mt-0">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${location.pathname === link.to ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : ''}`}
            >
              {link.icon}
              {sidebarOpen && link.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 px-4 py-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 