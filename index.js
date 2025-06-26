const express = require('express');
const cors = require('cors');
const { RtmTokenBuilder } = require('agora-token'); // Make sure you installed: npm install agora-token

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Replace these with your actual Agora credentials from https://console.agora.io
const APP_ID = "957dacbfcd6b469ea2961bf8aa045542";
const APP_CERTIFICATE = "2fa87c78d3e24a9eba53e342732eda0e";
const TOKEN_EXPIRATION_SECONDS = 3600; // 1 hour

// RtmRole.Rtm_User is typically just the number 1
const RTM_ROLE_USER = 1;

app.post('/generate-chat-token', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTime + TOKEN_EXPIRATION_SECONDS;

  try {
    const token = RtmTokenBuilder.buildToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      RTM_ROLE_USER,
      privilegeExpiredTs
    );

    return res.json({
      agoraToken: token,  // ✅ Must match your Flutter app's expectation
      userId,
      expiresIn: TOKEN_EXPIRATION_SECONDS,
    });
  } catch (error) {
    console.error("Token generation failed:", error);
    return res.status(500).json({ error: 'Token generation failed. Check server logs for details.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Agora Chat Token Server running at http://localhost:${PORT}`);
});
