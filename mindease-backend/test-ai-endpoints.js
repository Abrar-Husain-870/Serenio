// Simple test script for new AI endpoints
// Run with: node test-ai-endpoints.js

const BASE_URL = 'http://localhost:5000'; // Adjust if your backend runs on different port

// Test data
const testData = {
  negativeThought: "I'm never going to get better at this",
  moodData: [
    { mood: "sad", note: "Had a difficult day at work", date: new Date() },
    { mood: "neutral", note: "Feeling okay today", date: new Date(Date.now() - 86400000) }
  ],
  journalData: [
    { content: "Work was challenging today", mood: "sad", createdAt: new Date() },
    { content: "Feeling more positive about tomorrow", mood: "neutral", createdAt: new Date(Date.now() - 86400000) }
  ]
};

async function testEndpoint(endpoint, data = {}) {
  try {
    console.log(`\n🧪 Testing ${endpoint}...`);
    
    const response = await fetch(`${BASE_URL}/ai/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: You'll need to add a valid token for protected endpoints
        // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ ${endpoint} successful:`);
      console.log(JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.log(`❌ ${endpoint} failed (${response.status}):`, error);
    }
  } catch (error) {
    console.log(`❌ ${endpoint} error:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Testing MindEase AI Endpoints\n');
  console.log('Note: These tests require authentication. Add a valid token to test protected endpoints.\n');
  
  // Test CBT endpoint (requires negativeThought)
  await testEndpoint('cbt-thought-record', { negativeThought: testData.negativeThought });
  
  // Note: The following endpoints require authentication and user data:
  // - mood-summary
  // - create-plan  
  // - relapse-signals
  
  console.log('\n📝 To test protected endpoints:');
  console.log('1. Start your backend server');
  console.log('2. Get a valid JWT token from login');
  console.log('3. Add Authorization header to the test requests');
  console.log('4. Ensure you have mood/journal data in your database');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testEndpoint, runTests };
