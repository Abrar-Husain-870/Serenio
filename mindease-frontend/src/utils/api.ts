// API Configuration
export const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for making API requests with authentication
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const isGoogleLogin = localStorage.getItem('isGoogleLogin') === 'true';
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  
  console.log(`Making ${options.method || 'GET'} request to ${API_BASE_URL}${endpoint}`);
  console.log('Headers:', headers);
  console.log('Auth state:', { token: !!token, isGoogleLogin });
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    console.error(`API request failed: ${response.status} ${response.statusText}`);
    console.error(`Endpoint: ${API_BASE_URL}${endpoint}`);
  }
  
  return response;
}; 