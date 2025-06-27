const express = require('express');
const cors = require('cors');
const { ChatTokenBuilder2 } = require('agora-token'); // ✅ Use ChatTokenBuilder2

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Agora Chat credentials (not RTC)
const APP_ID = "957dacbfcd6b469ea2961bf8aa045542";
const APP_CERTIFICATE = "2fa87c78d3e24a9eba53e342732eda0e";
const EXPIRE_SECONDS = 3600;

app.post('/generate-chat-token', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const token = ChatTokenBuilder2.buildUserToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      EXPIRE_SECONDS
    );

    return res.json({
      token,
      userId,
      expiresIn: EXPIRE_SECONDS,
    });
  } catch (error) {
    console.error("Token generation failed:", error);
    return res.status(500).json({ error: 'Token generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Agora Chat Token Server running at http://localhost:${PORT}`);
});
