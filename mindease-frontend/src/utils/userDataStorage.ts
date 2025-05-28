// Utility for saving and restoring user data across login sessions

// Define types for user data that should persist across sessions
interface JoyCornerData {
  likes?: number[];
  completedChallenges?: string[];
  drawings?: string[];
  gameHighScores?: {
    memoryGame?: number;
    wordJumble?: number;
  };
}

interface UserSessionData {
  darkMode?: boolean;
  joyCorner?: JoyCornerData;
  settings?: {
    notifications?: boolean;
    emailNotifications?: boolean;
    reminderTime?: string;
  };
}

// Function to save user data before logout
export const saveUserDataBeforeLogout = (userId: string) => {
  try {
    // Collect data that should persist across sessions
    const userData: UserSessionData = {};
    
    // Dark mode preference
    userData.darkMode = document.documentElement.classList.contains('dark');
    
    // Settings (if stored in localStorage)
    const settingsStr = localStorage.getItem(`mindease-settings-${userId}`);
    if (settingsStr) {
      userData.settings = JSON.parse(settingsStr);
    }
    
    // Joy corner data (if stored in localStorage)
    const joyCornerStr = localStorage.getItem(`mindease-joycorner-${userId}`);
    if (joyCornerStr) {
      userData.joyCorner = JSON.parse(joyCornerStr);
    }
    
    // Save all data to localStorage with the user ID
    localStorage.setItem(`mindease-user-data-${userId}`, JSON.stringify(userData));
    console.log('User data saved before logout:', userId);
  } catch (error) {
    console.error('Failed to save user data before logout:', error);
  }
};

// Function to restore user data after login
export const restoreUserDataAfterLogin = (userId: string) => {
  try {
    // Get saved user data
    const userDataStr = localStorage.getItem(`mindease-user-data-${userId}`);
    if (!userDataStr) {
      return false; // No data to restore
    }
    
    const userData: UserSessionData = JSON.parse(userDataStr);
    
    // Restore dark mode if needed
    if (userData.darkMode !== undefined) {
      const currentDarkMode = document.documentElement.classList.contains('dark');
      if (userData.darkMode !== currentDarkMode) {
        userData.darkMode 
          ? document.documentElement.classList.add('dark')
          : document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', String(userData.darkMode));
      }
    }
    
    // Restore settings
    if (userData.settings) {
      localStorage.setItem(`mindease-settings-${userId}`, JSON.stringify(userData.settings));
    }
    
    // Restore joy corner data
    if (userData.joyCorner) {
      localStorage.setItem(`mindease-joycorner-${userId}`, JSON.stringify(userData.joyCorner));
    }
    
    console.log('User data restored after login:', userId);
    return true;
  } catch (error) {
    console.error('Failed to restore user data after login:', error);
    return false;
  }
};

// Function to store joy corner data
export const saveJoyCornerData = (userId: string, data: JoyCornerData) => {
  try {
    localStorage.setItem(`mindease-joycorner-${userId}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save joy corner data:', error);
    return false;
  }
};

// Function to get joy corner data
export const getJoyCornerData = (userId: string): JoyCornerData | null => {
  try {
    const dataStr = localStorage.getItem(`mindease-joycorner-${userId}`);
    if (!dataStr) return null;
    return JSON.parse(dataStr);
  } catch (error) {
    console.error('Failed to get joy corner data:', error);
    return null;
  }
}; 