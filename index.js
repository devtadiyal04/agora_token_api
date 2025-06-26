const express = require('express');
const cors = require('cors');
const { ChatTokenBuilder } = require('agora-access-token');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Replace with your Agora Console credentials
const APP_ID = "957dacbfcd6b469ea2961bf8aa045542";
const APP_CERTIFICATE = "2fa87c78d3e24a9eba53e342732eda0e";
const EXPIRE_TIME_SECONDS = 3600; // 1 hour

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
      EXPIRE_TIME_SECONDS
    );

    res.json({
      token,
      userId,
      expiresIn: EXPIRE_TIME_SECONDS
    });
  } catch (err) {
    console.error("❌ Token generation failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Agora Chat Token Server is running at http://localhost:${PORT}`);
});
