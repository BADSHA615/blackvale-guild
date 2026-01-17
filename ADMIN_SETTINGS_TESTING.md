# Admin Settings - Quick Start Testing Guide

## ⚡ Quick Test (5 minutes)

### Prerequisites
- ✅ User must be logged in with admin role
- ✅ Backend and frontend must be running
- ✅ MongoDB connection must be working

### Step-by-Step Test

#### 1. Access Admin Panel
```
URL: http://localhost:3000/admin (local)
     https://blackvale.netlify.app/admin (production)
```

#### 2. Look for Settings Tab
You should see three tabs:
- Screenshots (number of pending)
- Squads (number of pending)
- ⚙️ Settings ← CLICK THIS

#### 3. Test Website Name Change
```
Field: Website Name
Current: (should show current value or default)
Action: Clear and type: "My Awesome Guild"
```

#### 4. Test Logo/Emoji Change
```
Field: Logo/Emoji
Current: (should show current value or default "⚔️")
Action: Clear and type: "👑"
```

#### 5. Test Description
```
Field: Description
Current: (may be empty)
Action: Type: "Welcome to our guild! Competitive gaming team."
```

#### 6. Submit Changes
```
Button: "✓ Update Settings"
Expected: 
  - Button changes to "🔄 Updating..."
  - After 1-2 seconds: "✅ Settings updated successfully!"
  - Message disappears after 3 seconds
```

#### 7. Verify Navbar Update
```
Location: Top of page
Expected: 
  - Logo changes to: "👑"
  - Name changes to: "My Awesome Guild"
```

#### 8. Hard Refresh and Test Persistence
```
Action: Press Ctrl+Shift+R (hard refresh)
Expected:
  - Navbar still shows: "👑 My Awesome Guild"
  - Confirms settings saved to database
```

---

## 🧪 Extended Test (15 minutes)

### Test Multiple Admin Changes

#### Scenario 1: Change Theme
```
Logo: 🎮 (video game)
Name: "Dragon Slayers"
Description: "The legendary dragon slaying guild"
Expected: Navbar shows "🎮 Dragon Slayers"
```

#### Scenario 2: Change Again
```
Logo: 🔥 (fire)
Name: "Fire Kings"
Description: "Burning through the competition"
Expected: Changes immediately apply
```

#### Scenario 3: Emoji Testing
Try each of these emojis:
- 👑 Crown
- ⚡ Lightning
- 🐉 Dragon
- 🎯 Target
- 💎 Diamond
- ⚔️ Swords

### Test Error Handling

#### Scenario 1: Close Backend
```
Action: Stop backend server
Action: Try to update settings
Expected: "❌ Error updating settings" message
Action: Restart backend
Action: Try again - should work
```

#### Scenario 2: Invalid Token
```
Action: Open browser DevTools
Action: Go to Application → Local Storage
Action: Delete 'token' entry
Action: Try to update settings
Expected: Error (no auth token)
Action: Refresh page (auto-logs out)
Action: Log back in
```

---

## 📊 Verification Checklist

- [ ] Settings tab appears in Admin Panel
- [ ] Can edit Website Name field
- [ ] Can edit Logo/Emoji field
- [ ] Can edit Description field
- [ ] Update button works
- [ ] Loading state shows "🔄 Updating..."
- [ ] Success message appears "✅ Settings updated successfully!"
- [ ] Navbar updates immediately
- [ ] Changes persist after page refresh
- [ ] Non-admin users cannot update (access denied)
- [ ] Settings can be viewed by anyone (public GET endpoint)
- [ ] Database stores changes with timestamp

---

## 🔐 Permission Test

### Test Admin Access
```
1. Log in as admin user
2. Navigate to /admin
3. Should see Admin Panel
4. Should see Settings tab
5. Should be able to update settings
```

### Test Player Access
```
1. Log in as regular player
2. Navigate to /admin
3. Should be denied access (redirected)
4. Settings tab should NOT be accessible
```

### Test Anonymous Access
```
1. Don't log in
2. Navigate to /admin
3. Should be redirected to login
4. Cannot access settings
```

---

## 📱 Mobile Testing

### Test on Mobile Browser
```
1. Access https://blackvale.netlify.app/admin on mobile
2. Log in as admin
3. Scroll to Settings tab
4. Form should be responsive
5. Inputs should be easily tappable
6. Submit button should work
```

---

## 🌐 Production Testing

### Test on Live URLs
```
Frontend: https://blackvale.netlify.app
Backend: https://blackvale-backend.onrender.com

1. Log in with admin account
2. Go to Admin Panel
3. Click Settings tab
4. Update website name to: "Production Test Guild"
5. Click Update
6. Check navbar for changes
7. Refresh page - changes should persist
```

---

## 🐛 Debugging Tips

### Check Browser Console
```
Press F12 → Console tab
Look for any error messages
Should be clean if everything works
```

### Check Network Tab
```
Press F12 → Network tab
Click Update Settings
Look for PUT /api/settings request
Status should be: 200 OK
Response should show updated settings
```

### Check Backend Logs (Local)
```
Terminal with backend running:
Should see: "PUT /api/settings" request
Should show: "Settings updated successfully"
```

### Check Database (MongoDB)
```
1. Log in to MongoDB Atlas
2. Go to your cluster
3. Browse Collections → settings
4. Should see 1 document
5. Check fields: websiteName, websiteLogo, description, updatedAt
```

---

## ✅ Success Criteria

All tests pass when:
- ✅ Settings form renders in Admin Panel
- ✅ Can edit all three fields
- ✅ Update button submits changes
- ✅ API returns success (200 status)
- ✅ Database stores changes
- ✅ Navbar displays new values
- ✅ Changes persist across page refreshes
- ✅ Error handling works for failed requests
- ✅ Permission checks work (admin only)
- ✅ Mobile and desktop both work

---

## 🚀 Deployment Test

After deploying to production:

```
1. Visit https://blackvale.netlify.app
2. Log in as admin
3. Go to Admin Panel → Settings
4. Change website name
5. Click Update
6. Verify changes appear in navbar
7. Hard refresh (Ctrl+Shift+R)
8. Changes should persist
```

---

## 📝 Test Report Template

```
Date: ________
Tested By: ________
Environment: [ ] Local [ ] Production
Backend Status: ✅ ❌
Frontend Status: ✅ ❌
Database Status: ✅ ❌

Settings Tab:
[ ] Visible in Admin Panel
[ ] Can edit Website Name
[ ] Can edit Logo/Emoji
[ ] Can edit Description
[ ] Update button functional
[ ] Success message shows
[ ] Navbar updates
[ ] Changes persist

Error Handling:
[ ] Backend down → shows error
[ ] No auth token → shows error
[ ] Non-admin → denied access

Notes: ________________________________________

Overall Status: ✅ PASS [ ] ❌ FAIL [ ]
```

---

## Need Help?

If tests fail:
1. Check backend is running: `ps aux | grep node`
2. Check frontend is running: visit http://localhost:3000
3. Check MongoDB connection in Render environment variables
4. Check browser console for JavaScript errors (F12)
5. Check network requests (F12 → Network tab)
6. Review the ADMIN_SETTINGS_GUIDE.md for more details

---

Good luck! 🎮✨
