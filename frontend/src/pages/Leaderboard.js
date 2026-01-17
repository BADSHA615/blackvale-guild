import React, { useState, useEffect } from 'react';
import { leaderboardService } from '../services/api';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
    // Refresh leaderboard every 30 seconds to show live updates
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setError(null);
      const response = await leaderboardService.getWeekly();
      
      // Filter out users with 0 score and no submissions (optional)
      const filtered = response.data;
      setLeaderboard(filtered);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    switch(rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="leaderboard-container">
      <div className="container">
        <div className="leaderboard-header">
          <h1>📊 Weekly Leaderboard</h1>
          <p className="subtitle">Top players based on weekly activity and approved submissions</p>
          <button onClick={fetchLeaderboard} className="refresh-btn" disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading && <div className="loading">Loading leaderboard...</div>}

        {!loading && leaderboard.length === 0 && (
          <div className="no-data">
            <p>No rankings yet. Submit and get approved screenshots to climb the leaderboard!</p>
          </div>
        )}

        {!loading && leaderboard.length > 0 && (
          <div className="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th className="rank-col">Rank</th>
                  <th className="player-col">Player</th>
                  <th className="center">Score</th>
                  <th className="center">Kills</th>
                  <th className="center">Wins</th>
                  <th className="center">Matches</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => {
                  const playerData = entry.player || entry;
                  const score = entry.score || entry.weeklyScore || 0;
                  
                  return (
                    <tr 
                      key={entry._id || index} 
                      className={`rank-row ${index < 3 ? `rank-${index + 1}` : ''}`}
                    >
                      <td className="rank-col">
                        <span className="rank-badge">{getRankBadge(entry.rank || index + 1)}</span>
                      </td>
                      <td className="player-col">
                        <div className="player-info">
                          <div className="player-name">{playerData.username || 'Unknown'}</div>
                          <div className="game-id">{playerData.gameId || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="center score-cell"><strong>{score}</strong></td>
                      <td className="center">{playerData.kills || 0}</td>
                      <td className="center">{playerData.wins || 0}</td>
                      <td className="center">{playerData.matches || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="leaderboard-info">
          <h3>ℹ️ How to climb the leaderboard:</h3>
          <ul>
            <li>✅ Submit screenshots of your matches</li>
            <li>✅ Wait for admin approval</li>
            <li>✅ Each approved screenshot = 10 points</li>
            <li>✅ Leaderboard resets weekly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
