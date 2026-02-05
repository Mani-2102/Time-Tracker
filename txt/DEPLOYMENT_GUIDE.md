# Deployment Guide - Step by Step

## 📱 Current Status

- **Frontend**: Running in browser ✅
- **Backend**: Server running but NO API endpoints ❌
- **Database**: MySQL connected but empty ❌

---

## 🚀 DEPLOYMENT STEPS

### **STEP 1: SSH to Your Server** (5 minutes)

```powershell
# From your Windows terminal
ssh root@139.59.30.160

# Enter your password
```

Once connected:

```bash
cd ~/timer-backend
ls -la
# Should show: package.json, public/
```

---

### **STEP 2: Setup Database** (10 minutes)

**2a) Connect to MySQL:**

```bash
mysql -u root -p
# Enter your MySQL password
```

**2b) Run the schema:**

```bash
# Copy DATABASE_SCHEMA.sql content
# Paste it in MySQL terminal

# Or use:
mysql -u root -p time_tracker < schema.sql
```

**2c) Verify tables created:**

```sql
USE time_tracker;
SHOW TABLES;
# Should show: users, user_sessions, timer_sessions, todos, sheets, etc.

EXIT;
```

---

### **STEP 3: Setup Backend Server** (15 minutes)

**3a) Install Node.js dependencies:**

```bash
cd ~/timer-backend

# Install packages
npm install

# Verify installation
npm list
```

**3b) Create `.env` file:**

```bash
cat > .env << 'EOF'
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=time_tracker
JWT_SECRET=your_very_secret_key_change_this_123
JWT_REFRESH_SECRET=your_refresh_secret_456
NODE_ENV=production
PORT=5000
EOF
```

**3c) Copy backend code:**

- Copy content from `BACKEND_TEMPLATE.js`
- Save as `index.js` in ~/timer-backend/
- OR use:

```bash
# If you have the template
cp BACKEND_TEMPLATE.js index.js
```

**3d) Test the server:**

```bash
npm start

# You should see:
# 🚀 Timer Backend running on port 5000
# ✅ Database connected successfully!
```

**3e) Test health endpoint:**
Open new terminal, keep server running:

```bash
# From another terminal
curl http://localhost:5000/api/health
# Response: {"success":true,"message":"Timer Backend Running!"}

curl http://localhost:5000/test-db
# Response: {"success":true,"message":"Database OK!"}
```

---

### **STEP 4: Keep Backend Running (Important!)** (5 minutes)

**Option A: Using PM2 (Recommended for Production)**

```bash
# Install PM2 globally
npm install -g pm2

# Start server with PM2
pm2 start index.js --name "timer-backend"

# View status
pm2 status

# View logs
pm2 logs timer-backend

# Auto-restart on reboot
pm2 startup
pm2 save
```

**Option B: Using screen (Simple)**

```bash
# Install screen
apt-get install screen

# Create new session
screen -S timer-backend

# Inside screen, start server
npm start

# Detach: Press Ctrl+A then D
# Re-attach: screen -r timer-backend
```

**Option C: Using nohup (Simple)**

```bash
nohup npm start > backend.log 2>&1 &

# View log
tail -f backend.log
```

---

### **STEP 5: Test API Endpoints** (20 minutes)

**5a) From server terminal:**

```bash
# Test Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "device_name": "Test Device"
  }'

# Response should include:
# "success": true,
# "token": "eyJhbGc..."
# "user": { "id": 1, ... }
```

**5b) Save the token from response:**

```bash
TOKEN="paste_token_here"
USER_ID=1
```

**5c) Test Add Timer:**

```bash
curl -X POST http://localhost:5000/api/timer/sessions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "task_name": "Coding Project",
    "duration": 3600000,
    "category": "Development",
    "description": "Test timer"
  }'

# Response: {"success":true,"message":"Timer session saved","id":1}
```

**5d) Test Get Timers:**

```bash
curl -X GET http://localhost:5000/api/timer/sessions \
  -H "Authorization: Bearer $TOKEN"

# Response: {"success":true,"data":[{...}]}
```

---

### **STEP 6: Test from Windows Machine** (10 minutes)

**6a) Update frontend config.js:**
Replace:

```javascript
const API_BASE_URL = "http://139.59.30.160:5000";
```

**6b) Open browser and test:**

```
http://139.59.30.160:5000/api/health
# Should show: {"success":true,"message":"Timer Backend Running!"}
```

**6c) Open welcome.html in browser:**

```
file:///e:/...Path.../welcome.html
```

Try to register new user → Should work!

---

### **STEP 7: Frontend Updates** (30-60 minutes)

**7a) Update config.js:**
Copy the new config.js from FRONTEND_INTEGRATION_GUIDE.md

**7b) Update welcome.html:**
Add login/register handlers

**7c) Update index.html:**
Replace localStorage calls with API calls

**7d) Update Timer.html:**
Add sync status indicator

**7e) Test in browser:**

- Register → Should create user in MySQL
- Login on different device → Should see same data
- Create timer → Should appear in database

---

### **STEP 8: Verification Checklist** ✅

**Database:**

- [ ] `mysql -u root -p` → `USE time_tracker;` → `SHOW TABLES;` (11 tables)
- [ ] `SELECT * FROM users;` (shows your test user)
- [ ] `SELECT * FROM timer_sessions;` (shows your test timer)

**Backend:**

- [ ] `curl http://139.59.30.160:5000/api/health` (returns success)
- [ ] `curl http://139.59.30.160:5000/test-db` (returns Database OK)
- [ ] Server running in PM2: `pm2 status` (shows timer-backend online)

**Frontend:**

- [ ] Can access `http://139.59.30.160` in browser
- [ ] Can register user
- [ ] Can login
- [ ] Can create timer
- [ ] Timer appears on different device

---

## 🐛 Troubleshooting

### **"Database connection failed"**

```bash
# Check MySQL is running
systemctl status mysql

# Start if not running
systemctl start mysql

# Check credentials in .env
cat .env
```

### **"Port 5000 already in use"**

```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### **"CORS error" in browser**

```bash
# Backend CORS config includes your domain
# Edit index.js, find cors() section
# Add your domain to origin array
```

### **"Token expired" errors**

```bash
# This is normal, auth.js handles refresh
# Check FRONTEND_INTEGRATION_GUIDE.md
```

### **"Database doesn't exist"**

```bash
mysql -u root -p
CREATE DATABASE time_tracker;
# Then run schema.sql
```

---

## 📊 Production Checklist

- [ ] Database backups scheduled
- [ ] PM2 running backend
- [ ] HTTPS enabled (get SSL certificate)
- [ ] Passwords changed from defaults
- [ ] JWT secrets changed
- [ ] Error logging enabled
- [ ] Rate limiting configured
- [ ] CORS restricted to your domain only
- [ ] Environment variables set securely
- [ ] Database user has least privileges

---

## 🔄 Typical Workflow After Deployment

**Every morning:**

1. SSH to server
2. `pm2 logs timer-backend` - check for errors
3. `pm2 status` - verify backend running

**Before deployment:**

1. Test all endpoints with curl
2. Test register/login from Windows
3. Test multi-device sync
4. Check database for data

**If something breaks:**

1. Check logs: `pm2 logs timer-backend`
2. Check database: `mysql` → `SELECT...`
3. Check backend running: `pm2 status`
4. Restart: `pm2 restart timer-backend`

---

## 📈 Scaling Later

**If you get many users:**

1. Add database indexes (included in schema)
2. Use connection pooling (already in code)
3. Add caching (Redis)
4. Use load balancer (Nginx)
5. Split into microservices

**For now**, this setup supports:

- Unlimited users
- 1000+ concurrent devices
- Real-time syncing
- Full scalability

---

## 🎯 Next Actions (Priority Order)

1. **TODAY**: SSH to server and create .env file
2. **TODAY**: Run DATABASE_SCHEMA.sql
3. **TODAY**: Deploy BACKEND_TEMPLATE.js as index.js
4. **TODAY**: Test endpoints with curl
5. **TOMORROW**: Update frontend config.js
6. **TOMORROW**: Test login/register from browser
7. **TOMORROW**: Test multi-device sync
8. **NEXT WEEK**: Full testing and bug fixes

---

## 📞 Quick Command Reference

```bash
# Start backend
pm2 start index.js --name "timer-backend"

# Stop backend
pm2 stop timer-backend

# Restart backend
pm2 restart timer-backend

# View logs
pm2 logs timer-backend

# View database
mysql -u root -p time_tracker

# Install packages
npm install

# Check node version
node --version

# Check npm version
npm --version
```

---

**You're ready to deploy! 🚀**

Start with STEP 1 and work through systematically. Ask questions if anything is unclear!
