# 🎮 BlackVale Free Fire Guild Management System

A professional web-based platform for managing the BlackVale Free Fire guild with player performance analytics, admin verification, squad system, and weekly rankings.

## Features

### 🎯 Player Features
- **User Registration & Authentication**: Secure account creation and login
- **Performance Tracking**: Submit screenshots of gameplay with stats (kills, headshots, damage)
- **Player Profile**: View and update personal stats and information
- **Screenshot Submission**: Upload game screenshots for admin verification
- **Squad System**: Create or join squads with guild approval
- **Weekly Leaderboard**: Track performance and rankings
- **Dashboard**: View all verified player performances

### 🔐 Admin Features
- **Screenshot Verification**: Review and approve/reject player submissions
- **Admin Comments**: Provide feedback on submissions
- **Squad Management**: Approve squad formations and select official members
- **Squad Naming**: Control squad names for organization
- **Leaderboard Reset**: Manage weekly ranking resets
- **Activity Monitoring**: Track all guild activities

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blackvale-guild
JWT_SECRET=your_secret_key_change_in_production
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `GET /api/auth/users` - Get all users (protected)

### Screenshots
- `POST /api/screenshots/submit` - Submit screenshot (protected)
- `GET /api/screenshots/pending` - Get pending screenshots (admin)
- `PUT /api/screenshots/approve/:id` - Approve screenshot (admin)
- `PUT /api/screenshots/reject/:id` - Reject screenshot (admin)
- `GET /api/screenshots/approved` - Get approved screenshots
- `GET /api/screenshots/user/:userId` - Get user's screenshots

### Squads
- `POST /api/squads/create` - Create squad (protected)
- `GET /api/squads/pending` - Get pending squads (admin)
- `PUT /api/squads/approve/:id` - Approve squad (admin)
- `PUT /api/squads/reject/:id` - Reject squad (admin)
- `PUT /api/squads/update-name/:id` - Update squad name (admin)
- `GET /api/squads/approved` - Get approved squads
- `GET /api/squads/user/:userId` - Get user's squad

### Leaderboard
- `GET /api/leaderboard/weekly` - Get weekly leaderboard
- `GET /api/leaderboard/user-rank/:userId` - Get user rank
- `POST /api/leaderboard/reset-weekly` - Reset weekly scores (admin)

## User Roles

### Player
- View dashboard with verified screenshots
- Submit performance screenshots
- Manage personal profile
- Create/join squads
- View leaderboard

### Admin
- Review and verify player submissions
- Manage squad formations
- Control squad names
- Manage rankings and scores

## Workflow

### Screenshot Verification Workflow
1. Player submits screenshot with game stats
2. Screenshot appears in admin panel as "pending"
3. Admin reviews screenshot and adds comment
4. Admin approves or rejects
5. If approved, screenshot appears on main dashboard for all players to see

### Squad System Workflow
1. Player creates squad and invites members
2. Squad request sent to admin for approval
3. Admin reviews squad members and approves/rejects
4. If approved, squad lineup appears on guild
5. Only admin can change squad names

### Weekly Ranking System
1. Players earn points through approved screenshots (10 points per screenshot)
2. Weekly leaderboard displays players ranked by score
3. Admin can reset weekly scores to start new week
4. Historical rankings are stored for tracking

## Database Models

### User Schema
```javascript
{
  username, email, password, gameId, role,
  kills, deaths, wins, matches,
  weeklyScore, weeklyRank,
  squad, profileImage,
  createdAt
}
```

### Screenshot Schema
```javascript
{
  player, imageUrl, description,
  status (pending/approved/rejected),
  kills, headshots, damageDealt, survival,
  adminComment, approvedBy,
  createdAt, approvedAt
}
```

### Squad Schema
```javascript
{
  name, description, leader, members,
  maxMembers, status (pending/approved/rejected),
  adminComment, approvedBy,
  createdAt, approvedAt
}
```

### Leaderboard Schema
```javascript
{
  week, player, score,
  kills, wins, matches, rank,
  createdAt
}
```

## Default Admin Account

To create an admin account:

1. Register a normal account
2. Open MongoDB and update the user role:
```javascript
db.users.updateOne(
  { email: "admin@blackvale.com" },
  { $set: { role: "admin" } }
)
```

## Development Tips

- Change `.env` variables as needed for your environment
- MongoDB should be running before starting the backend
- CORS is enabled for localhost development
- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt (salt rounds: 10)

## Future Enhancements

- Real-time notifications using WebSockets
- Player statistics analytics and charts
- Match history integration
- Season-based competitions
- Team performance analytics
- Player achievements and badges
- Mobile app version
- Multi-language support

## Support

For issues or questions, please contact the admin team or create an issue in the repository.

---

**Built for BlackVale Free Fire Guild** ⚔️🔥
