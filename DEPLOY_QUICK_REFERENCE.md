# 🚀 QUICK DEPLOYMENT CHECKLIST

## Phase 1: GitHub Setup (5 minutes)

```powershell
cd "c:\Users\towhi\Desktop\GUILD WEB"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/blackvale-guild.git
git push -u origin main
```

✅ Your code is on GitHub

---

## Phase 2: MongoDB Atlas (10 minutes)

1. Go to: https://mongodb.com/cloud/atlas
2. Create cluster (Free tier)
3. Create user: `admin`
4. Allow all IPs
5. Get connection string:
   ```
   mongodb+srv://admin:PASSWORD@cluster.mongodb.net/blackvale-guild?retryWrites=true&w=majority
   ```
6. **Save this string!**

✅ Database is ready

---

## Phase 3: Deploy Backend (10 minutes)

1. Go to: https://render.com
2. Login with GitHub
3. New Web Service → Select `blackvale-guild` repo
4. Configure:
   - **Name:** `blackvale-backend`
   - **Build:** `npm install`
   - **Start:** `npm start`
   - **Root:** `backend`

5. Add Environment Variables:
   ```
   MONGODB_URI = mongodb+srv://admin:PASSWORD@cluster.mongodb.net/blackvale-guild?retryWrites=true&w=majority
   JWT_SECRET = change_this_to_random_string_12345
   NODE_ENV = production
   ```

6. Deploy
7. **Copy backend URL** (https://blackvale-backend.onrender.com)

✅ Backend is live

---

## Phase 4: Update Frontend

Edit: `frontend/.env.production`

```env
REACT_APP_API_URL=https://blackvale-backend.onrender.com
```

Push to GitHub:
```powershell
git add frontend/.env.production
git commit -m "Update API URL for production"
git push
```

✅ Frontend config is updated

---

## Phase 5: Deploy Frontend (5 minutes)

1. Go to: https://netlify.com
2. Login with GitHub
3. New site from Git → Select `blackvale-guild` repo
4. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish:** `build`

5. Add Environment Variable:
   ```
   REACT_APP_API_URL = https://blackvale-backend.onrender.com
   ```

6. Deploy
7. **Get your frontend URL** (https://your-site.netlify.app)

✅ Frontend is live

---

## Phase 6: Test Everything (5 minutes)

1. Visit your Netlify URL
2. Register account
3. In MongoDB Atlas, change role to `admin`
4. Login and verify admin panel shows
5. Test screenshot submission
6. Test admin approval
7. Check leaderboard

✅ Everything works!

---

## 📝 Summary

| What | Where | Time |
|------|-------|------|
| Code | GitHub | 5 min |
| Database | MongoDB Atlas | 10 min |
| Backend | Render | 10 min |
| Frontend | Netlify | 5 min |
| Testing | Your site | 5 min |
| **TOTAL** | | **35 min** |

---

## 🔄 Auto-Deployment

After this, every time you push to GitHub:
```
git add .
git commit -m "Your change"
git push
```

Your site updates automatically in 2-5 minutes! ✅

---

## 📍 Final URLs

- **Live Site:** https://your-site.netlify.app
- **Admin Panel:** https://your-site.netlify.app/admin
- **API:** https://blackvale-backend.onrender.com
- **Database:** MongoDB Atlas dashboard

---

**Read full guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
