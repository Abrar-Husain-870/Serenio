import React, { useState, useEffect } from 'react';
import { FiBell,FiMoon, FiSun } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAppSelector } from '../store/hooks';
import axiosInstance from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, token } = useAppSelector(state => state.auth);
  const [settings, setSettings] = useState({
    darkMode: document.documentElement.classList.contains('dark'),
    notifications: true,
    emailNotifications: true,
    reminderTime: '09:00',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<{[key:string]:boolean}>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const headers: any = {};
        if (token && token !== 'cookie') {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await axiosInstance.get('/settings', {
          headers,
          withCredentials: true
        });
        if (response.data) {
          setSettings(prev => ({
            ...prev,
            ...response.data,
            darkMode: document.documentElement.classList.contains('dark')
          }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchSettings();
    }
  }, [token]);

  const handleToggle = async (setting: keyof typeof settings) => {
    setToggleLoading(prev => ({ ...prev, [setting]: true }));
    try {
      if (setting === 'darkMode') {
        document.documentElement.classList.toggle('dark');
        const newDarkMode = document.documentElement.classList.contains('dark');
        setSettings(prev => ({ ...prev, darkMode: newDarkMode }));
        localStorage.setItem('darkMode', String(newDarkMode));
      } else {
        const newValue = !settings[setting];
        setSettings(prev => ({ ...prev, [setting]: newValue }));
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      // Revert the change if the API call fails
      if (setting === 'darkMode') {
        document.documentElement.classList.toggle('dark');
        setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
      } else {
        setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
      }
    } finally {
      setToggleLoading(prev => ({ ...prev, [setting]: false }));
    }
  };

  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newTime = e.target.value;
      setSettings(prev => ({ ...prev, reminderTime: newTime }));
    } catch (error) {
      console.error('Error updating reminder time:', error);
      toast.error('Failed to update reminder time');
      // Revert the change if the API call fails
      setSettings(prev => ({ ...prev, reminderTime: prev.reminderTime }));
    }
  };

  const handleLogout = () => {
    if (window.confirm('Do you really want to log out?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* User Profile */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-xl font-bold text-primary-600">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</h3>
            <p className="text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {settings.darkMode ? (
                <FiMoon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              ) : (
                <FiSun className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              )}
              <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            </div>
            <button
              onClick={() => handleToggle('darkMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={toggleLoading['darkMode']}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
            </div>
            <button
              onClick={() => handleToggle('notifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.notifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={toggleLoading['notifications']}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
              disabled={toggleLoading['emailNotifications']}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <span className="text-gray-700 dark:text-gray-300">Daily Reminder Time</span>
            </div>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={handleTimeChange}
              className="input w-32"
            />
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
        <div className="space-y-4">
          <button 
            className="flex items-center w-full p-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 