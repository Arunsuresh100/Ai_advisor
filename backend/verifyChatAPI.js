
const fetch = require('node-fetch');

const verify = async () => {
  console.log('--- Starting API Verification ---');
  
  try {
    // 1. Register
    console.log('Registering/Checking Test User...');
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Verification Bot',
        email: 'vbot@test.com',
        password: 'Password123'
      })
    });
    console.log('Registration Status:', regRes.status);

    // 2. Login
    console.log('Logging In...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'vbot@test.com',
        password: 'Password123'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login Status:', loginRes.status);

    if (!token) throw new Error('Failed to get token: ' + JSON.stringify(loginData));

    // 3. Query Chat
    console.log('Querying AI Advisor: "What is theft?"');
    const chatRes = await fetch('http://localhost:5000/api/chat/query', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: 'What is theft?' })
    });
    
    const chatData = await chatRes.json();
    console.log('Chat Status:', chatRes.status);

    if (chatRes.ok) {
      console.log('AI Response:', chatData.data);
      if (chatData.data.includes('IPC 378')) {
        console.log('✅ VERIFICATION SUCCESS: AI correctly identified theft law.');
      } else {
        console.log('❌ VERIFICATION FAILED: AI response did not contain expected legal reference.');
      }
    } else {
      console.log('Error Message from Server:', chatData.message);
    }

  } catch (err) {
    console.error('Verification Error:', err.message);
  }
};

verify();
