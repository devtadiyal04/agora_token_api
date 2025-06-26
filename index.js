import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

const appId = '957dacbfcd6b469ea2961bf8aa045542';
const appCert = '2fa87c78d3e24a9eba53e342732eda0e';
const orgName = '411319426';
const appName = '1568129';

const baseUrl = `https://a41.chat.agora.io`;

app.get('/generateChatToken', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).send('Username required');

  try {
    const response = await axios.post(
      `${baseUrl}/${orgName}/${appName}/token`,
      {
        grant_type: 'client_credentials',
        user: username
      },
      {
        auth: {
          username: appId,
          password: appCert
        }
      }
    );
    res.json({ token: response.data.access_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
