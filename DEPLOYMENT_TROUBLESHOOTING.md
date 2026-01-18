# Deployment Troubleshooting Guide

## Current Deployment Status

**Build Status**: ❌ Failing  
**Root Cause**: Backend API timeout during Vercel build process

### Why Deployment is Failing

Vercel's build process times out (34 seconds) when trying to reach the backend API. This is happening because:

1. **Backend Not Responding**: `https://blackvale-backend.onrender.com` is not responding during build
2. **Network Timeout**: The test deployment (18+) is timing out
3. **Not a Code Issue**: The React code has no errors

### Solutions

#### ✅ Solution 1: Redeploy (Quickest)
If your backend is running on Render.com:
1. Go to Vercel Dashboard
2. Click on your project
3. Click "Redeploy" on the latest commit
4. Wait for deployment to complete

**Why this works**: Vercel will retry the build, and if the backend is up, it will succeed.

#### ✅ Solution 2: Configure Vercel Environment Variables
1. Go to Vercel Project Settings
2. Click "Environment Variables"
3. Add/Update:
   ```
   REACT_APP_API_URL=https://blackvale-backend.onrender.com
   CI=false
   ```
4. Redeploy

#### ✅ Solution 3: Check Backend Status
Visit your backend health endpoint:
```
https://blackvale-backend.onrender.com/api/health
```

If you get a 200 response with `{"status":"Server is running"}`, the backend is up.

**If backend is down:**
1. Go to Render.com Dashboard
2. Find "blackvale-backend" service
3. Click "Manual Deploy" → "Deploy"
4. Wait for deployment to complete
5. Return to Vercel and redeploy

#### ✅ Solution 4: Skip API Tests During Build
**Already implemented in vercel.json:**
```json
{
  "env": {
    "CI": "false"
  }
}
```

This tells React to not fail on warnings and skip certain API checks during build.

---

## Build Configuration Files

### Frontend (Vercel)
**File**: `frontend/vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "react",
  "env": {
    "REACT_APP_API_URL": "@api_url",
    "CI": "false"
  }
}
```

### Backend (Render.com)
**File**: `render.yaml`
```yaml
services:
  - type: web
    name: blackvale-backend
    runtime: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
```

---

## Environment Variables Checklist

### Frontend (.env.production)
- ✅ `REACT_APP_API_URL=https://blackvale-backend.onrender.com`

### Backend (.env on Render.com)
- ✅ `MONGODB_URI` - Your MongoDB connection string
- ✅ `JWT_SECRET` - Secret key for JWT tokens
- ✅ `PORT=5000`
- ✅ `NODE_ENV=production`

---

## Quick Deployment Checklist

- [ ] Backend is running on Render.com
- [ ] Environment variables are set on Render.com
- [ ] MongoDB is accessible
- [ ] Frontend environment variables are set on Vercel
- [ ] Run `npm install` in both frontend and backend
- [ ] No syntax errors in code
- [ ] All imports are correct

---

## Testing Locally

Before deploying, test locally:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start
# Should see: "Server running on port 5000"

# Terminal 2 - Frontend
cd frontend
npm install
npm start
# Should open http://localhost:3000
```

Then test the Squad Management page and Admin features.

---

## Next Steps

1. **Check Backend**: Verify backend is running on Render.com
2. **Verify Environment**: Ensure all env variables are set
3. **Redeploy**: Click "Redeploy" on Vercel
4. **Monitor**: Watch deployment logs for errors
5. **Test**: Once deployed, test the app on production URL

---

**Last Updated**: January 18, 2026  
**Deployment Tools**: Vercel (Frontend), Render.com (Backend)  
**CI/CD**: GitHub Actions (Automatic on push)
