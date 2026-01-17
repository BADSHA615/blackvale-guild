# Free Hosting & Deployment Guide

This guide walks you through deploying the BlackVale Guild Management System to free platforms with full automation.

## Overview

- **Frontend**: Deployed on Vercel (free)
- **Backend**: Deployed on Render (free)
- **Database**: MongoDB Atlas (free M0 cluster)
- **CI/CD**: GitHub Actions (free)

## Prerequisites

1. GitHub Account (free)
2. MongoDB Atlas Account (free)
3. Render Account (free)
4. Vercel Account (free)

---

## Step 1: Set Up MongoDB Atlas (Free Database)

### Create MongoDB Atlas Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in (free account)
3. Create a new project called "BlackVale Guild"
4. Click "Build a Cluster"
5. Select the **M0 (Free Forever)** tier
6. Choose your region closest to your users
7. Complete cluster setup (takes ~5-10 minutes)

### Get Connection String

1. In Atlas Dashboard, click "Connect"
2. Choose "Drivers"
3. Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`
4. Replace `username`, `password`, and `database` with your actual values

**Example:**
```
mongodb+srv://guilladmin:MySecurePass123@cluster0.abc123.mongodb.net/blackvale-guild?retryWrites=true&w=majority
```

---

## Step 2: Push Code to GitHub

### Initialize Git Repository

```bash
cd "d:\GUILD WEB\GUILD WEB"
git add .
git commit -m "Initial commit: BlackVale Guild Management System"
```

### Push to GitHub

1. Create a new repository on GitHub.com (name it `blackvale-guild`)
2. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/blackvale-guild.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend on Render

### Create Render Account & Service

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (easier for deployment)
3. Click "New +" > "Web Service"
4. Select your `blackvale-guild` repository
5. Configure:
   - **Name**: `blackvale-backend`
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free
   - **Region**: Choose closest to you

### Add Environment Variables

In Render dashboard for your backend service:

1. Go to "Environment"
2. Add these variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=GenerateASecureRandomString123!@#
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blackvale-guild?retryWrites=true&w=majority
```

3. Click "Deploy"

**Save your Render backend URL** (e.g., `https://blackvale-backend.onrender.com`)

---

## Step 4: Deploy Frontend on Vercel

### Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework**: React
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

### Add Environment Variables

1. In project settings, go to "Environment Variables"
2. Add:

```
REACT_APP_API_URL=https://your-backend-app.onrender.com
```

(Replace with your actual Render backend URL from Step 3)

3. Click "Deploy"

---

## Step 5: Set Up GitHub Actions (CI/CD Automation)

The `.github/workflows/deploy.yml` file is already configured. Here's what it does:

1. **Runs tests** when you push code
2. **Automatically deploys** to Render and Vercel on push to `main` branch

### Configure Secrets

Go to your GitHub repository:
1. Settings > Secrets > New repository secret
2. Add these secrets:

```
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-vercel-org-id>
RENDER_DEPLOY_HOOK_BACKEND=<your-render-deploy-hook>
```

### Get Vercel Token

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Copy and save it as `VERCEL_TOKEN`

### Get Render Deploy Hook

1. In Render dashboard, go to your backend service
2. Go to "Settings" > "Deploy Hook"
3. Copy the URL and save it as `RENDER_DEPLOY_HOOK_BACKEND`

---

## Step 6: Update API URLs

Now that you have deployment URLs, update the frontend:

**In `frontend/.env.production`:**
```
REACT_APP_API_URL=https://your-backend-app.onrender.com
```

Commit and push:
```bash
git add .
git commit -m "Update production API URLs"
git push origin main
```

This will trigger automatic deployment!

---

## Step 7: Test Everything

1. Visit your Vercel frontend URL
2. Try logging in, creating a squad, submitting screenshots
3. Check browser console (F12) for any errors
4. Check Render logs for backend errors

---

## Troubleshooting

### Backend returns 503 (Service Unavailable)

- Render free tier spins down after 15 minutes of inactivity
- Solution: Wait a moment or use a service like [kaffeine.herokuapp.com](https://kaffeine.herokuapp.com) to keep it alive

### Frontend can't connect to backend

- Check `REACT_APP_API_URL` in Vercel environment variables
- Verify CORS is enabled in backend
- Check backend logs in Render dashboard

### MongoDB connection fails

- Verify connection string in `MONGODB_URI`
- Check MongoDB Atlas whitelist includes Render's IP
- In MongoDB Atlas: Database > Security > Network Access > Add IP Address > 0.0.0.0/0

---

## Cost Breakdown

| Service | Cost | Limits |
|---------|------|--------|
| Vercel  | Free | Unlimited deployments |
| Render  | Free | 750 free hours/month, spins down after 15 min inactivity |
| MongoDB Atlas | Free | 512MB storage, M0 cluster |
| GitHub Actions | Free | 2000 minutes/month |

**Total Cost: $0/month** (Everything is free!)

---

## Useful Commands

### Deploy changes
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Check Render logs
Visit Render dashboard > Select service > Logs

### Check Vercel logs
Visit Vercel dashboard > Select project > Deployments > Select deployment > Logs

### Local development
```bash
npm run dev    # In backend directory
npm start      # In frontend directory
```

---

## Next Steps

1. Set custom domain (Vercel & Render support free domains)
2. Enable HTTPS (automatic on both platforms)
3. Monitor performance with Vercel Analytics
4. Add email notifications for deployments
5. Scale up when needed (both platforms offer paid tiers)

---

## Support

For deployment issues:
- Render Docs: [render.com/docs](https://render.com/docs)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas Docs: [mongodb.com/docs/atlas](https://mongodb.com/docs/atlas)

