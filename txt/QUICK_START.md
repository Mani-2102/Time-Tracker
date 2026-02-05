# ⚡ QUICK START - DO THIS NOW!

Follow these steps IN ORDER. Copy and paste each command.

---

## STEP 1: Upload Frontend Files to Server

Open PowerShell on your PC and run these commands ONE BY ONE:

### 1.1 First, create the public folder (run this once)

```powershell
ssh root@139.59.30.160 "mkdir -p ~/timer-backend/public"
```

(Enter your server password when asked)

### 1.2 Upload all files (run each command separately)

```powershell
scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\index.html" root@139.59.30.160:~/timer-backend/public/
```

```powershell
scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\login.html" root@139.59.30.160:~/timer-backend/public/
```

```powershell
scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\welcome.html" root@139.59.30.160:~/timer-backend/public/
```

```powershell
scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\Timer.html" root@139.59.30.160:~/timer-backend/public/
```

```powershell
scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\todo.html" root@139.59.30.160:~/timer-backend/public/
```

```powershell
scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\YearActivity.html" root@139.59.30.160:~/timer-backend/public/
```

```powershell
scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\NotificationTimer.html" root@139.59.30.160:~/timer-backend/public/
```

```powershell
scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\database.js" root@139.59.30.160:~/timer-backend/public/
```

```powershell
scp "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker\config.js" root@139.59.30.160:~/timer-backend/public/
```

---

## STEP 2: Restart the Server

```powershell
ssh root@139.59.30.160 "pm2 restart timer-backend"
```

---

## STEP 3: Test Your App!

Open these URLs in your browser:

| Page             | URL                               |
| ---------------- | --------------------------------- |
| 🏠 Welcome       | http://139.59.30.160:5000         |
| 🔐 Login         | http://139.59.30.160:5000/login   |
| ⏱️ Time Tracker  | http://139.59.30.160:5000/tracker |
| 📱 Test on Phone | Same URLs on your phone browser   |

---

## STEP 4: Push to GitHub

```powershell
cd "e:\Folder Management-25-2\Organising\1_Lerning\Project verson 2 vs code\Time-Tracker"
```

```powershell
git add .
```

```powershell
git commit -m "Updated authentication flow"
```

```powershell
git push origin main
```

---

## ✅ DONE!

Your app should now be working at: **http://139.59.30.160:5000**

Test the login:

1. Go to http://139.59.30.160:5000/login
2. Click "Create Account"
3. Register with your email
4. After login, click "Open Dashboard"
5. You should see the Time Tracker without another login popup!
