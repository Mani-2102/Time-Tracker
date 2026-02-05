# 🚀 Deployment Guide

## Quick Setup on Server

### 1. SSH to your server

```bash
ssh root@139.59.30.160
```

### 2. Create backend directory

```bash
mkdir -p ~/timer-backend/public
cd ~/timer-backend
```

### 3. Create .env file with your database credentials

```bash
cat > .env << 'EOF'
DB_HOST=localhost
DB_USER=timeruser
DB_PASSWORD=Timer@123
DB_NAME=time_tracker
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this
JWT_REFRESH_SECRET=your_refresh_secret_key_change_this
EOF
```

### 4. Copy backend code

```bash
# Copy BACKEND_GITHUB.js as index.js
nano index.js
# Paste the content from BACKEND_GITHUB.js
```

### 5. Initialize Node project

```bash
npm init -y
npm install express mysql2 cors bcryptjs jsonwebtoken uuid
```

### 6. Setup with PM2

```bash
npm install -g pm2
pm2 start index.js --name "timer-backend"
pm2 startup
pm2 save
```

### 7. Copy HTML files to public folder

```bash
# From your local machine, SCP each HTML file:
scp welcome.html root@139.59.30.160:~/timer-backend/public/
scp login.html root@139.59.30.160:~/timer-backend/public/
scp Timer.html root@139.59.30.160:~/timer-backend/public/
scp todo.html root@139.59.30.160:~/timer-backend/public/
scp YearActivity.html root@139.59.30.160:~/timer-backend/public/
scp NotificationTimer.html root@139.59.30.160:~/timer-backend/public/
```

### 8. Restart the backend

```bash
pm2 restart timer-backend
pm2 logs timer-backend
```

### 9. Test URLs

```
http://139.59.30.160:5000/welcome     → Shows welcome.html
http://139.59.30.160:5000/login       → Shows login.html
http://139.59.30.160:5000/timer       → Shows Timer.html
http://139.59.30.160:5000/todo        → Shows todo.html
http://139.59.30.160:5000/activity    → Shows YearActivity.html
```

---

## What Files Go Where

### GitHub (Public Repository)

```
✅ All HTML files (welcome.html, login.html, etc.)
✅ README.md
✅ DATABASE_SCHEMA.sql
✅ BACKEND_GITHUB.js (safe version without passwords)
✅ .env.example (template only)
✅ .gitignore
```

### Server Only (~/timer-backend/)

```
📁 public/
  ├─ welcome.html
  ├─ login.html
  ├─ Timer.html
  ├─ todo.html
  ├─ YearActivity.html
  └─ NotificationTimer.html

📄 index.js (the backend code)
📄 package.json
📄 .env (NEVER commit this - has passwords!)
📁 node_modules/
```

### NEVER commit to GitHub

```
❌ .env (database passwords)
❌ DEPLOY_THIS_BACKEND.js (has hardcoded passwords)
❌ node_modules/
❌ Any file with credentials
```

---

## After Buying Domain

1. Buy domain (example: `timerapp.com`)
2. Point DNS to your server IP: `139.59.30.160`
3. Install SSL certificate with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d timerapp.com -d www.timerapp.com
```

4. Setup Nginx reverse proxy
5. Update your HTML files to use the new domain instead of IP
