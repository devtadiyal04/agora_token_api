const express = require('express');
const cors = require('cors');
const { RtmTokenBuilder, RtmRole } = require('agora-token');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Replace with your Agora project credentials
const APP_ID = "957dacbfcd6b469ea2961bf8aa045542";
const APP_CERTIFICATE = "2fa87c78d3e24a9eba53e342732eda0e";
const TOKEN_EXPIRATION_SECONDS = 3600; // 1 hour

app.post('/generate-chat-token', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + TOKEN_EXPIRATION_SECONDS;

  try {
    const token = RtmTokenBuilder.buildToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      RtmRole.Rtm_User,
      privilegeExpiredTs
    );

    return res.json({
      token,
      userId,
      expiresIn: TOKEN_EXPIRATION_SECONDS,
    });
  } catch (error) {
    console.error("❌ Token generation failed:", error);
    return res.status(500).json({ error: 'Token generation failed. Check server logs for details.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Agora Chat Token Server running at http://localhost:${PORT}`);
});
