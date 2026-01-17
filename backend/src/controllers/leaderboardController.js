const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');

// Get weekly leaderboard
exports.getWeeklyLeaderboard = async (req, res) => {
  try {
    // Get all users sorted by weekly score (real-time leaderboard)
    const users = await User.find()
      .select('-password')
      .sort({ weeklyScore: -1 })
      .lean();

    // Map to leaderboard format with proper ranking
    const leaderboard = users.map((user, index) => ({
      _id: user._id,
      week: getWeekString(new Date()),
      player: {
        _id: user._id,
        username: user.username,
        gameId: user.gameId,
        kills: user.kills,
        deaths: user.deaths,
        wins: user.wins,
        matches: user.matches,
        weeklyScore: user.weeklyScore
      },
      score: user.weeklyScore,
      kills: user.kills,
      deaths: user.deaths,
      wins: user.wins,
      matches: user.matches,
      rank: index + 1
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset weekly scores (Admin - run weekly)
exports.resetWeeklyScores = async (req, res) => {
  try {
    const lastWeek = getPreviousWeekString(new Date());
    
    // Get all users sorted by score before reset
    const users = await User.find()
      .select('-password')
      .sort({ weeklyScore: -1 })
      .lean();

    // Archive current scores to leaderboard history
    const leaderboardEntries = users.map((user, index) => ({
      week: lastWeek,
      player: user._id,
      score: user.weeklyScore,
      kills: user.kills,
      wins: user.wins,
      matches: user.matches,
      rank: index + 1,
      createdAt: new Date()
    }));

    if (leaderboardEntries.length > 0) {
      await Leaderboard.insertMany(leaderboardEntries);
    }

    // Reset weekly scores to 0 for new week
    await User.updateMany({}, { weeklyScore: 0 });

    res.json({
      message: 'Weekly leaderboard archived and scores reset successfully',
      previousWeek: lastWeek,
      playersReset: users.length,
      topPlayers: leaderboardEntries.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user rank
exports.getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentWeek = getWeekString(new Date());

    let rank = await Leaderboard.findOne({ week: currentWeek, player: userId });

    if (!rank) {
      // Calculate rank dynamically
      const user = await User.findById(userId);
      const usersAbove = await User.countDocuments({ weeklyScore: { $gt: user.weeklyScore } });
      rank = { rank: usersAbove + 1 };
    }

    res.json(rank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to get week string (YYYY-W##)
function getWeekString(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

// Helper function to get previous week string
function getPreviousWeekString(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - 7);
  return getWeekString(d);
}
