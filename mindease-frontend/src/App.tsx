import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { loginSuccess } from './store/slices/authSlice';
import axiosInstance from './utils/api';
import GlobalAlerts from './components/GlobalAlerts';

// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import MoodTracker from './pages/MoodTracker';
import Activities from './pages/Activities';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import Review from './pages/Review';
import Awareness from './pages/Awareness';
import JoyCorner from './pages/JoyCorner';
import OAuthSuccess from './pages/OAuthSuccess';
import Home from './pages/Home';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth Routes - redirect to dashboard if already authenticated
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Restore user info if token exists but user is missing
    if (token && !user) {
              axiosInstance.get('/auth/me')
        .then(response => {
          if (response.data) {
            dispatch(loginSuccess({ user: response.data, token }));
          }
        })
        .catch(() => {
          // Optionally handle error (e.g., token expired)
        });
    }
  }, [token, user, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <GlobalAlerts />
      
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } />
          <Route path="/signup" element={
            <AuthRoute>
              <SignUp />
            </AuthRoute>
          } />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          
          {/* Protected Routes that use Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/mood" element={<MoodTracker />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/review" element={<Review />} />
            <Route path="/awareness" element={<Awareness />} />
            <Route path="/joy-corner" element={<JoyCorner />} />
          </Route>
          
          {/* Redirect all other routes */}
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </div>
      
      {/* Chatbot as a fixed component */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}>
        <Chatbot />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <GlobalAlerts />
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
