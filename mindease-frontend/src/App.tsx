import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess } from './store/slices/authSlice';
import { fetchWithAuth } from './utils/api';
import Navbar from './components/Navbar';
import { toast } from 'react-toastify';

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
import Home from './pages/Home';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAppSelector((state) => state.auth);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth Routes - redirect to dashboard if already authenticated
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAppSelector((state) => state.auth);
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function OAuthSuccess() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const errorParam = params.get('error');
    
    if (errorParam) {
      setError("Authentication failed. Please try again.");
      setTimeout(() => navigate('/login'), 3000);
      return;
    }
    
    if (token) {
      // Mark this as a Google login session
      localStorage.setItem('isGoogleLogin', 'true');
      
      // Fetch user info using the real API
      const fetchUserInfo = async () => {
        try {
          localStorage.setItem('token', token); // Set token first so fetchWithAuth can use it
          const response = await fetchWithAuth('/auth/me');
          
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          
          const userData = await response.json();
          dispatch(loginSuccess({ user: userData, token }));
          toast.success('Successfully signed in with Google!');
          navigate('/dashboard');
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Navigate to login page if authentication fails
          localStorage.removeItem('token');
          localStorage.removeItem('isGoogleLogin');
          setError("Failed to complete authentication. Please try again.");
          setTimeout(() => navigate('/login'), 3000);
        }
      };
      
      fetchUserInfo();
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, location]);

  if (error) {
    return <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-red-500 text-lg mb-4">{error}</div>
      <div>Redirecting to login page...</div>
    </div>;
  }

  return <div className="flex items-center justify-center min-h-screen text-lg">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mr-3"></div>
    Logging you in...
  </div>;
}

function App() {
  // Check if token exists in localStorage but not in state
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if we have a token in localStorage but not in Redux state
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      // Restore the user session
      const restoreSession = async () => {
        try {
          const response = await fetchWithAuth('/auth/me');
          
          if (response.ok) {
            const userData = await response.json();
            dispatch(loginSuccess({ user: userData, token: storedToken }));
          } else {
            // If the token is invalid, clear it
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error restoring session:', error);
          localStorage.removeItem('token');
        }
      };
      
      restoreSession();
    }
  }, [dispatch, token]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <div className="pt-16">
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
            </Route>
            
            {/* Redirect all other routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        
        {/* Add the Chatbot component here, outside of the routes */}
        <Chatbot />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
