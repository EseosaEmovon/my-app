require("dotenv").config();
const express = require("express");
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");
const mongoose = require("mongoose");
const User = require("../models/User");

// Set up the Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// Authorization endpoint for Spotify authentication
// This route redirects the user to the Spotify authorization page
router.get("/auth/spotify", (req, res) => {
  const scopes = ["user-read-private", "user-read-email", "user-top-read"];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, true);
  res.redirect(authorizeURL);
});

// Callback endpoint for Spotify authentication
// This route handles the callback after the user has granted access
router.get("/auth/spotify/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    // Store the access token and refresh token in the database
    const user = new User({
      access_token,
      refresh_token,
    });
    await user.save();

    // Set the access token on the Spotify API client
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    // Redirect to the dashboard page
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Get the user's top artists and tracks from Spotify
// This route retrieves the user's top artists and tracks and sends them to the client
router.get("/top", async (req, res) => {
  try {
    const { access_token, refresh_token } = await getTokens(req);
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    const topArtistsResponse = await spotifyApi.getMyTopArtists();
    const topTracksResponse = await spotifyApi.getMyTopTracks();
    const topArtists = topArtistsResponse.body.items;
    const topTracks = topTracksResponse.body.items;

    // Send the user's top artists and tracks to the client
    res.send({ topArtists, topTracks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Get the user's listening history from Spotify
// This route retrieves the user's recently played tracks and saved tracks and sends them to the client
router.get("/history", async (req, res) => {
  try {
    const { access_token, refresh_token } = await getTokens(req);
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    const recentlyPlayedResponse = await spotifyApi.getMyRecentlyPlayedTracks();
    const historyResponse = await spotifyApi.getMySavedTracks();
    const recentlyPlayed = recentlyPlayedResponse.body.items;
    const history = historyResponse.body.items;

    // Send the user's listening history to the client
    res.send({ recentlyPlayed, history });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Get personalized track recommendations for the user
// This route generates personalized recommendations based on the user's top tracks and sends them to the client
router.get("/recommendations", async (req, res) => {
  try {
    const { access_token, refresh_token } = await getTokens(req);
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    // Get the user's top tracks
    const topTracksResponse = await spotifyApi.getMyTopTracks({
      limit: 10,
      time_range: "short_term",
    });
    const topTracks = topTracksResponse.body.items;

    // Use the top tracks to generate recommendations
    const seedTracks = topTracks.map((track) => track.id);
    const recommendationsResponse = await spotifyApi.getRecommendations({
      seed_tracks: seedTracks,
    });
    const recommendations = recommendationsResponse.body.tracks;

    // Send the personalized recommendations to the client
    res.send({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Helper function to retrieve access and refresh tokens from the database
async function getTokens(req) {
  const userId = req.user.id;
  const user = await User.findById(userId);
  const access_token = user.access_token;
  const refresh_token = user.refresh_token;
  return { access_token, refresh_token };
}

module.exports = router;
