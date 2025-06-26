// agora-chat-token-server.js

import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

const AGORA_APP_ID = '957dacbfcd6b469ea2961bf8aa045542';
const AGORA_APP_CERT = '2fa87c78d3e24a9eba53e342732eda0e';
const ORG_NAME = '411319426';
const APP_NAME = '1568129';

const BASE_URL = `https://a41.chat.agora.io`;

// Generate Chat Token (not RTM token)
app.get('/generateChatToken', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }

  const basicAuth = Buffer.from(`${AGORA_APP_ID}:${AGORA_APP_CERT}`).toString('base64');

  try {
    const response = await axios.post(
      `${BASE_URL}/${ORG_NAME}/${APP_NAME}/token`,
      {
        grant_type: 'app',
        user: userId
      },
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const token = response.data.access_token;
    res.status(200).json({ chatToken: token });
  } catch (err) {
    console.error('Chat token generation error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate chat token' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Agora Chat Token Server running on port ${PORT}`);
  console.log(`GET http://localhost:${PORT}/generateChatToken?userId=some_user_id`);
});
