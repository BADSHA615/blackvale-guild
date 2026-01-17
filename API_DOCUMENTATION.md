# 📡 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## 🔐 Authentication Endpoints

### 1. Register User
Create a new player account.

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "username": "testplayer",
  "email": "test@blackvale.com",
  "password": "password123",
  "gameId": "123456789"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testplayer",
    "email": "test@blackvale.com",
    "gameId": "123456789"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (400):**
```json
{
  "message": "User already exists"
}
```

---

### 2. Login
Authenticate and get JWT token.

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "test@blackvale.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testplayer",
    "email": "test@blackvale.com",
    "role": "player",
    "gameId": "123456789"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

### 3. Get Profile
Get current user's profile.

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "testplayer",
  "email": "test@blackvale.com",
  "gameId": "123456789",
  "role": "player",
  "kills": 150,
  "deaths": 45,
  "wins": 25,
  "matches": 100,
  "weeklyScore": 50,
  "weeklyRank": 5,
  "squad": null,
  "profileImage": null,
  "createdAt": "2026-01-16T10:30:00Z"
}
```

---

### 4. Update Profile
Update user stats and information.

**Endpoint:** `PUT /auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "username": "newusername",
  "gameId": "987654321",
  "kills": 200,
  "deaths": 50,
  "wins": 30,
  "matches": 120
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated",
  "user": {
    "username": "newusername",
    "gameId": "987654321",
    "kills": 200,
    "deaths": 50,
    "wins": 30,
    "matches": 120
  }
}
```

---

### 5. Get All Users
Get list of all players with rankings.

**Endpoint:** `GET /auth/users`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "testplayer",
    "gameId": "123456789",
    "kills": 150,
    "deaths": 45,
    "wins": 25,
    "weeklyScore": 50,
    "weeklyRank": 1,
    "role": "player",
    "squad": null,
    "createdAt": "2026-01-16T10:30:00Z"
  }
]
```

---

## 📸 Screenshot Endpoints

### 1. Submit Screenshot
Upload a gameplay screenshot for admin review.

**Endpoint:** `POST /screenshots/submit`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAA...",
  "description": "Amazing 20 kill game with my squad!",
  "kills": 20,
  "headshots": 5,
  "damageDealt": 450,
  "survival": "25:30"
}
```

**Success Response (201):**
```json
{
  "message": "Screenshot submitted successfully",
  "screenshot": {
    "_id": "507f1f77bcf86cd799439012",
    "player": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testplayer",
      "gameId": "123456789"
    },
    "imageUrl": "data:image/png;base64,...",
    "description": "Amazing 20 kill game with my squad!",
    "kills": 20,
    "headshots": 5,
    "damageDealt": 450,
    "survival": "25:30",
    "status": "pending",
    "createdAt": "2026-01-16T10:30:00Z"
  }
}
```

---

### 2. Get Pending Screenshots
Get all pending screenshots (Admin only).

**Endpoint:** `GET /screenshots/pending`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "player": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testplayer",
      "gameId": "123456789"
    },
    "imageUrl": "data:image/png;base64,...",
    "description": "Amazing 20 kill game",
    "status": "pending",
    "createdAt": "2026-01-16T10:30:00Z"
  }
]
```

---

### 3. Approve Screenshot
Approve a pending screenshot (Admin only).

**Endpoint:** `PUT /screenshots/approve/{screenshotId}`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "adminComment": "Great gameplay! Approved."
}
```

**Success Response (200):**
```json
{
  "message": "Screenshot approved",
  "screenshot": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "approved",
    "adminComment": "Great gameplay! Approved.",
    "approvedBy": "507f1f77bcf86cd799439099",
    "approvedAt": "2026-01-16T11:00:00Z"
  }
}
```

---

### 4. Reject Screenshot
Reject a pending screenshot (Admin only).

**Endpoint:** `PUT /screenshots/reject/{screenshotId}`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "adminComment": "Image quality too low. Please resubmit."
}
```

**Success Response (200):**
```json
{
  "message": "Screenshot rejected",
  "screenshot": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "rejected",
    "adminComment": "Image quality too low. Please resubmit.",
    "approvedBy": "507f1f77bcf86cd799439099"
  }
}
```

---

### 5. Get Approved Screenshots
Get all approved screenshots for dashboard.

**Endpoint:** `GET /screenshots/approved`

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "player": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testplayer",
      "gameId": "123456789"
    },
    "imageUrl": "data:image/png;base64,...",
    "description": "Amazing 20 kill game",
    "kills": 20,
    "headshots": 5,
    "status": "approved",
    "approvedAt": "2026-01-16T11:00:00Z"
  }
]
```

---

### 6. Get User's Screenshots
Get all screenshots submitted by a specific user.

**Endpoint:** `GET /screenshots/user/{userId}`

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "status": "approved",
    "kills": 20,
    "createdAt": "2026-01-16T10:30:00Z"
  }
]
```

---

## ⚔️ Squad Endpoints

### 1. Create Squad
Create a new squad and send for approval.

**Endpoint:** `POST /squads/create`

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Dragon Slayers",
  "description": "Elite squad for ranked matches",
  "maxMembers": 4
}
```

**Success Response (201):**
```json
{
  "message": "Squad created and sent for approval",
  "squad": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Dragon Slayers",
    "description": "Elite squad for ranked matches",
    "leader": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testplayer"
    },
    "members": [],
    "maxMembers": 4,
    "status": "pending",
    "createdAt": "2026-01-16T10:30:00Z"
  }
}
```

---

### 2. Get Pending Squads
Get all pending squad requests (Admin only).

**Endpoint:** `GET /squads/pending`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Dragon Slayers",
    "leader": {
      "username": "testplayer",
      "gameId": "123456789"
    },
    "members": [],
    "maxMembers": 4,
    "status": "pending",
    "createdAt": "2026-01-16T10:30:00Z"
  }
]
```

---

### 3. Approve Squad
Approve a squad and select its members (Admin only).

**Endpoint:** `PUT /squads/approve/{squadId}`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "selectedMembers": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "adminComment": "Squad approved!"
}
```

**Success Response (200):**
```json
{
  "message": "Squad approved",
  "squad": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Dragon Slayers",
    "status": "approved",
    "members": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "testplayer"
      }
    ],
    "approvedAt": "2026-01-16T11:00:00Z"
  }
}
```

---

### 4. Reject Squad
Reject a squad request (Admin only).

**Endpoint:** `PUT /squads/reject/{squadId}`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "adminComment": "Incomplete member list"
}
```

**Success Response (200):**
```json
{
  "message": "Squad rejected",
  "squad": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "rejected",
    "adminComment": "Incomplete member list"
  }
}
```

---

### 5. Update Squad Name
Change squad name (Admin only).

**Endpoint:** `PUT /squads/update-name/{squadId}`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "name": "Phoenix Warriors"
}
```

**Success Response (200):**
```json
{
  "message": "Squad name updated",
  "squad": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Phoenix Warriors"
  }
}
```

---

### 6. Get Approved Squads
Get all approved squads.

**Endpoint:** `GET /squads/approved`

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Dragon Slayers",
    "leader": {
      "username": "testplayer",
      "gameId": "123456789"
    },
    "members": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "testplayer",
        "kills": 150
      }
    ],
    "status": "approved"
  }
]
```

---

### 7. Get User's Squad
Get the squad the user belongs to.

**Endpoint:** `GET /squads/user/{userId}`

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Dragon Slayers",
  "leader": {
    "username": "testplayer"
  },
  "members": [
    {
      "username": "testplayer",
      "gameId": "123456789",
      "kills": 150
    }
  ]
}
```

**Error Response (404):**
```json
{
  "message": "User not in any squad"
}
```

---

## 📊 Leaderboard Endpoints

### 1. Get Weekly Leaderboard
Get current week's rankings.

**Endpoint:** `GET /leaderboard/weekly`

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "week": "2026-W03",
    "player": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "testplayer",
      "gameId": "123456789"
    },
    "score": 100,
    "kills": 150,
    "wins": 25,
    "matches": 100,
    "rank": 1
  },
  {
    "_id": "507f1f77bcf86cd799439015",
    "week": "2026-W03",
    "player": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "anotherplayer",
      "gameId": "987654321"
    },
    "score": 80,
    "kills": 120,
    "wins": 20,
    "matches": 90,
    "rank": 2
  }
]
```

---

### 2. Get User Rank
Get specific user's current rank.

**Endpoint:** `GET /leaderboard/user-rank/{userId}`

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "week": "2026-W03",
  "rank": 1,
  "score": 100
}
```

---

### 3. Reset Weekly Scores
Reset scores for new week (Admin only).

**Endpoint:** `POST /leaderboard/reset-weekly`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
{
  "message": "Weekly scores reset",
  "leaderboardEntries": [
    {
      "week": "2026-W03",
      "player": "507f1f77bcf86cd799439011",
      "score": 100,
      "rank": 1
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

```json
{
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error message"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Testing with Postman

### Import Collection

Create a new collection with all endpoints above.

### Set Variables

```json
{
  "base_url": "http://localhost:5000/api",
  "token": "{{JWT_TOKEN}}",
  "userId": "{{USER_ID}}"
}
```

### Example Request

```
GET {{base_url}}/auth/profile
Authorization: Bearer {{token}}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, add:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

---

## CORS

Currently enables all origins. For production, restrict to:

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

**API Version:** 1.0.0  
**Last Updated:** January 2026
