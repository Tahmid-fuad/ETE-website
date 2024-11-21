const nodemailer = require('nodemailer');
const axios = require('axios');

// Obtain OAuth2 tokens (access token and refresh token)
async function getOAuth2Tokens() {
  try {
    const { data } = await axios.post(`https://oauth2.googleapis.com/token`, {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: process.env.REFRESH_TOKEN // Replace with your actual refresh token
    });

    const accessToken = data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error fetching access token:', error.response.data.error);
    throw error;
  }
}

// Configure Nodemailer transport
async function setupTransporter() {
  try {
    const accessToken = await getOAuth2Tokens();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      },
    });

    return transporter;
  } catch (error) {
    console.error('Error setting up transporter:', error);
    throw error;
  }
}

module.exports = setupTransporter;
