// The most basic HTTP server possible
const http = require('http');

// Create server
const server = http.createServer((req, res) => {
  // Log request details
  console.log(`Received request: ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  // Simple API route for testing
  if (req.url === '/api/test') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Test API is working!' }));
    return;
  }
  
  // Auth register route for testing
  if (req.url === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      console.log('Received registration data:', body);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        success: true, 
        data: { 
          user: { id: '123', name: 'Test User', email: 'test@example.com' },
          token: 'fake-jwt-token-for-testing' 
        } 
      }));
    });
    return;
  }
  
  // Default response
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Hello from test server!' }));
});

// Listen specifically on localhost at port 3001
const PORT = 3001;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Test server running at http://localhost:${PORT}/`);
}); 