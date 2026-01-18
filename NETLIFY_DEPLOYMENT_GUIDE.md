# Netlify Deployment Guide - BlackVale Guild

## ✅ Configuration Ready!

I've created a `netlify.toml` file that configures Netlify for your React frontend.

---

## Setup Steps

### Step 1: Connect GitHub to Netlify ✅
Already done (you said you've hosted it in Netlify)

### Step 2: Configure Environment Variables

1. Go to **Netlify Dashboard** → Your Site
2. Click **Site Settings** → **Build & Deploy** → **Environment**
3. Add this variable:
   ```
   REACT_APP_API_URL = https://blackvale-backend.onrender.com
   ```

### Step 3: Verify Build Settings

In Netlify Dashboard → **Site Settings** → **Build & Deploy**:

- **Base Directory**: `frontend`
- **Build Command**: `npm run build`
- **Publish Directory**: `frontend/build`
- **Node Version**: `18.x` or higher

### Step 4: Trigger Deploy

1. Go to **Deployments** tab
2. Click **Trigger Deploy** → **Deploy Site**
3. Or just **push a commit** to GitHub (auto-deploys)

---

## What netlify.toml Does

### 1. Build Configuration
```toml
[build]
  base = "frontend"          # Build from frontend folder
  command = "npm run build"  # Run build script
  publish = "build"          # Publish the build folder
```

### 2. Environment Variables
```toml
[build.environment]
  REACT_APP_API_URL = "https://blackvale-backend.onrender.com"
  CI = "false"
```

### 3. SPA Routing
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
**Why**: Makes React Router work properly (all routes go to index.html)

### 4. Security Headers
- Prevents XSS attacks
- Prevents clickjacking
- Proper content-type handling

### 5. Cache Control
- Static files cached for 1 year
- index.html never cached (always fresh)

### 6. API Proxy (Optional)
```toml
[[redirects]]
  from = "/api/*"
  to = "https://blackvale-backend.onrender.com/api/:splat"
```
**If you want**: Frontend `/api/squads` → Backend `https://blackvale-backend.onrender.com/api/squads`

---

## File Structure

```
GUILD WEB/
├── netlify.toml              ← NEW (Netlify config)
├── frontend/
│   ├── package.json
│   ├── vercel.json           ← OLD (not needed, Netlify uses netlify.toml)
│   ├── public/
│   └── src/
├── backend/
│   ├── package.json
│   └── src/
└── render.yaml               ← For backend deployment
```

---

## Troubleshooting

### Build Fails - "Cannot find module"
1. Check `frontend/package.json` has all dependencies
2. Run locally: `cd frontend && npm install && npm run build`
3. In Netlify, clear cache: **Deployments** → **Clear Cache & Redeploy**

### API Calls Timeout
1. Check backend is running: https://blackvale-backend.onrender.com/api/health
2. Verify `REACT_APP_API_URL` is set in Netlify environment variables
3. Check browser DevTools → Network tab for API requests

### Admin Controls Not Working
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check localStorage has `userRole` set to `admin`
4. Open DevTools (F12) → Application → localStorage

### "Page Not Found" on Navigation
This is a **routing issue**. The `netlify.toml` redirects should fix it:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

If still broken:
1. Verify `netlify.toml` is in the **root** directory (not in frontend folder)
2. **Clear cache and redeploy**: Netlify Dashboard → **Deploys** → **Clear Cache & Redeploy**

---

## Next Steps

1. ✅ Commit the `netlify.toml` file (I'll do this)
2. ✅ Push to GitHub
3. Go to Netlify Dashboard
4. Manually trigger deploy OR wait for auto-deploy
5. Check deployment logs for errors
6. Visit your site and test

---

## Quick Commands

```bash
# Test build locally
cd frontend
npm install
npm run build

# Start dev server
npm start

# Check for errors
npm run build 2>&1 | grep -i error
```

---

## Environment Variables Summary

### Frontend (Netlify)
- `REACT_APP_API_URL` = `https://blackvale-backend.onrender.com`
- `CI` = `false` (in netlify.toml)

### Backend (Render.com)
- `MONGODB_URI` = Your MongoDB connection string
- `JWT_SECRET` = Your JWT secret key
- `NODE_ENV` = `production`
- `PORT` = `5000`

---

## Support

If deployment still fails:
1. Check Netlify build logs: **Deployments** → Click deployment → **Deploy Log**
2. Check for error messages (usually at the end)
3. Common issues:
   - Missing environment variables
   - Backend not responding
   - Node version mismatch
   - Missing dependencies in package.json

---

**Status**: ✅ Ready for Netlify deployment
**Configuration File**: `netlify.toml` (in root directory)
**Last Updated**: January 18, 2026
