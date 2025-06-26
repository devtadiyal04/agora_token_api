// index.js (Node.js with ES Modules support)

import axios from 'axios';
import { ChatTokenBuilder } from 'agora-access-token';

const agoraAppId = '957dacbfcd6b469ea2961bf8aa045542';
const agoraAppCertificate = '2fa87c78d3e24a9eba53e342732eda0e';
const chatOrgName = '411319426';
const chatAppName = '1568129';
const chatRestApiDomain = 'https://a41.chat.agora.io'; // ✅ Use correct data center

const expirationInSeconds = 3600;

// User info (dynamic in real apps)
const username = 'user_Beijing_58415';
const password = 'mysecurepassword'; // Required
const nickname = 'Dev tadiyal';      // Optional

async function registerChatUser() {
  try {
    // Step 1: Generate App Token
    const appToken = ChatTokenBuilder.buildAppToken(
      agoraAppId,
      agoraAppCertificate,
      expirationInSeconds
    );

    // Step 2: Prepare user data
    const userData = {
      username,
      password,
      nickname,
    };

    // Step 3: Call Agora API
    const chatRegisterURL = `${chatRestApiDomain}/${chatOrgName}/${chatAppName}/users`;
    const response = await axios.post(chatRegisterURL, userData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${appToken}`,
      },
    });

    const {
      entities: [{ uuid: userUuid }],
    } = response.data;

    console.log('✅ User registered. UUID:', userUuid);
  } catch (err) {
    console.error('❌ Chat user registration failed:', err.response?.data || err.message);
  }
}

registerChatUser();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
