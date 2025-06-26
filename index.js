// This file demonstrates how to generate the token required for the Agora Chat SDK.
// In Agora's terminology, the "Chat" functionality is powered by the Real-Time Messaging (RTM) service.
// Therefore, the token for the Agora Chat SDK is officially called an "RTM Token".

// IMPORTANT SECURITY NOTE:
// This code should ONLY be run on your secure backend server (e.g., Node.js server, Python server, etc.).
// NEVER expose your Agora App Certificate directly in client-side code (like in a browser's JavaScript file).
// Your App Certificate is highly sensitive and must be protected on your server.

// First, ensure you have the Agora Access Token library installed:
// If not, run in your terminal: npm install agora-access-token

// Import the necessary modules from the Agora Access Token library
// RtmTokenBuilder is the correct builder for Agora Chat (RTM) tokens.
const { RtmTokenBuilder, RtmRole } = require('agora-access-token');

// --- Configuration: Replace with your actual Agora credentials ---
// Your Agora App ID (You can find this in your Agora Console: https://console.agora.io/)
const APP_ID = '957dacbfcd6b469ea2961bf8aa045542';

// Your Agora App Certificate (This is highly sensitive and must be kept secret!)
// You can find this in your Agora Console.
const APP_CERTIFICATE = '2fa87c78d3e24a9eba53e342732eda0e';

// --- Token Generation Parameters ---
// The User ID for whom this token is being generated.
// This ID should uniquely identify a user within your chat application.
// Example values: 'user_alice', 'bob_id_123', 'guest_session_xyz'
const USER_ID = 'your_unique_chat_user_id';

// The expiration time for the token, in seconds.
// A common value is 3600 seconds (1 hour), but adjust this based on your security and user experience needs.
const TOKEN_EXPIRATION_IN_SECONDS = 3600; // 1 hour

// --- Function to Generate Agora Chat (RTM) Token ---
/**
 * Generates an Agora Chat (RTM) token required for logging into the Agora Chat SDK.
 * @param {string} appId - Your Agora App ID.
 * @param {string} appCertificate - Your Agora App Certificate (SECRET).
 * @param {string} userId - The unique user ID for whom the token is generated.
 * @param {number} expirationTimeInSeconds - The token's validity duration in seconds.
 * @returns {string} The generated Agora Chat (RTM) token.
 */
function generateAgoraChatToken(appId, appCertificate, userId, expirationTimeInSeconds) {
    // Get the current timestamp (in seconds since Unix epoch)
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Calculate the token's privilege expiration timestamp.
    // This is the time (in seconds) when the token will no longer be valid.
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Build the RTM token using RtmTokenBuilder.
    // RtmRole.Rtm_User specifies that this token is for a regular RTM (Chat) user.
    const token = RtmTokenBuilder.buildToken(
        appId,
        appCertificate,
        userId,
        RtmRole.Rtm_User, // This role is specifically for Agora Chat (RTM) users
        privilegeExpiredTs
    );

    return token;
}

// --- Example Usage (for testing this file directly on your backend) ---
// This block will execute when you run this JavaScript file using `node filename.js`.
if (require.main === module) {
    // Basic check to ensure credentials are not placeholders
    if (APP_ID === 'YOUR_AGORA_APP_ID' || APP_CERTIFICATE === 'YOUR_AGORA_APP_CERTIFICATE') {
        console.error("ERROR: Please replace 'YOUR_AGORA_APP_ID' and 'YOUR_AGORA_APP_CERTIFICATE' with your actual credentials from Agora Console.");
        console.error("Visit: https://console.agora.io/ to get your App ID and App Certificate.");
    } else {
        try {
            const chatToken = generateAgoraChatToken(
                APP_ID,
                APP_CERTIFICATE,
                USER_ID,
                TOKEN_EXPIRATION_IN_SECONDS
            );
            console.log(`--- Agora Chat Token Generation Result ---`);
            console.log(`Generated token for User ID: ${USER_ID}`);
            console.log(`Token: ${chatToken}`);
            console.log(`This token is valid for the Agora Chat SDK (RTM).`);
            console.log(`It expires in ${TOKEN_EXPIRATION_IN_SECONDS} seconds.`);
            console.log(`------------------------------------------`);

        } catch (error) {
            console.error("An error occurred during token generation:");
            console.error(error);
            console.error("Please verify your App ID and App Certificate for correctness.");
        }
    }
}
