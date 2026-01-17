# STEP-BY-STEP DEPLOYMENT WALKTHROUGH

Complete instructions to deploy your app in 30 minutes.

---

## PART 1: ACCOUNT CREATION (5 minutes)

### 1. Create GitHub Account (if needed)
- Go to https://github.com
- Sign up with email
- Verify email
- ✅ Done!

### 2. Create MongoDB Atlas Account
- Go to https://free.mongodb.com
- Click "Try Free"
- Sign up with email
- Verify email
- ✅ Done!

### 3. Create Render Account
- Go to https://render.com
- Click "Get Started"
- Sign up with GitHub (easier!)
- Authorize Render to access GitHub
- ✅ Done!

### 4. Create Vercel Account
- Go to https://vercel.com
- Click "Sign Up"
- Click "Continue with GitHub"
- Authorize Vercel
- ✅ Done!

---

## PART 2: GITHUB SETUP (5 minutes)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `blackvale-guild`
   - **Description**: BlackVale Guild Management System
   - **Public** or **Private** (your choice)
3. Click "Create repository"
4. Copy the HTTPS URL (you'll need it next)

### Step 2: Push Code to GitHub

Open PowerShell and run:

```powershell
cd "d:\GUILD WEB\GUILD WEB"
git remote add origin https://github.com/YOUR_USERNAME/blackvale-guild.git
git branch -M main
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username!

When it asks for credentials:
- **Username**: Your GitHub username
- **Password**: Your GitHub personal access token
  - (If you don't have one: github.com/settings/tokens > Generate new token)

### Step 3: Verify Push

1. Go to https://github.com/YOUR_USERNAME/blackvale-guild
2. You should see all your files!
3. ✅ Done!

---

## PART 3: MONGODB SETUP (10 minutes)

### Step 1: Create Cluster

1. Log in to MongoDB Atlas (free.mongodb.com)
2. Click "Create a Cluster"
3. Select **M0 (Free Forever)**
4. Choose region closest to you
5. Click "Create Cluster"
6. Wait 5 minutes for cluster to be created

### Step 2: Create Database User

1. In MongoDB Atlas, click "Database" on left
2. Click the cluster name
3. Go to "Security" > "Database Access"
4. Click "Add New Database User"
5. Fill in:
   - **Username**: `guilladmin`
   - **Password**: Choose a strong password (save it!)
   - **User Privileges**: `Built-in Role` > `Atlas Admin`
6. Click "Add User"

### Step 3: Get Connection String

1. Go to "Database" > Your cluster
2. Click "Connect"
3. Choose "Drivers"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string:
   ```
   mongodb+srv://guilladmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password

### Step 4: Allow Render to Connect

1. Go to "Security" > "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Add IP: `0.0.0.0/0`
5. Click "Confirm"

This allows Render (your backend host) to connect to MongoDB.

### Step 5: Save Your Connection String

You'll need this in the next section:
```
mongodb+srv://guilladmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/blackvale-guild?retryWrites=true&w=majority
```

---

## PART 4: DEPLOY BACKEND ON RENDER (10 minutes)

### Step 1: Create Web Service

1. Log in to https://render.com
2. Click "New +"
3. Click "Web Service"
4. Connect your GitHub account if not already done
5. Select repository: `blackvale-guild`
6. Click "Connect"

### Step 2: Configure Service

Fill in these fields:

- **Name**: `blackvale-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Plan**: `Free` (it's already selected)

### Step 3: Add Environment Variables

Click "Environment" section and add these:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `JWT_SECRET` | Generate a random string (example: `MySuper$ecureKey123!@#`) |
| `MONGODB_URI` | Your MongoDB connection string from Part 3 |

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for it to build and deploy (2-3 minutes)
3. You'll see "Your service is live"
4. Copy the service URL (e.g., `https://blackvale-backend.onrender.com`)
5. Save this URL! You need it next.

✅ Backend is now LIVE!

---

## PART 5: DEPLOY FRONTEND ON VERCEL (10 minutes)

### Step 1: Create Vercel Project

1. Log in to https://vercel.com
2. Click "New Project"
3. Click "Import Git Repository"
4. Find and select `blackvale-guild`
5. Click "Import"

### Step 2: Configure Project

1. **Project Name**: `blackvale-guild` (already filled)
2. **Framework**: Select `Create React App`
3. **Root Directory**: Click "Edit" and select `frontend`
4. Leave other settings as default

### Step 3: Add Environment Variable

1. In the same page, find "Environment Variables" section
2. Add:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: Your Render backend URL (from Part 4)
     - Example: `https://blackvale-backend.onrender.com`
3. Click "Add"

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment (1-2 minutes)
3. You'll see "Congratulations! Your project has been deployed"
4. Copy the frontend URL (e.g., `https://blackvale-guild.vercel.app`)
5. ✅ Frontend is now LIVE!

---

## PART 6: SET UP AUTOMATION (5 minutes)

### Step 1: Get Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: `GUILD_DEPLOYMENT`
4. Expiration: `No expiration`
5. Click "Create"
6. Copy the token (you'll need it next)

### Step 2: Get Render Deploy Hook

1. Log in to Render: https://dashboard.render.com
2. Select your backend service: `blackvale-backend`
3. Go to "Settings"
4. Find "Deploy Hook"
5. Copy the URL

### Step 3: Add GitHub Secrets

1. Go to your GitHub repository:
   https://github.com/YOUR_USERNAME/blackvale-guild
2. Click "Settings"
3. Click "Secrets and variables" > "Actions"
4. Click "New repository secret"

**Add Secret 1: VERCEL_TOKEN**
- Name: `VERCEL_TOKEN`
- Value: (paste your Vercel token from Step 1)
- Click "Add Secret"

**Add Secret 2: RENDER_DEPLOY_HOOK_BACKEND**
- Name: `RENDER_DEPLOY_HOOK_BACKEND`
- Value: (paste your Render deploy hook from Step 2)
- Click "Add Secret"

✅ Automation is now SET UP!

---

## PART 7: TEST EVERYTHING (5 minutes)

### Test 1: Visit Your Live App

1. Open browser
2. Go to your Vercel frontend URL:
   ```
   https://blackvale-guild.vercel.app
   ```
3. Try:
   - Register a new account
   - Log in
   - Create a squad
   - Submit a screenshot

### Test 2: Check for Errors

1. Press `F12` to open Developer Console
2. Check "Console" tab for red error messages
3. Check "Network" tab to see if requests go to your backend
4. If red errors, note them down (we can fix)

### Test 3: Test Auto-Deployment

1. Open your project in VS Code
2. Edit `frontend/src/components/Navbar.js`
3. Change the title text (any small change)
4. Save the file
5. Run these commands:
   ```powershell
   cd "d:\GUILD WEB\GUILD WEB"
   git add .
   git commit -m "Test auto-deploy"
   git push origin main
   ```
6. Watch GitHub:
   - Go to your repo > "Actions" tab
   - Watch the workflow run
7. Watch Render:
   - Go to backend service > "Logs"
   - See if it re-deploys
8. Wait 1-2 minutes
9. Visit your Vercel URL
10. See your changes live!

✅ Everything is working!

---

## COMMON ISSUES & FIXES

### "Cannot connect to backend"

**Error**: Frontend loads but buttons don't work, console shows "Failed to fetch"

**Fix**:
1. Check Vercel environment variables
2. Verify `REACT_APP_API_URL` matches your Render URL
3. Redeploy Vercel frontend

### "MongoDB connection failed"

**Error**: Backend logs show "MongoDB connection error"

**Fix**:
1. Check MongoDB Atlas connection string in Render environment
2. Verify IP is whitelisted (0.0.0.0/0)
3. Check username/password is correct
4. Redeploy backend

### "Render backend is slow"

**Normal behavior**: Free tier sleeps after 15 minutes. First request takes 30 seconds.

**Fix**: Just wait or upgrade to paid tier later

### "Changes not showing up"

**Fix**:
1. Hard refresh browser: `Ctrl+Shift+R`
2. Clear browser cache
3. Check GitHub Actions completed successfully
4. Check Vercel deployment shows "Ready"

---

## FINAL CHECKLIST

- [ ] GitHub account created
- [ ] MongoDB Atlas account created
- [ ] Render account created
- [ ] Vercel account created
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] MongoDB cluster created
- [ ] Database user created (guilladmin)
- [ ] IP whitelisted (0.0.0.0/0)
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set in Render
- [ ] Environment variables set in Vercel
- [ ] GitHub secrets added
- [ ] Frontend URL tested
- [ ] Auto-deploy tested

✅ All done! Your app is now hosted for FREE with automation!

---

## YOUR LIVE URLS

**Frontend**: https://blackvale-guild.vercel.app  
**Backend**: https://blackvale-backend.onrender.com  
**Repository**: https://github.com/YOUR_USERNAME/blackvale-guild  

Share the **Frontend URL** with players!

---

## NEXT STEPS

1. Set a custom domain (optional, both platforms support free domains)
2. Monitor logs regularly
3. Make improvements based on user feedback
4. When ready to scale, upgrade from free tier
5. Consider adding email notifications

---

## SUPPORT

- **Stuck?** Check the detailed guide: `DEPLOYMENT_FREE_HOSTING.md`
- **Quick reference?** Check: `FREE_HOSTING_CHECKLIST.md`
- **General help?** Check: `FREE_HOSTING_SUMMARY.md`

---

**Congratulations! Your app is live and automated! 🎉**

