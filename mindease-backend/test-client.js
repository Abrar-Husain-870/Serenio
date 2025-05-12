// Simple client to test connection to test-server.js
const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3001,
  path: '/',
  method: 'GET'
};

console.log('Attempting to connect to http://127.0.0.1:3001/');

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response data:', data);
    console.log('Connection successful!');
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end(); 