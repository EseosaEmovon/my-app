// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const SpotifyWebApi = require("spotify-web-api-node");
const D3 = require("d3");

// Set up server
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors());

// Set up MongoDB database
mongoose.connect("mongodb://localhost:27017/spotify", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to MongoDB database");
});
connection.on("error", (err) => {
  console.log("Error connecting to MongoDB database:", err);
});

// Set up Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  redirectUri: "http://localhost:5000/auth/callback",
});

// Set up routes
app.get("/auth/login", (req, res) => {
  const scopes = ["user-top-read", "user-read-recently-played"];
  const state = "some-state-of-my-choice";
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL);
});

app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    res.redirect("http://localhost:3000/dashboard");
  } catch (err) {
    console.log("Error getting token:", err);
    res.redirect("http://localhost:3000/error");
  }
});

app.get("/api/me", async (req, res) => {
  try {
    const { body } = await spotifyApi.getMe();
    res.json(body);
  } catch (err) {
    console.log("Error getting user profile:", err);
    res.status(500).json({ error: "Unable to get user profile" });
  }
});

app.get("/api/top-artists", async (req, res) => {
  try {
    const { body } = await spotifyApi.getMyTopArtists({ limit: 10 });
    res.json(body.items);
  } catch (err) {
    console.log("Error getting top artists:", err);
    res.status(500).json({ error: "Unable to get top artists" });
  }
});

app.get("/api/top-tracks", async (req, res) => {
  try {
    const { body } = await spotifyApi.getMyTopTracks({ limit: 10 });
    res.json(body.items);
  } catch (err) {
    console.log("Error getting top tracks:", err);
    res.status(500).json({ error: "Unable to get top tracks" });
  }
});

app.get("/api/recently-played", async (req, res) => {
  try {
    const { body } = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 10 });
    res.json(body.items);
  } catch (err) {
    console.log("Error getting recently played tracks:", err);
    res.status(500).json({ error: "Unable to get recently played tracks" });
  }
});

app.get("/api/recommendations", async (req, res) => {
  try {
    const { body } = await spotifyApi.getMyTopArtists({ limit: 1 });
    const topArtistId = body.items[0].id;
    const { body: recommendations } = await spotifyApi.getRecommendations({
      seed_artists: [topArtistId],
      limit: 10,
    });
    res.json(recommendations.tracks);
  } catch (err) {
    console.log("Error getting recommendations:", err);
    res.status(500).json({ error: "Unable to get recommendations" });
  }
});

// Set up server to listen on port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
