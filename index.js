// agora-token-server.js

/**
 * This Node.js script provides a simple server-side endpoint to generate
 * Agora RTM (Real-time Messaging) tokens. This token is required by the
 * Agora Chat SDK for user authentication.
 *
 * It uses the 'agora-access-token' library to build the token.
 *
 * IMPORTANT SECURITY NOTE:
 * The App ID and App Certificate are highly sensitive. NEVER expose them
 * in client-side code. This script is intended to be run on a secure
 * backend server.
 */

// Import necessary modules
const http = require('http'); // For creating a simple HTTP server
const { RtmTokenBuilder, RtmRole } = require('agora-access-token'); // Agora Token Builder library

// --- Configuration ---
// It's highly recommended to load these from environment variables
// rather than hardcoding them in production.
// Example: process.env.AGORA_APP_ID, process.env.AGORA_APP_CERTIFICATE
const AGORA_APP_ID = 'YOUR_AGORA_APP_ID'; // Replace with your Agora App ID
const AGORA_APP_CERTIFICATE = 'YOUR_AGORA_APP_CERTIFICATE'; // Replace with your Agora App Certificate

const PORT = process.env.PORT || 3000; // Server port, default to 3000

// --- Token Generation Function ---
function generateRtmToken(userId) {
    // Current timestamp for token expiration
    const currentTimestamp = Math.floor(Date.now() / 1000);
    // Token validity in seconds (e.g., 3600 seconds = 1 hour)
    const expirationTimeInSeconds = 3600;
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Build the RTM token
    const token = RtmTokenBuilder.buildToken(
        AGORA_APP_ID,
        AGORA_APP_CERTIFICATE,
        userId,
        RtmRole.Rtm_User, // Role for RTM user
        privilegeExpiredTs // Token expiration timestamp
    );

    return token;
}

// --- HTTP Server Setup ---
const server = http.createServer((req, res) => {
    // Set CORS headers to allow requests from any origin (for development).
    // In production, restrict this to your Flutter app's domain.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests (OPTIONS method) for CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // No content
        res.end();
        return;
    }

    // Only allow GET requests for simplicity in this example
    if (req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const userId = url.searchParams.get('userId'); // Get userId from query parameter

        if (!userId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing userId parameter' }));
            return;
        }

        try {
            const token = generateRtmToken(userId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ rtmToken: token }));
        } catch (error) {
            console.error('Error generating token:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to generate token' }));
        }
    } else {
        // Handle unsupported methods
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Agora RTM Token Server listening on port ${PORT}`);
    console.log(`Example Usage: http://localhost:${PORT}/?userId=YOUR_USER_ID`);
    console.log(`Remember to replace 'YOUR_AGORA_APP_ID' and 'YOUR_AGORA_APP_CERTIFICATE'`);
});
