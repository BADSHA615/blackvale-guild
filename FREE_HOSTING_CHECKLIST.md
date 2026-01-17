# FREE HOSTING DEPLOYMENT CHECKLIST

Follow these steps in order to deploy your application for FREE with full automation.

## ✅ Phase 1: Preparation (5 minutes)

- [ ] Read `DEPLOYMENT_FREE_HOSTING.md`
- [ ] Create GitHub account (if don't have one)
- [ ] Create MongoDB Atlas account (free.mongodb.com)
- [ ] Create Render account (render.com)
- [ ] Create Vercel account (vercel.com)

## ✅ Phase 2: Database Setup (10 minutes)

- [ ] Create MongoDB Atlas cluster (M0 free tier)
- [ ] Create database user (guilladmin / your password)
- [ ] Whitelist 0.0.0.0/0 in Network Access
- [ ] Copy MongoDB connection string
- [ ] Update `backend/.env` with MONGODB_URI

## ✅ Phase 3: GitHub Setup (5 minutes)

- [ ] Create new GitHub repository: `blackvale-guild`
- [ ] Run: `git remote add origin https://github.com/YOUR_USERNAME/blackvale-guild.git`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit"`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`

## ✅ Phase 4: Backend Deployment on Render (10 minutes)

- [ ] Go to render.com and sign up with GitHub
- [ ] Create new Web Service
- [ ] Connect your GitHub repository
- [ ] Set Name: `blackvale-backend`
- [ ] Set Runtime: Node
- [ ] Set Build Command: `cd backend && npm install`
- [ ] Set Start Command: `cd backend && npm start`
- [ ] Add Environment Variables:
  - NODE_ENV: `production`
  - PORT: `5000`
  - JWT_SECRET: `generate-secure-string-here`
  - MONGODB_URI: `your-mongodb-connection-string`
- [ ] Click Deploy
- [ ] Wait for deployment (2-3 minutes)
- [ ] Copy backend URL (e.g., `https://blackvale-backend.onrender.com`)

## ✅ Phase 5: Frontend Deployment on Vercel (10 minutes)

- [ ] Go to vercel.com and sign up with GitHub
- [ ] Create New Project
- [ ] Import `blackvale-guild` repository
- [ ] Set Root Directory: `frontend`
- [ ] Add Environment Variable:
  - REACT_APP_API_URL: `https://blackvale-backend.onrender.com` (your Render URL)
- [ ] Click Deploy
- [ ] Wait for deployment (1-2 minutes)
- [ ] Copy frontend URL (e.g., `https://blackvale-guild.vercel.app`)

## ✅ Phase 6: Automation Setup (5 minutes)

- [ ] Get Vercel Token (vercel.com/account/tokens)
- [ ] Go to GitHub repository > Settings > Secrets
- [ ] Add Secret: `VERCEL_TOKEN` = (your token)
- [ ] Get Render Deploy Hook from backend settings
- [ ] Add Secret: `RENDER_DEPLOY_HOOK_BACKEND` = (your hook URL)
- [ ] GitHub Actions workflow is ready! (`deploy.yml`)

## ✅ Phase 7: Testing (5 minutes)

- [ ] Visit Vercel frontend URL in browser
- [ ] Test login functionality
- [ ] Test creating a squad
- [ ] Test uploading screenshots
- [ ] Check browser console (F12) for errors
- [ ] Check Render logs for backend errors

## ✅ Phase 8: Verify Automation

- [ ] Make a small change to frontend (e.g., edit Navbar.js)
- [ ] Run: `git add . && git commit -m "Test auto-deploy" && git push`
- [ ] Watch GitHub Actions run (Actions tab)
- [ ] Verify Render backend auto-deploys
- [ ] Verify Vercel frontend auto-deploys
- [ ] Check changes are live on production URL

## 🎉 DONE! Your app is now:

✅ Hosted for FREE  
✅ Auto-deploys on every push  
✅ Fully automated testing  
✅ HTTPS secured  
✅ Globally distributed  

## Cost: $0/month

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend not connecting | Check REACT_APP_API_URL in Vercel env vars |
| MongoDB connection fails | Update whitelist IP to 0.0.0.0/0 in MongoDB Atlas |
| Render spins down | Free tier sleeps after 15min - wait a moment to wake |
| Deploy not triggering | Check `.github/workflows/deploy.yml` exists in repo |

---

## 📞 Support Links

- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- MongoDB: https://mongodb.com/docs/atlas
- GitHub: https://docs.github.com

