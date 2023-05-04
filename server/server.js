// Import required modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const SpotifyWebApi = require("spotify-web-api-node");
const routes = require("./routes/index");

// Set up server
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors());

// Set up MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
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
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// Set up routes
app.use("/", routes);

// Set up server to listen on port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
