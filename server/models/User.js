const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    access_token: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    top_tracks: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track" }],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
