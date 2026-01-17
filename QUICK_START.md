# 🚀 Quick Start Guide

## Prerequisites
- Node.js v14+
- MongoDB (local or MongoDB Atlas)
- Git (optional)

## One-Minute Setup

### 1. MongoDB Connection
**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account
- Create a cluster
- Get connection string
- Update `.env` with your connection string

### 2. Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```
✅ Backend running on http://localhost:5000

### 3. Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```
✅ Frontend running on http://localhost:3000

---

## Testing the Application

### Create Test Accounts

1. **Register as Player**
   - Go to http://localhost:3000/register
   - Create account with details:
     - Username: testplayer
     - Email: test@blackvale.com
     - Game ID: 123456789
     - Password: test123

2. **Create Admin Account**
   - Register another account with email: admin@blackvale.com
   - Open MongoDB Compass or Studio 3T
   - Find the user and change `role` from "player" to "admin"
   - Or use MongoDB console:
   ```javascript
   db.users.updateOne(
     { email: "admin@blackvale.com" },
     { $set: { role: "admin" } }
   )
   ```

### Test Player Features

1. **Submit Screenshot**
   - Login as player
   - Go to "Upload Screenshot"
   - Upload an image (any image works for testing)
   - Add stats (kills, headshots, etc.)
   - Submit

2. **View Profile**
   - Click "Profile"
   - See your statistics
   - Edit profile to update stats

3. **Create Squad**
   - Go to "Squad"
   - Click "Create Squad"
   - Enter squad name
   - Select members to invite
   - Submit (waiting for admin approval)

4. **View Leaderboard**
   - Go to "Leaderboard"
   - See weekly rankings of all players

### Test Admin Features

1. **Approve Screenshots**
   - Login as admin
   - Go to "Admin Panel"
   - See pending screenshots
   - Click "Review"
   - Add comment if needed
   - Click "Approve" or "Reject"

2. **Approve Squads**
   - In Admin Panel, go to "Squads" tab
   - See pending squad requests
   - Click "Review"
   - Select members to approve
   - Click "Approve Squad" or "Reject Squad"

3. **Update Squad Name**
   - After squad approval, click on squad
   - Edit squad name (admins only)

---

## Common Issues & Solutions

### "MongoDB Connection Error"
```
❌ Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### "Port 5000 already in use"
```
❌ Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT in `.env`
```env
PORT=5001
```

### "React app won't load"
```
❌ Page shows blank or error
```
**Solution:** Clear cache and restart
```bash
# Kill all node processes
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install
npm start
```

### "Image upload not working"
- Make sure backend is running
- Check image file size (max 50MB by default)
- Check browser console for errors (F12)

---

## Project Structure

```
GUILD WEB/
├── backend/
│   ├── src/
│   │   ├── models/          (Database schemas)
│   │   ├── controllers/     (Business logic)
│   │   ├── routes/          (API endpoints)
│   │   ├── middleware/      (Auth, validation)
│   │   └── server.js        (Main server)
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/           (Page components)
│   │   ├── components/      (Reusable components)
│   │   ├── services/        (API calls)
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── README.md
```

---

## API Testing (Postman)

### Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testplayer",
  "email": "test@blackvale.com",
  "password": "test123",
  "gameId": "123456789"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@blackvale.com",
  "password": "test123"
}
```

### Submit Screenshot
```
POST http://localhost:5000/api/screenshots/submit
Authorization: Bearer {YOUR_JWT_TOKEN}
Content-Type: application/json

{
  "imageUrl": "data:image/png;base64,...",
  "description": "Amazing 20 kill game!",
  "kills": 20,
  "headshots": 5,
  "damageDealt": 450,
  "survival": "25:30"
}
```

---

## Performance Tips

1. **Optimize Images**
   - Compress before uploading
   - Max recommended: 2-3MB per image

2. **Database Indexes**
   - MongoDB creates indexes automatically
   - For large datasets, add custom indexes

3. **Caching**
   - Frontend caches leaderboard data
   - Clear cache if data doesn't update

---

## Security Notes

⚠️ **For Production:**

1. Change `JWT_SECRET` in `.env`
2. Enable HTTPS
3. Add rate limiting
4. Validate all inputs
5. Use environment-specific configs
6. Set `NODE_ENV=production`
7. Enable CORS restrictions
8. Use secure database credentials
9. Add input sanitization
10. Implement CSRF protection

---

## Need Help?

1. Check `README.md` for detailed documentation
2. Check browser console (F12) for errors
3. Check backend logs in terminal
4. Check MongoDB connection
5. Restart both backend and frontend

---

**Happy Gaming! ⚔️🔥**
