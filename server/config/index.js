const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  },
  session: {
    secret: process.env.SESSION_SECRET || "your-session-secret",
  },
  server: {
    port: process.env.PORT || 4000,
  },
};
