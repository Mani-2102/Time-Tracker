# 🚀 COMPLETE SETUP GUIDE - Time Tracker Application

**Date:** February 4, 2026  
**Server IP:** 139.59.30.160  
**Server Status:** ✅ RUNNING (PM2 timer-backend online)

---

## 📋 TABLE OF CONTENTS

1. [Current Server Status](#1-current-server-status)
2. [Backend Update Steps](#2-backend-update-steps)
3. [Frontend Files for GitHub](#3-frontend-files-for-github)
4. [Server-Only Files](#4-server-only-files)
5. [Push to GitHub](#5-push-to-github)
6. [Upload Frontend to Server](#6-upload-frontend-to-server)
7. [Testing Guide](#7-testing-guide)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. CURRENT SERVER STATUS ✅

Based on your PowerShell 3.txt, your server is working:

```
Server IP: 139.59.30.160
Backend: PM2 timer-backend (online)
Database: MySQL time_tracker
Health Check: ✅ Working
Tables: ✅ Created (users, user_sessions, timer_sessions, todos, sheets)
```

**Database Credentials (already configured):**

- User: `timeruser`
- Password: `Timer@123`
- Database: `time_tracker`

---

## 2. BACKEND UPDATE STEPS

### Step 2.1: Open PowerShell on Your PC

Press `Win + X` → Select "Windows PowerShell"

### Step 2.2: Upload the Backend File

**Copy and paste this EXACT command:**

```powershell
scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\DEPLOY_THIS_BACKEND.js" root@139.59.30.160:~/timer-backend/index.js
```

When asked for password, type: `[YOUR SERVER PASSWORD]`

### Step 2.3: Connect to Server

```powershell
ssh root@139.59.30.160
```

Enter your password when asked.

### Step 2.4: Install Dependencies (if needed)

```bash
cd ~/timer-backend
npm install bcryptjs jsonwebtoken uuid cors
```

### Step 2.5: Restart Backend

```bash
pm2 restart timer-backend
```

### Step 2.6: Verify Backend is Running

```bash
pm2 status
```

You should see:

```
│ 0  │ timer-backend │ online │
```

### Step 2.7: Test Backend

```bash
curl http://localhost:5000/api/health
```

Should return:

```json
{ "success": true, "message": "Timer Backend Running!", "timestamp": "..." }
```

---

## 3. FRONTEND FILES FOR GITHUB ✅

These files go to GitHub (PUBLIC repository):

```
✅ index.html          - Main Time Tracker app
✅ login.html          - Login/Register page
✅ welcome.html        - Landing page
✅ Timer.html          - Tap Timer
✅ todo.html           - Todo List
✅ YearActivity.html   - Year Activity Tracker
✅ NotificationTimer.html - Smart Timer
✅ database.js         - Local database helper
✅ README.md           - Project documentation
✅ .gitignore          - Git ignore rules
✅ DATABASE_SCHEMA.sql - Database structure (for reference)
```

---

## 4. SERVER-ONLY FILES ⚠️

These files should NEVER go to GitHub:

```
❌ DEPLOY_THIS_BACKEND.js  - Contains database passwords
❌ config.js               - Contains API configuration
❌ .env                    - Environment variables
❌ Any file with passwords
```

---

## 5. PUSH TO GITHUB

### Step 5.1: Open PowerShell in Project Folder

```powershell
cd "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker"
```

### Step 5.2: Check Git Status

```powershell
git status
```

### Step 5.3: Add Files to Git

```powershell
git add index.html login.html welcome.html Timer.html todo.html YearActivity.html NotificationTimer.html database.js README.md DATABASE_SCHEMA.sql .gitignore
```

### Step 5.4: Commit Changes

```powershell
git commit -m "Updated authentication flow - JWT integration"
```

### Step 5.5: Push to GitHub

```powershell
git push origin main
```

---

## 6. UPLOAD FRONTEND TO SERVER

### Step 6.1: Create Public Folder on Server (One-time setup)

Connect to server first:

```powershell
ssh root@139.59.30.160
```

Then create the folder:

```bash
mkdir -p ~/timer-backend/public
```

Exit server:

```bash
exit
```

### Step 6.2: Upload All Frontend Files

Open PowerShell on your PC and run these commands ONE BY ONE:

```powershell
scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\index.html" root@139.59.30.160:~/timer-backend/public/

scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\login.html" root@139.59.30.160:~/timer-backend/public/

scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\welcome.html" root@139.59.30.160:~/timer-backend/public/

scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\Timer.html" root@139.59.30.160:~/timer-backend/public/

scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\todo.html" root@139.59.30.160:~/timer-backend/public/

scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\YearActivity.html" root@139.59.30.160:~/timer-backend/public/

scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\NotificationTimer.html" root@139.59.30.160:~/timer-backend/public/

scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\database.js" root@139.59.30.160:~/timer-backend/public/

scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\config.js" root@139.59.30.160:~/timer-backend/public/
```

### Step 6.3: Restart Server After Upload

```powershell
ssh root@139.59.30.160
```

Then:

```bash
cd ~/timer-backend
pm2 restart timer-backend
exit
```

---

## 7. TESTING GUIDE

### 7.1: Test URLs (After Setup)

Open these URLs in your browser:

| URL                                  | What It Shows    |
| ------------------------------------ | ---------------- |
| http://139.59.30.160:5000            | Welcome Page     |
| http://139.59.30.160:5000/login      | Login Page       |
| http://139.59.30.160:5000/tracker    | Time Tracker     |
| http://139.59.30.160:5000/timer      | Tap Timer        |
| http://139.59.30.160:5000/todo       | Todo List        |
| http://139.59.30.160:5000/activity   | Year Activity    |
| http://139.59.30.160:5000/api/health | API Health Check |

### 7.2: Test on PC

1. Open browser (Chrome recommended)
2. Go to: `http://139.59.30.160:5000`
3. You should see the Welcome page
4. Click "Start Tracking Now" or "Time Tracker"
5. You should be redirected to Login page (if not logged in)
6. Register a new account
7. After login, you can access the Time Tracker

### 7.3: Test on Phone

1. Make sure your phone is connected to internet (WiFi or Mobile Data)
2. Open browser on phone (Chrome, Safari, etc.)
3. Type in address bar: `http://139.59.30.160:5000`
4. Same experience as PC - login and use the app

### 7.4: Test Login Flow

1. Go to `http://139.59.30.160:5000/login`
2. Click "Create Account" tab
3. Fill in:
   - Username: (any name)
   - Email: (your email)
   - Password: (6+ characters)
   - Confirm Password: (same as above)
4. Click "Create Account"
5. You should see "Account created successfully!"
6. Now click "Open Dashboard" to go to Time Tracker

### 7.5: Test Logout Flow

1. In Time Tracker (index.html), click "Logout" button
2. You should be redirected to Login page
3. Try to open Time Tracker directly: `http://139.59.30.160:5000/tracker`
4. You should be redirected to Login page

---

## 8. TROUBLESHOOTING

### Problem: Backend shows "errored" status

**Solution:**

```bash
ssh root@139.59.30.160
cd ~/timer-backend
pm2 logs timer-backend --lines 50
```

Look at the error message and fix accordingly.

### Problem: "Connection refused" when opening URL

**Solution:**

1. Check if PM2 is running:
   ```bash
   pm2 status
   ```
2. If not online, restart:
   ```bash
   pm2 restart timer-backend
   ```

### Problem: Login page shows "Connection failed"

**Solution:**

1. Check if server is reachable:
   ```bash
   curl http://139.59.30.160:5000/api/health
   ```
2. If fails, restart PM2

### Problem: Database error on register

**Solution:**

1. Connect to MySQL:
   ```bash
   mysql -u timeruser -p'Timer@123' time_tracker
   ```
2. Check tables:
   ```sql
   SHOW TABLES;
   DESCRIBE users;
   ```

### Problem: Files not showing on server

**Solution:**

1. Check if files exist:
   ```bash
   ls -la ~/timer-backend/public/
   ```
2. If empty, re-upload files using Step 6.2

---

## 📱 QUICK COMMAND REFERENCE

### Check Server Status

```bash
ssh root@139.59.30.160
pm2 status
exit
```

### Restart Backend

```bash
ssh root@139.59.30.160
pm2 restart timer-backend
exit
```

### View Logs

```bash
ssh root@139.59.30.160
pm2 logs timer-backend
```

(Press Ctrl+C to exit logs)

### Upload Single File

```powershell
scp "LOCAL_FILE_PATH" root@139.59.30.160:~/timer-backend/public/
```

---

## ✅ CHECKLIST

Before testing, make sure:

- [ ] Backend file uploaded (`DEPLOY_THIS_BACKEND.js` → `index.js`)
- [ ] NPM packages installed (`bcryptjs`, `jsonwebtoken`, `uuid`, `cors`)
- [ ] PM2 shows "online" status
- [ ] Database tables created (users, user_sessions, etc.)
- [ ] Frontend files uploaded to `~/timer-backend/public/`
- [ ] Health check works: `http://139.59.30.160:5000/api/health`

---

## 🎉 SUCCESS!

Once everything is set up:

- Your app will be live at: `http://139.59.30.160:5000`
- Users can register and login
- Data syncs across devices (PC and Phone)
- You can share the URL with anyone to use your app!

---

**Need a custom domain?**
After testing works, you can buy a domain (like `timetracker.com`) and point it to your server IP.
