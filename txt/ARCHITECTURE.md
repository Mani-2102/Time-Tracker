# 📊 Architecture Diagram

## How Your App Works

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
│                                                               │
│  User visits: http://139.59.30.160:5000/login              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP GET /login
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND SERVER                              │
│              (Express.js on Node.js)                         │
│                                                               │
│  app.get("/login", (req, res) => {                          │
│    res.sendFile(path.join(__dirname, "public/login.html"))  │
│  })                                                           │
│                                                               │
│  📁 ~/timer-backend/                                         │
│  ├─ index.js                                                 │
│  └─ 📁 public/                                               │
│     ├─ login.html ← SENDS THIS                              │
│     ├─ welcome.html                                          │
│     ├─ Timer.html                                            │
│     ├─ todo.html                                             │
│     └─ YearActivity.html                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTML Content
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                 USER BROWSER RENDERS                         │
│                   Login Page Shown                           │
│                                                               │
│  User enters credentials and clicks "Login"                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ POST /api/auth/login
                         │ (username & password)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│               BACKEND API ENDPOINT                           │
│                                                               │
│  app.post("/api/auth/login", async (req, res) => {         │
│    // Verify password against database                      │
│    // Create JWT token                                      │
│    // Return token in JSON                                  │
│  })                                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ JSON Response
                         │ {token: "eyJhbGc..."}
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   BROWSER STORES TOKEN                       │
│           (localStorage or sessionStorage)                   │
│                                                               │
│  User is now logged in                                      │
│  Browser redirects to /timer                                │
└─────────────────────────────────────────────────────────────┘
```

---

## File Architecture

```
GitHub Repository (PUBLIC - Safe to Share)
│
├─ 📄 welcome.html           ✅ Frontend
├─ 📄 login.html             ✅ Frontend
├─ 📄 Timer.html             ✅ Frontend
├─ 📄 todo.html              ✅ Frontend
├─ 📄 YearActivity.html      ✅ Frontend
├─ 📄 NotificationTimer.html ✅ Frontend
├─ 📄 index.html             ✅ Frontend
│
├─ 📄 BACKEND_GITHUB.js      ✅ Backend (NO secrets)
├─ 📄 DATABASE_SCHEMA.sql    ✅ Reference
│
├─ 📄 README.md              ✅ Documentation
├─ 📄 .env.example           ✅ Template (NO secrets)
├─ 📄 .gitignore             ✅ Security
│
└─ 📁 txt/                   ✅ Documentation files
   ├─ DEPLOYMENT_GUIDE.md
   ├─ GITHUB_VS_SERVER.md
   ├─ NEXT_STEPS.md
   └─ ... other guides
```

```
Your Server (PRIVATE - Secrets Here)
│
└─ ~/timer-backend/
   │
   ├─ 📄 index.js               (copy of BACKEND_GITHUB.js)
   ├─ 📄 .env                   ⚠️ DATABASE PASSWORD HERE!
   ├─ 📄 package.json           (dependencies)
   ├─ 📁 node_modules/          (installed packages)
   │
   └─ 📁 public/
      ├─ welcome.html           (copied from GitHub)
      ├─ login.html             (copied from GitHub)
      ├─ Timer.html             (copied from GitHub)
      ├─ todo.html              (copied from GitHub)
      ├─ YearActivity.html      (copied from GitHub)
      └─ NotificationTimer.html (copied from GitHub)
```

```
Database Server (localhost on server)
│
└─ 🗄️ time_tracker
   ├─ users
   │  ├─ id
   │  ├─ username
   │  ├─ email
   │  └─ password_hash
   │
   ├─ timer_sessions
   │  ├─ id
   │  ├─ user_id
   │  ├─ task_name
   │  ├─ duration
   │  └─ date
   │
   ├─ todos
   │  ├─ id
   │  ├─ user_id
   │  ├─ title
   │  └─ completed
   │
   └─ user_sessions
      ├─ id
      ├─ user_id
      ├─ device_id
      └─ last_active
```

---

## Request Flow Diagram

```
BROWSER REQUEST FLOW
═══════════════════

1. User visits: /login
   ↓
   Express Route: app.get("/login", ...)
   ↓
   Serves: public/login.html
   ↓
   Browser shows login form


2. User submits login form
   ↓
   JavaScript sends: POST /api/auth/login
   ↓
   Express Route: app.post("/api/auth/login", ...)
   ↓
   Check MySQL database
   ↓
   Verify password
   ↓
   Create JWT token
   ↓
   Return JSON: {token: "...", user: {...}}
   ↓
   Browser stores token in localStorage
   ↓
   Redirect to: /timer
   ↓
   Browser shows timer page


3. User interacts with timer
   ↓
   JavaScript sends: POST /api/timer
   ↓
   Express Route: app.post("/api/timer", authenticateToken, ...)
   ↓
   Check JWT token (is user logged in?)
   ↓
   Insert into MySQL database
   ↓
   Return JSON: {success: true, id: 123}
   ↓
   Browser updates UI
```

---

## Security Flow

```
GITHUB (Public)
└─ ❌ NO passwords
   ❌ NO database credentials
   ❌ NO secret keys
   ✅ Just source code & HTML

         ↓ git clone

SERVER (Private)
└─ .env file contains:
   ├─ DB_USER=timeruser
   ├─ DB_PASSWORD=Timer@123    ← SECRET!
   ├─ JWT_SECRET=xyz...        ← SECRET!
   └─ JWT_REFRESH_SECRET=abc... ← SECRET!

Browser Request → Backend checks .env → Uses credentials to access database
```

---

## URL Routing Map

```
http://139.59.30.160:5000/
│
├─ /welcome               → /public/welcome.html (HTML PAGE)
├─ /login                 → /public/login.html (HTML PAGE)
├─ /timer                 → /public/Timer.html (HTML PAGE)
├─ /todo                  → /public/todo.html (HTML PAGE)
├─ /activity              → /public/YearActivity.html (HTML PAGE)
├─ /notification          → /public/NotificationTimer.html (HTML PAGE)
│
├─ /api/
│  ├─ /health             → {status: "ok"} (JSON)
│  │
│  ├─ /auth/
│  │  ├─ /register        → POST {username, email, password}
│  │  └─ /login           → POST {username, password}
│  │
│  ├─ /timer
│  │  ├─ GET              → List all timers
│  │  ├─ POST             → Create new timer
│  │  ├─ PUT /:id         → Update timer
│  │  └─ DELETE /:id      → Delete timer
│  │
│  ├─ /todo
│  │  ├─ GET              → List all todos
│  │  ├─ POST             → Create new todo
│  │  ├─ PUT /:id         → Update todo
│  │  └─ DELETE /:id      → Delete todo
│  │
│  └─ /sync/all           → Get all user data
│
└─ /public/*              → Static files (CSS, JS, images)
```

---

## Technology Stack

```
FRONTEND (Browser)
├─ HTML pages
├─ JavaScript (for user interactions)
├─ Fetch API (to communicate with backend)
└─ localStorage (for storing JWT token)

BACKEND (Server)
├─ Node.js (JavaScript runtime)
├─ Express.js (web framework)
├─ Express.static (serve HTML files)
├─ MySQL2 (database driver)
├─ Bcryptjs (password hashing)
├─ JWT (authentication tokens)
└─ CORS (cross-origin requests)

DATABASE
├─ MySQL 8.0
├─ Tables: users, timers, todos, sheets, sessions
└─ Connection pool for performance

HOSTING
├─ VPS: 139.59.30.160 (DigitalOcean)
├─ OS: Ubuntu 24.04 LTS
├─ Process Manager: PM2
└─ Domain: (to be added later)
```

---

## Deployment Timeline

```
WEEK 1: Testing
├─ [ ] Update backend with HTML serving
├─ [ ] Copy HTML files to server
├─ [ ] Test all URLs work
├─ [ ] Test login/register
├─ [ ] Test timer functionality
└─ [ ] Push to GitHub

WEEK 2: Domain Purchase
├─ [ ] Choose domain registrar
├─ [ ] Buy domain (example: timerapp.com)
├─ [ ] Configure DNS
├─ [ ] Setup SSL certificate
└─ [ ] Update URLs

WEEK 3: Production
├─ [ ] Update security settings
├─ [ ] Change JWT secrets
├─ [ ] Update database password
├─ [ ] Configure backups
└─ [ ] Go LIVE!
```

This should clarify how everything connects! 🚀
