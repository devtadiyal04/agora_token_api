const express = require('express');
const cors = require('cors');
const { ChatTokenBuilder } = require('agora-access-token');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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
    res.json({ token, userId, expiresIn: EXPIRE_TIME_SECONDS });
  } catch (err) {
    console.error("Token generation error:", err);
    res.status(500).json({ error: "Token generation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Token server running at http://localhost:${PORT}`);
});

