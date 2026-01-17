# Admin Settings Control Guide

## Overview
The Admin Panel now includes a **Settings** tab that allows administrators to dynamically control website branding and configuration without modifying code.

## Features

### 1. **Website Name Control**
- Change the website name displayed in the navigation bar
- Default: "⚔️ BlackVale Guild"
- Updates appear immediately across all pages for all users

### 2. **Logo/Emoji Control**
- Change the website logo or emoji in the navigation bar
- Supports any emoji or text (up to 10 characters)
- Default: "⚔️"
- Examples: 👑, 🎮, ⚡, 🔥, etc.

### 3. **Description Control**
- Add or update a website description
- Can be used for announcements or information about your guild
- Stored in the database for future use in other features

## How to Use

### Step 1: Access Admin Panel
1. Log in with an **admin** account
2. Look for the **Admin Panel** link in the navigation bar (only visible for admins)
3. Click to navigate to `/admin`

### Step 2: Navigate to Settings Tab
1. In the Admin Panel, you'll see three tabs:
   - **Screenshots** - Approve/reject player screenshots
   - **Squads** - Approve/reject squad requests
   - **⚙️ Settings** - Control website branding (NEW)

2. Click the **⚙️ Settings** tab

### Step 3: Update Settings
The Settings form has three fields:

1. **Website Name**
   - Enter the name you want to display
   - Example: "BlackVale Guild", "Team Alpha", "Dragon Knights"

2. **Logo/Emoji**
   - Enter a single emoji or short text (max 10 characters)
   - Examples:
     - ⚔️ (crossed swords)
     - 👑 (crown)
     - 🎮 (video game)
     - 🐉 (dragon)
     - BV (text initials)

3. **Description**
   - Optional description or announcement
   - Example: "Welcome to BlackVale Guild! Competitive FPS team"

### Step 4: Submit Changes
1. Click the **✓ Update Settings** button
2. You'll see a loading state: "🔄 Updating..."
3. On success: **✅ Settings updated successfully!** (appears for 3 seconds)
4. On error: **❌ Error updating settings**

## Real-Time Updates

Once settings are updated:
- ✅ All active users see changes immediately (except navbar might need refresh)
- ✅ New users will see updated branding when they visit
- ✅ Settings persist in the database
- ✅ Changes survive server restarts

## Troubleshooting

### "❌ Error updating settings"
- Verify you're logged in as an admin
- Check browser console (F12) for detailed error messages
- Ensure the backend is running

### Changes not appearing
- Refresh the page (Ctrl+R or Cmd+R)
- For navbar updates, you may need to refresh to see changes immediately
- Hard refresh with Ctrl+Shift+R to clear cache

### Default Settings Not Showing
If no settings exist:
- A default will be created automatically on first access
- Default Name: "⚔️ BlackVale Guild"
- Default Logo: "⚔️"

## Database Structure

Settings are stored in MongoDB with this structure:
```json
{
  "_id": "ObjectId",
  "websiteName": "Your Guild Name",
  "websiteLogo": "⚔️",
  "description": "Guild description",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## API Endpoints

### Get Settings (Public)
```
GET /api/settings
Response: { websiteName, websiteLogo, description, updatedAt }
```

### Update Settings (Admin Only)
```
PUT /api/settings
Headers: Authorization: Bearer <admin-token>
Body: { websiteName, websiteLogo, description }
Response: { websiteName, websiteLogo, description, updatedAt }
```

## Making Users Admins

To grant admin privileges to a user:

1. **Via MongoDB:**
   - Connect to your MongoDB database
   - Find the user document in the `users` collection
   - Change the `role` field from "player" to "admin"
   - Save changes

2. **Via Backend API:**
   - Contact the development team
   - Ask them to add an admin management endpoint if needed

## Security

- ✅ Only admins can update settings (protected by admin middleware)
- ✅ Settings can be viewed by anyone (public endpoint)
- ✅ JWT token required for update operations
- ✅ Changes are logged with `updatedAt` timestamp

## What's Next?

Future enhancements could include:
- Website banner/hero image upload
- Custom color scheme settings
- Footer information
- Social media links
- Email templates
- Feature toggles

---

**Created:** BlackVale Guild Management System v1.0
**Feature:** Admin Website Settings Control
**Status:** ✅ Production Ready
