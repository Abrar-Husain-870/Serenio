import { useState, useEffect } from 'react';
import { FiBell, FiLock, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { mockApi } from '../utils/mockApi';
import { useAppSelector } from '../store/hooks';

const Settings = () => {
  const { user } = useAppSelector(state => state.auth);
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    emailNotifications: true,
    reminderTime: '09:00',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading user settings
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
    toast.success('Settings updated!');
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({
      ...prev,
      reminderTime: e.target.value,
    }));
    toast.success('Reminder time updated!');
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
          <button className="flex items-center w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
            <FiUser className="w-5 h-5 mr-3" />
            Edit Profile
          </button>
          <button className="flex items-center w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
            <FiLock className="w-5 h-5 mr-3" />
            Change Password
          </button>
          <button 
            className="flex items-center w-full p-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            onClick={() => toast.info('This feature is not available in demo mode')}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 