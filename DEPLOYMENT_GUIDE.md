# 🚀 Deployment Guide - Netlify + Render

Complete step-by-step guide to deploy your BlackVale Guild Management System online with automatic deployment.

---

## 📋 Prerequisites

- GitHub account (free)
- Netlify account (free)
- Render account (free)
- MongoDB Atlas account (free)

---

## 🗂️ Part 1: Prepare Your Code

### Step 1.1: Push Code to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `blackvale-guild`
   - Click "Create repository"

2. **Push your code:**
   ```powershell
   cd "c:\Users\towhi\Desktop\GUILD WEB"
   git init
   git add .
   git commit -m "Initial commit: BlackVale Guild Management System"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/blackvale-guild.git
   git push -u origin main
   ```

3. **Or use GitHub Desktop:**
   - Download: https://desktop.github.com
   - Add local repository from `c:\Users\towhi\Desktop\GUILD WEB`
   - Publish to GitHub

---

## 🗄️ Part 2: MongoDB Atlas Setup

### Step 2.1: Create Free Cluster

1. Go to: https://mongodb.com/cloud/atlas
2. Sign up / Login
3. Click **"Create a Project"**
4. Name: `blackvale-guild`
5. Click **"Create Project"**

### Step 2.2: Create Database

1. Click **"Build a Cluster"**
2. Choose **"Free Tier"**
3. Select region closest to you
4. Click **"Create Cluster"**
5. Wait 2-3 minutes for cluster to be created

### Step 2.3: Set Security

1. Click **"Security"** → **"Database Access"**
2. Click **"Add New Database User"**
3. Username: `admin`
4. Password: Generate secure password
5. Role: **Atlas Admin**
6. Click **"Add User"**

### Step 2.4: Network Access

1. Click **"Security"** → **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Confirm

### Step 2.5: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"**
4. Copy the connection string
5. Replace `<password>` with your database password
6. Copy the full string (you'll need it soon)

**Example format:**
```
mongodb+srv://admin:yourpassword@cluster.mongodb.net/blackvale-guild?retryWrites=true&w=majority
```

---

## 🎮 Part 3: Deploy Backend to Render

### Step 3.1: Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3.2: Create Web Service

1. Click **"New"** → **"Web Service"**
2. Select your `blackvale-guild` repository
3. Click **"Connect"**

### Step 3.3: Configure Deployment

Fill in the following:

| Field | Value |
|-------|-------|
| **Name** | `blackvale-backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Root Directory** | `backend` |

### Step 3.4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add each variable:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGODB_URI` | `mongodb+srv://admin:yourpassword@cluster.mongodb.net/blackvale-guild?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your_super_secret_key_change_this_12345` |
| `NODE_ENV` | `production` |

### Step 3.5: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once live, you'll see a URL like:
   ```
   https://blackvale-backend.onrender.com
   ```
4. **Copy this URL** - you'll need it next!

### Step 3.6: Test Backend

Visit: `https://blackvale-backend.onrender.com/api/health`

You should see:
```json
{"status":"Server is running"}
```

---

## 🎨 Part 4: Deploy Frontend to Netlify

### Step 4.1: Create Netlify Account

1. Go to: https://netlify.com
2. Sign up with GitHub
3. Authorize Netlify

### Step 4.2: Update Frontend API URL

**IMPORTANT:** Update your frontend to use the Render backend URL.

Edit: `frontend/src/services/api.js`

Find this line:
```javascript
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

Make sure it matches (it should already be correct).

### Step 4.3: Update Environment File

Edit: `frontend/.env.production`

Replace `https://blackvale-backend.onrender.com` with your actual Render URL:

```env
REACT_APP_API_URL=https://blackvale-backend.onrender.com
```

### Step 4.4: Create New Site

1. Go to https://netlify.com/drop
2. Or click **"New site from Git"**
3. Select your `blackvale-guild` repository
4. Click **"Connect"**

### Step 4.5: Configure Build

Fill in:

| Field | Value |
|-------|-------|
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `build` |

### Step 4.6: Add Environment Variables

Click **"Advanced"** → **"New variable"**

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://blackvale-backend.onrender.com` |

### Step 4.7: Deploy

1. Click **"Deploy site"**
2. Wait 2-3 minutes
3. Your site is live! You'll get a URL like:
   ```
   https://blackvale-guild.netlify.app
   ```

---

## ✅ Part 5: Test Everything

### 5.1: Test Frontend

1. Visit your Netlify URL
2. You should see the login page
3. Click "Register"
4. Create a test account:
   - Username: `testuser`
   - Email: `test@blackvale.com`
   - GameID: `TEST-001`
   - Password: `test123`

### 5.2: Test Admin Panel

1. Go to MongoDB Atlas
2. Go to "Collections" → "users"
3. Find your user
4. Click the pencil to edit
5. Change `role` from `"player"` to `"admin"`
6. Click "Update"
7. Refresh your website
8. Login again
9. You should now see **"Admin Panel"** in the navbar ✅

### 5.3: Test Features

- ✅ Submit a screenshot
- ✅ View dashboard
- ✅ Check leaderboard
- ✅ Access admin panel (if admin)
- ✅ Approve screenshots

---

## 🔄 Part 6: Automatic Deployment

### How It Works:

1. You make changes locally
2. Push to GitHub
3. Netlify & Render **automatically detect the push**
4. They automatically rebuild and deploy
5. Your site updates in 2-5 minutes ✅

### To Deploy Updates:

```powershell
cd "c:\Users\towhi\Desktop\GUILD WEB"
git add .
git commit -m "Your message here"
git push
```

That's it! Your changes go live automatically.

---

## 🎯 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB user created
- [ ] Network access configured
- [ ] Connection string copied
- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Frontend .env.production updated
- [ ] Frontend deployed to Netlify
- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] Can register new user
- [ ] Can login
- [ ] Admin features work

---

## 📊 Your Live URLs

Once deployed, save these URLs:

| Service | URL |
|---------|-----|
| **Frontend** | https://blackvale-guild.netlify.app |
| **Backend API** | https://blackvale-backend.onrender.com |
| **Admin Panel** | https://blackvale-guild.netlify.app/admin |
| **Database** | MongoDB Atlas Dashboard |

---

## 🆘 Troubleshooting

### "Connection Refused" Error

**Problem:** Frontend can't connect to backend

**Solutions:**
1. Check Render backend is running (check logs)
2. Verify .env.production has correct URL
3. Redeploy frontend after updating URL
4. Wait 5 minutes after backend deployment

### "MongoDB Connection Error"

**Problem:** Backend can't connect to database

**Solutions:**
1. Check connection string in Render env variables
2. Verify IP is whitelisted in MongoDB Atlas
3. Check username/password are correct
4. Check database name is correct

### "Admin Panel Not Showing"

**Problem:** Can't see admin features

**Solutions:**
1. Confirm role is set to `"admin"` in MongoDB
2. Logout and login again
3. Clear browser cache
4. Refresh the page

### "Build Failed"

**Problem:** Netlify/Render deployment fails

**Solutions:**
1. Check deployment logs
2. Make sure package.json has all dependencies
3. Check for syntax errors in code
4. Try redeploying manually

---

## 🔐 Security Tips

1. **Change JWT_SECRET** to a strong random string
2. **Use strong MongoDB password** (20+ characters)
3. **Never commit .env files** (already in .gitignore)
4. **Rotate passwords** regularly
5. **Use HTTPS** (automatic on Netlify & Render)

---

## 📈 Scale Up Later

If you need more power:

- **Backend:** Upgrade from Render free → paid plan
- **Database:** Upgrade MongoDB Atlas to paid cluster
- **Frontend:** Netlify has generous free limits

---

## 🎉 You're Done!

Your BlackVale Guild Management System is now **live on the internet** with:

✅ Real-time leaderboard  
✅ Admin panel for moderation  
✅ Automatic deployment on code push  
✅ Secure authentication  
✅ Cloud database  
✅ Professional hosting  

**Share your URL with friends!**

---

## 📞 Need Help?

- **Netlify Support:** https://netlify.com/support
- **Render Support:** https://render.com/docs
- **MongoDB Docs:** https://docs.mongodb.com/atlas

---

**Happy hosting! 🚀**
