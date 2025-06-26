const express = require('express');
const cors = require('cors');
// --- Using 'agora-token' as per previous correction ---
const { RtmTokenBuilder } = require('agora-token');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Replace these with your Agora Console credentials
const APP_ID = "957dacbfcd6b469ea2961bf8aa045542";
const APP_CERTIFICATE = "2fa87c78d3e24a9eba53e342732eda0e";
const TOKEN_EXPIRATION_SECONDS = 3600; // 1 hour

// --- Define RTM Role explicitly, as RtmRole might not be directly exported or structured differently ---
// RtmRole.Rtm_User typically corresponds to the integer value 1 in Agora SDKs.
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
      RTM_ROLE_USER, // --- Changed to direct numeric value ---
      privilegeExpiredTs
    );

    return res.json({
      token,
      userId,
      expiresIn: TOKEN_EXPIRATION_SECONDS,
    });
  } catch (error) {
    console.error("Token generation failed:", error);
    // Provide a more user-friendly error message if possible without exposing sensitive info
    return res.status(500).json({ error: 'Token generation failed. Check server logs for details.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Agora Chat Token Server running at http://localhost:${PORT}`);
});
