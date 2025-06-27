const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { ChatTokenBuilder } = require('agora-access-token');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Agora Chat Credentials
const APP_ID = '957dacbfcd6b469ea2961bf8aa045542';
const APP_CERTIFICATE = '2fa87c78d3e24a9eba53e342732eda0e';
const CLIENT_ID = '007eJxTYJCYWzG3d5fRr/pnTTeXM9ztLKm7fv3zQmP3S5I7f2zvvi2uwGBpap6SmJyUlpxilmRiZpmaaGRpZpiUZpGYaGBiampilPIhJqMhkJFBadZmRkYGVgZGIATxVRhMkxLTDFOSDHRNjUyTdA0N0wx0Ew0sUnWNDE0sUg0sU5KTzVMA6QwrBQ==';
const CLIENT_SECRET = '007eJxTYFjFKrjE44dwlhTD8pl8b7W2L30/wUX7JOPR0P06/AsitM8rMFiamqckJielJaeYJZmYWaYmGlmaGSalWSQmGpiYmpoYTfgQk9EQyMjAMvc6EyMDKwMjAxMDiM/AAAAaiByL';
const ORG_NAME = '411319426';
const APP_NAME = '1568129';
const BASE_URL = `https://agora-token-api-1.onrender.com/${ORG_NAME}/${APP_NAME}`;
const TOKEN_EXPIRATION = 3600;

let appTokenCache = {
  token: null,
  expiresAt: 0,
};

// ✅ Get App Access Token
async function getAppToken() {
  const now = Date.now() / 1000;
  if (appTokenCache.token && appTokenCache.expiresAt > now) {
    console.log('✅ Returning cached app token');
    return appTokenCache.token;
  }

  console.log('🔁 Requesting new app token...');
  try {
    const res = await axios.post(`${BASE_URL}/token`, {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    appTokenCache.token = res.data.access_token;
    appTokenCache.expiresAt = now + res.data.expires_in - 60;

    console.log('✅ App token obtained successfully');
    return appTokenCache.token;
  } catch (error) {
    console.error('❌ Failed to get app token:', error.response?.data || error.message);
    throw error;
  }
}

// ✅ Register Chat User
app.post('/register-user', async (req, res) => {
  const { userId, password } = req.body;
  console.log(`📥 Registering user: ${userId}`);

  if (!userId || !password) {
    console.warn('⚠️ Missing userId or password');
    return res.status(400).json({ error: 'userId and password required' });
  }

  try {
    const appToken = await getAppToken();

    console.log(`📤 Sending user registration to Agora API for ${userId}`);
    const registerRes = await axios.post(
      `${BASE_URL}/users`,
      { username: userId, password },
      { headers: { Authorization: `Bearer ${appToken}` } }
    );

    console.log('✅ User registration successful:', registerRes.data);
    return res.json({ success: true });
  } catch (error) {
    const msg = error.response?.data || error.message;
    console.error('❌ User registration failed:', msg);
    return res.status(500).json({ error: 'User registration failed', details: msg });
  }
});

// ✅ Generate Chat Token
app.post('/generate-chat-token', (req, res) => {
  const { userId } = req.body;
  console.log(`🔐 Generating chat token for: ${userId}`);

  if (!userId) {
    console.warn('⚠️ userId not provided');
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const token = ChatTokenBuilder.buildUserToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      TOKEN_EXPIRATION
    );

    console.log('✅ Chat token generated');
    return res.json({ token, userId, expiresIn: TOKEN_EXPIRATION });
  } catch (error) {
    console.error('❌ Token generation failed:', error.message);
    return res.status(500).json({ error: 'Token generation failed', details: error.message });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Agora Chat Backend running at http://localhost:${PORT}`);
});
