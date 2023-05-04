const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

router.get("/auth", (req, res) => {
  const scopes = ["user-read-email", "user-read-private", "user-top-read"];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, "state");
  res.redirect(authorizeURL);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    const user = await User.findOne({ email: req.session.user.email });
    user.access_token = access_token;
    user.refresh_token = refresh_token;
    await user.save();

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});

router.get("/stats", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.user.email });
    const data = await spotifyApi.getMyTopTracks({
      limit: 10,
      time_range: "short_term",
    });
    const tracks = data.body.items;
    res.json({ tracks });
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});

router.get("/recommendations", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.user.email });
    const data = await spotifyApi.getRecommendations({
      seed_tracks: user.top_tracks,
      limit: 10,
    });
    const tracks = data.body.tracks;
    res.json({ tracks });
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});

router.get("/visualizations", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.user.email });
    const data = await spotifyApi.getMyTopArtists({
      limit: 10,
      time_range: "short_term",
    });
    const artists = data.body.items;
    const artistNames = artists.map((artist) => artist.name);
    const artistPopularity = artists.map((artist) => artist.popularity);
    res.json({ artistNames, artistPopularity });
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});

module.exports = router;
