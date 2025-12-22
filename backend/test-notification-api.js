const axios = require('axios');

// Test the notification API endpoint
async function testNotificationAPI() {
  try {
    console.log('Testing notification API endpoint...');
    
    // Test without authentication (should fail)
    const res1 = await axios.get('http://localhost:5000/api/notification');
    console.log('Without auth:', res1.status, res1.data);
  } catch (err) {
    console.log('Without auth - Expected error:', err.response?.status || err.message);
  }
  
  try {
    // Test with a sample token (this will likely fail but shows if endpoint exists)
    const res2 = await axios.get('http://localhost:5000/api/notification', {
      headers: {
        Authorization: 'Bearer sample_token_123'
      }
    });
    console.log('With sample token:', res2.status, res2.data);
  } catch (err) {
    console.log('With sample token - Expected error:', err.response?.status || err.message);
  }
  
  // Test health endpoint to confirm server is running
  try {
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('Health check:', health.status, health.data);
  } catch (err) {
    console.log('Health check failed:', err.message);
  }
}

testNotificationAPI();
