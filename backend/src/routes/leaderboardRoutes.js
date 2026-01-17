const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/weekly', leaderboardController.getWeeklyLeaderboard);
router.get('/user-rank/:userId', leaderboardController.getUserRank);
router.post('/reset-weekly', authMiddleware, adminMiddleware, leaderboardController.resetWeeklyScores);

module.exports = router;
