# Configuration Guide

## Environment Variables

### Backend (.env)

Located in `/backend/.env`

```env
# Server Port
PORT=5000

# Database Connection
MONGODB_URI=mongodb://localhost:27017/blackvale-guild

# JWT Secret (change this in production!)
JWT_SECRET=your_jwt_secret_key_change_in_production

# Environment
NODE_ENV=development
```

### Environment Configurations

#### Development
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blackvale-guild
JWT_SECRET=dev_secret_key
NODE_ENV=development
```

#### Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blackvale-guild
JWT_SECRET=generate_strong_secret_key_here
NODE_ENV=production
```

#### MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster
4. Click "Connect"
5. Choose "Connect your application"
6. Copy connection string
7. Replace `<password>` with your password
8. Paste in `.env` as `MONGODB_URI`

Example:
```
MONGODB_URI=mongodb+srv://myuser:mypassword@mycluster.mongodb.net/blackvale-guild?retryWrites=true&w=majority
```

---

## Database Initialization

### Create Default Admin

Run this in MongoDB:

```javascript
// Using MongoDB Compass or mongo shell
db.users.insertOne({
  username: "admin",
  email: "admin@blackvale.com",
  password: "$2a$10$...", // bcrypt hash of "admin123"
  role: "admin",
  gameId: "ADMIN-001",
  kills: 0,
  deaths: 0,
  wins: 0,
  matches: 0,
  weeklyScore: 0,
  weeklyRank: 0,
  createdAt: new Date()
})
```

Or use the application:
1. Register normal account
2. Update role via MongoDB console

```javascript
db.users.updateOne(
  { email: "admin@blackvale.com" },
  { $set: { role: "admin" } }
)
```

---

## Database Collections

The application automatically creates these collections:

### users
- Stores player and admin accounts
- Indexes: email, username, gameId

### screenshots
- Stores screenshot submissions
- Indexes: player, status, createdAt

### squads
- Stores squad information
- Indexes: leader, status, createdAt

### leaderboards
- Stores weekly rankings
- Indexes: week, player, rank

---

## API Configuration

### CORS Settings

Frontend communicates with backend on:
- Development: `http://localhost:5000`
- Production: Update proxy in `frontend/package.json`

```json
{
  "proxy": "http://localhost:5000"
}
```

For production, update to your domain:
```json
{
  "proxy": "https://api.yourdomain.com"
}
```

### JWT Configuration

Token validity: 7 days
Algorithm: HS256
Payload:
```javascript
{
  userId: string,
  role: "player" | "admin",
  iat: timestamp,
  exp: timestamp
}
```

---

## File Upload Configuration

### Screenshot Image Limits
- Max file size: 50MB (configurable in server.js)
- Accepted formats: JPEG, PNG, GIF, WebP
- Storage: Database (Base64 encoding)

To increase limit, modify `server.js`:
```javascript
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
```

---

## Performance Tuning

### MongoDB Optimization

Add indexes for faster queries:

```javascript
// In MongoDB shell
db.users.createIndex({ email: 1 })
db.users.createIndex({ username: 1 })
db.screenshots.createIndex({ player: 1, status: 1 })
db.screenshots.createIndex({ createdAt: -1 })
db.squads.createIndex({ leader: 1 })
db.squads.createIndex({ status: 1 })
db.leaderboards.createIndex({ week: 1, rank: 1 })
```

### Backend Performance

1. Use production builds:
```bash
npm run build
```

2. Enable compression:
```javascript
const compression = require('compression');
app.use(compression());
```

3. Set NODE_ENV=production:
```bash
NODE_ENV=production npm start
```

---

## Backup & Recovery

### MongoDB Backup

Using mongodump:
```bash
mongodump --uri="mongodb://localhost:27017/blackvale-guild" --out=./backup
```

Using MongoDB Atlas:
1. Go to Backup tab in cluster
2. Create on-demand snapshot
3. Download or restore as needed

### Data Recovery

Using mongorestore:
```bash
mongorestore --uri="mongodb://localhost:27017/blackvale-guild" ./backup/blackvale-guild
```

---

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS in production
- [ ] Enable MongoDB authentication
- [ ] Set NODE_ENV=production
- [ ] Add rate limiting middleware
- [ ] Enable input validation
- [ ] Use secure password policies
- [ ] Enable CORS restrictions
- [ ] Add logging for audit trail
- [ ] Regular backups scheduled
- [ ] Update dependencies regularly
- [ ] Use environment-specific configs

---

## Troubleshooting

### Connection Issues

**MongoDB won't connect:**
```
Error: connect ECONNREFUSED
```

Solution: Ensure MongoDB is running
```bash
# Check MongoDB status
mongosh --eval "db.adminCommand('ping')"
```

**Network timeout:**
- Increase connection timeout in `.env`
- Check firewall rules
- Verify MongoDB URI syntax

### Performance Issues

**Slow queries:**
1. Check MongoDB indexes
2. Monitor query performance
3. Add caching layer
4. Optimize database queries

**Memory usage:**
1. Limit results pagination
2. Use streaming for large datasets
3. Implement garbage collection
4. Monitor Node process memory

---

## Scaling Guide

### Horizontal Scaling

For multiple backend instances:

1. Set up load balancer (nginx, Apache)
2. Start multiple Node instances on different ports
3. Use Redis for session management
4. Use MongoDB replicas for redundancy

### Vertical Scaling

1. Increase server resources (CPU, RAM)
2. Optimize database queries
3. Add caching (Redis)
4. Use CDN for static assets

---

## Monitoring

### Log Management

Enable logging:
```javascript
// Add to server.js
const morgan = require('morgan');
app.use(morgan('combined'));
```

### Metrics to Monitor

1. API response time
2. Database query time
3. Error rate
4. User activity
5. Storage usage
6. Memory usage
7. CPU usage

---

## Support

For configuration help:
1. Check MongoDB documentation
2. Check Node.js documentation
3. Review error logs
4. Check browser console (F12)

---

**Last Updated:** January 2026
**Version:** 1.0.0
