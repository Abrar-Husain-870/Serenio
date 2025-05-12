const http = require('http');

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Server is running!' }));
});

// Listen on port 3001 which is less likely to be blocked
const PORT = 3001;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
}); 