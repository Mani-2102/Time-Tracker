# 🎯 Quick Reference - GitHub vs Server

## 📊 Visual Overview

```
YOUR COMPUTER (Local)
│
├─ All files here
└─ Run: git push → GitHub

         ↓↓↓

GitHub Repository (PUBLIC)
│
├─ ✅ welcome.html
├─ ✅ login.html
├─ ✅ Timer.html
├─ ✅ todo.html
├─ ✅ YearActivity.html
├─ ✅ BACKEND_GITHUB.js
├─ ✅ README.md
├─ ✅ .env.example
└─ ✅ DATABASE_SCHEMA.sql

         ↓↓↓ Clone

Server (139.59.30.160) - PRIVATE
│
├─ /root/
│  └─ timer-backend/
│     ├─ index.js (copy of BACKEND_GITHUB.js)
│     ├─ .env (YOUR PASSWORDS GO HERE!)
│     ├─ package.json
│     ├─ node_modules/
│     │
│     └─ public/
│        ├─ welcome.html
│        ├─ login.html
│        ├─ Timer.html
│        ├─ todo.html
│        ├─ YearActivity.html
│        └─ NotificationTimer.html
│
└─ MySQL Database
```

---

## ✅ Checklist Before GitHub Push

- [ ] Remove all passwords from files
- [ ] Use `.env.example` for template (no secrets)
- [ ] Check `.gitignore` includes `.env`, `node_modules/`, etc.
- [ ] Use `BACKEND_GITHUB.js` (not `DEPLOY_THIS_BACKEND.js`)
- [ ] No database credentials in any committed file
- [ ] README.md explains setup clearly
- [ ] `DATABASE_SCHEMA.sql` included for reference

---

## 🚀 Deployment Checklist

Server Setup:

- [ ] SSH to server
- [ ] Create `~/timer-backend/` directory
- [ ] Copy `BACKEND_GITHUB.js` as `index.js`
- [ ] Create `.env` with real database credentials
- [ ] `npm install` dependencies
- [ ] Create `public/` folder
- [ ] Copy all HTML files to `public/`
- [ ] `pm2 start index.js`
- [ ] Test: `curl http://localhost:5000/welcome`

URL Testing:

- [ ] `http://139.59.30.160:5000/` → Shows welcome
- [ ] `http://139.59.30.160:5000/login` → Shows login
- [ ] `http://139.59.30.160:5000/timer` → Shows timer
- [ ] `http://139.59.30.160:5000/api/health` → JSON response

---

## 📝 What Each File Does

| File              | Purpose             | GitHub | Server     |
| ----------------- | ------------------- | ------ | ---------- |
| welcome.html      | User welcome page   | ✅     | ✅ public/ |
| login.html        | Login page          | ✅     | ✅ public/ |
| Timer.html        | Timer app           | ✅     | ✅ public/ |
| todo.html         | Todo list           | ✅     | ✅ public/ |
| YearActivity.html | Year activity view  | ✅     | ✅ public/ |
| BACKEND_GITHUB.js | Backend code (safe) | ✅     | -          |
| index.js          | Backend runtime     | -      | ✅         |
| .env              | Passwords           | ❌     | ✅         |
| .env.example      | Password template   | ✅     | -          |
| .gitignore        | Git ignore rules    | ✅     | -          |
| package.json      | NPM dependencies    | ✅     | ✅         |
| node_modules      | Installed packages  | ❌     | ✅         |

---

## 🔐 Security Reminders

**NEVER commit to GitHub:**

```
❌ .env (has passwords)
❌ DEPLOY_THIS_BACKEND.js (hardcoded credentials)
❌ node_modules/ (too large)
❌ Any file with DB password
❌ Any file with JWT secret
```

**Always on server only:**

```
✅ .env (with real credentials)
✅ node_modules/ (created by npm)
✅ public/ (HTML files served to users)
```

---

## 💾 To Push to GitHub

```bash
# 1. Check what will be committed
git status

# 2. Add safe files only
git add .

# 3. Verify .gitignore is working
git status  # Should NOT show .env or node_modules

# 4. Commit
git commit -m "Initial deployment setup"

# 5. Push
git push origin main
```

---

## 🌐 After Buying Domain (example: timerapp.com)

### 1. Update DNS

```
A Record:     @ → 139.59.30.160
A Record: www → 139.59.30.160
```

### 2. Update Backend (one-time setup)

```bash
# Install SSL certificate
sudo certbot certonly --standalone -d timerapp.com

# Configure Nginx reverse proxy to forward requests to backend
```

### 3. Update Frontend HTML files

Change all URLs from:

```javascript
// Old
const API_URL = "http://139.59.30.160:5000";

// New
const API_URL = "https://timerapp.com";
```

---

## 📞 Support URLs

| Action       | URL                               | Type      |
| ------------ | --------------------------------- | --------- |
| View Welcome | `https://timerapp.com/welcome`    | HTML page |
| Login        | `https://timerapp.com/login`      | HTML page |
| Start Timer  | `https://timerapp.com/timer`      | HTML page |
| Todos        | `https://timerapp.com/todo`       | HTML page |
| API Health   | `https://timerapp.com/api/health` | JSON      |
| Register     | POST to `/api/auth/register`      | JSON API  |
| Login API    | POST to `/api/auth/login`         | JSON API  |
