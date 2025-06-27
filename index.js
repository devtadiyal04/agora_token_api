// server.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { ChatTokenBuilder } = require('agora-access-token');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔐 Replace with your Agora Chat credentials
const APP_ID = '957dacbfcd6b469ea2961bf8aa045542';
const APP_CERTIFICATE = '2fa87c78d3e24a9eba53e342732eda0e';

const TOKEN_EXPIRATION = 3600; // 1 hour

// 🧠 In-memory app token cache
let appTokenCache = {
  token: null,
  expiresAt: 0,
};

// ✅ [1] Generate Chat Token using App Certificate
app.post('/generate-chat-token', (req, res) => {
  const { userId } = req.body;

  console.log(`🔐 Generating chat token for: ${userId}`);

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
    console.log(`✅ Token generated successfully for: ${userId}`);
    return res.json({ token, userId, expiresIn: TOKEN_EXPIRATION });
  } catch (error) {
    console.error(`❌ Token generation failed:`, error);
    return res.status(500).json({
      error: 'Token generation failed',
      details: error.message,
    });
  }
});

// ✅ [2] Server health check (optional)
app.get('/', (req, res) => {
  res.send('✅ Agora Chat Token Server is running!');
});

// ✅ [3] Start server
app.listen(PORT, () => {
  console.log(`🚀 Agora Chat Token Server running at http://localhost:${PORT}`);
});
