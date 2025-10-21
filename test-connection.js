// Simple test script to verify backend connection
const axios = require('axios');

async function testBackend() {
  const baseURL = 'http://localhost:3000';
  
  console.log('🔍 Testing backend connection...');
  
  try {
    // Test if backend is running
    console.log('1. Testing backend health...');
    const healthResponse = await axios.get(`${baseURL}/`);
    console.log('✅ Backend is running');
    
    // Test auth endpoints
    console.log('2. Testing auth endpoints...');
    
    // Test register endpoint
    try {
      const registerResponse = await axios.post(`${baseURL}/auth/register`, {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123'
      });
      console.log('✅ Register endpoint working');
      console.log('   Response:', registerResponse.data);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('⚠️  Register endpoint exists but user might already exist');
      } else {
        console.log('❌ Register endpoint error:', error.message);
      }
    }
    
    // Test login endpoint
    try {
      const loginResponse = await axios.post(`${baseURL}/auth/login`, {
        email: 'test@example.com',
        password: 'testpassword123'
      });
      console.log('✅ Login endpoint working');
      console.log('   Token received:', !!loginResponse.data.access_token);
    } catch (error) {
      console.log('❌ Login endpoint error:', error.message);
    }
    
    // Test Google OAuth endpoint
    try {
      const googleResponse = await axios.get(`${baseURL}/auth/google`);
      console.log('✅ Google OAuth endpoint accessible');
    } catch (error) {
      if (error.response?.status === 302) {
        console.log('✅ Google OAuth endpoint redirecting (expected)');
      } else {
        console.log('❌ Google OAuth endpoint error:', error.message);
      }
    }
    
    // Test chat endpoints
    console.log('3. Testing chat endpoints...');
    try {
      const chatRoomsResponse = await axios.get(`${baseURL}/chat/rooms`);
      console.log('✅ Chat rooms endpoint working');
      console.log('   Rooms found:', chatRoomsResponse.data.length);
    } catch (error) {
      console.log('❌ Chat rooms endpoint error:', error.message);
    }
    
    // Test users endpoints
    console.log('4. Testing users endpoints...');
    try {
      const usersResponse = await axios.get(`${baseURL}/users`);
      console.log('✅ Users endpoint working');
      console.log('   Users found:', usersResponse.data.length);
    } catch (error) {
      console.log('❌ Users endpoint error:', error.message);
    }
    
    console.log('\n🎉 Backend connection test completed!');
    
  } catch (error) {
    console.log('❌ Backend connection failed:', error.message);
    console.log('   Make sure the backend is running on port 3000');
  }
}

testBackend();
