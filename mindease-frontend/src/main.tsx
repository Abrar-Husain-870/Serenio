import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Check for user preference and set dark mode on page load
const initializeDarkMode = () => {
  // Check if user previously enabled dark mode
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  
  // Check if user prefers dark mode in their system settings
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply dark mode if either condition is true
  if (savedDarkMode || prefersDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Run the initialization
initializeDarkMode();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);
