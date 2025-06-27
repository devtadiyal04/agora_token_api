// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { ChatTokenBuilder } = require('agora-access-token');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Replace with your Agora Chat project credentials
const APP_ID = '957dacbfcd6b469ea2961bf8aa045542';
const APP_CERTIFICATE = '2fa87c78d3e24a9eba53e342732eda0e';
const CLIENT_ID = '<your-client-id>'; // From Agora Console
const CLIENT_SECRET = '<your-client-secret>'; // From Agora Console
const ORG_NAME = '<your-org-name>'; // Example: "411319426"
const APP_NAME = '<your-app-name>'; // Example: "1568129"
const BASE_URL = `https://a1.easemob.com/${ORG_NAME}/${APP_NAME}`;
const TOKEN_EXPIRATION = 3600; // 1 hour

let appTokenCache = {
  token: null,
  expiresAt: 0,
};

async function getAppToken() {
  const now = Date.now() / 1000;
  if (appTokenCache.token && appTokenCache.expiresAt > now) {
    return appTokenCache.token;
  }

  const res = await axios.post(`${BASE_URL}/token`, {
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  appTokenCache.token = res.data.access_token;
  appTokenCache.expiresAt = now + res.data.expires_in - 60; // buffer
  return appTokenCache.token;
}

app.post('/register-user', async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ error: 'userId and password required' });
  }

  try {
    const appToken = await getAppToken();
    await axios.post(
      `${BASE_URL}/users`,
      { username: userId, password },
      { headers: { Authorization: `Bearer ${appToken}` } }
    );
    return res.json({ success: true });
  } catch (error) {
    const msg = error.response?.data || error.message;
    return res.status(500).json({ error: 'User registration failed', details: msg });
  }
});

app.post('/generate-chat-token', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const token = ChatTokenBuilder.buildUserToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      TOKEN_EXPIRATION
    );
    return res.json({ token, userId, expiresIn: TOKEN_EXPIRATION });
  } catch (error) {
    return res.status(500).json({ error: 'Token generation failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Agora Chat Backend running on http://localhost:${PORT}`);
});
