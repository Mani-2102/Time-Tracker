# 📋 GitHub vs Server - What Goes Where

## ✅ GitHub (Public Repository)

### Frontend Files

- `welcome.html` ✅
- `login.html` ✅
- `Timer.html` ✅
- `todo.html` ✅
- `YearActivity.html` ✅
- `NotificationTimer.html` ✅
- `index.html` ✅

### Backend Files

- `BACKEND_GITHUB.js` ✅ (Safe version, NO passwords)
- `DATABASE_SCHEMA.sql` ✅ (For reference)

### Configuration Files

- `README.md` ✅
- `.env.example` ✅ (Template only, NO passwords)
- `.gitignore` ✅ (Prevents committing secrets)

### Documentation

- `txt/` folder and all `.md` files ✅

---

## 🔒 Server Only (~/timer-backend/)

### Backend Runtime

- `index.js` (the actual running code)
- `package.json`
- `node_modules/` (created by npm install)
- `.env` (YOUR PASSWORDS GO HERE!)

### Frontend Files (Served by backend)

```
~/timer-backend/public/
├─ welcome.html
├─ login.html
├─ Timer.html
├─ todo.html
├─ YearActivity.html
└─ NotificationTimer.html
```

---

## ❌ NEVER Commit to GitHub

| File                     | Reason                             |
| ------------------------ | ---------------------------------- |
| `.env`                   | Contains DB password & JWT secrets |
| `DEPLOY_THIS_BACKEND.js` | Hardcoded passwords exposed        |
| `config.js`              | May have credentials               |
| `node_modules/`          | Too large, installed via npm       |
| `package-lock.json`      | Not needed in git                  |
| `*.log`                  | Debug/log files                    |

---

## 🌐 How URLs Work Now

When user visits: `http://139.59.30.160:5000/welcome`

1. Browser requests `/welcome`
2. Backend receives request
3. Backend serves `public/welcome.html`
4. User sees welcome page in browser

### Available Routes

| URL               | File                          |
| ----------------- | ----------------------------- |
| `/`               | public/welcome.html           |
| `/welcome`        | public/welcome.html           |
| `/login`          | public/login.html             |
| `/timer`          | public/Timer.html             |
| `/todo`           | public/todo.html              |
| `/activity`       | public/YearActivity.html      |
| `/notification`   | public/NotificationTimer.html |
| `/api/health`     | JSON response (no HTML)       |
| `/api/auth/login` | JSON API                      |
| `/api/timer`      | JSON API                      |
| `/api/todo`       | JSON API                      |

---

## 📤 Step-by-Step to Deploy

### Step 1: Prepare GitHub

```bash
git add .
git commit -m "Initial setup"
git push origin main
```

### Step 2: SSH to Server

```bash
ssh root@139.59.30.160
```

### Step 3: Clone and Setup

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/time-tracker.git
cd time-tracker
cp .env.example .env
# Edit .env with your database password
nano .env
```

### Step 4: Setup Backend

```bash
mkdir -p ~/timer-backend/public
cp BACKEND_GITHUB.js ~/timer-backend/index.js
cp .env ~/timer-backend/.env
cd ~/timer-backend
npm init -y
npm install express mysql2 cors bcryptjs jsonwebtoken uuid
```

### Step 5: Copy HTML Files

```bash
cp ../welcome.html public/
cp ../login.html public/
cp ../Timer.html public/
cp ../todo.html public/
cp ../YearActivity.html public/
cp ../NotificationTimer.html public/
```

### Step 6: Start with PM2

```bash
npm install -g pm2
pm2 start index.js --name timer-backend
pm2 startup
pm2 save
```

### Step 7: Test

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/welcome
```

---

## 🔐 Security Notes

1. **Never commit .env file**
   - Add to .gitignore ✅ (Already done)

2. **Change JWT secrets in production**
   - Edit .env on server with strong random strings

3. **Change database password**
   - Use strong password, update .env

4. **After buying domain**
   - Setup SSL certificate (Let's Encrypt)
   - Update frontend URLs from IP to domain

---

## 📚 Files Modified/Created

✅ `DEPLOY_THIS_BACKEND.js` - Updated with HTML routes
✅ `BACKEND_GITHUB.js` - New safe version for GitHub
✅ `.gitignore` - Prevents secrets from committing
✅ `.env.example` - Template for server setup
✅ `DEPLOYMENT_GUIDE_FINAL.md` - Step-by-step deployment
✅ `GITHUB_VS_SERVER.md` - This file
