const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  week: {
    type: String,
    required: true
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  kills: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  matches: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
