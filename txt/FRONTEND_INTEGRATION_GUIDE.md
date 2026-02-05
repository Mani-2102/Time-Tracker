# Frontend Integration Guide

## 🎯 Goal

Convert frontend from localStorage-only to API-based with multi-device sync

## 📋 Files to Update

### 1. **config.js** - Add Authentication Management

Replace the current config.js with this:

```javascript
// API Configuration
const API_BASE_URL = "http://139.59.30.160:5000";

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: "pwtm_auth_token",
  REFRESH_TOKEN: "pwtm_refresh_token",
  DEVICE_ID: "pwtm_device_id",
  USER_ID: "pwtm_user_id",
  CURRENT_USER: "pwtm_current_user",
};

// API Endpoints
const API_ENDPOINTS = {
  // Auth
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  refreshToken: `${API_BASE_URL}/api/auth/refresh-token`,

  // Timer Sessions
  timerSessions: `${API_BASE_URL}/api/timer/sessions`,
  timerSession: (id) => `${API_BASE_URL}/api/timer/sessions/${id}`,
  timerStats: `${API_BASE_URL}/api/timer/stats`,

  // Todos
  todos: `${API_BASE_URL}/api/todos`,
  todo: (id) => `${API_BASE_URL}/api/todos/${id}`,

  // Devices
  devices: `${API_BASE_URL}/api/devices`,
  device: (id) => `${API_BASE_URL}/api/devices/${id}`,

  // Health
  health: `${API_BASE_URL}/api/health`,
  testDb: `${API_BASE_URL}/test-db`,
};

// ============ AUTH MANAGEMENT ============

class AuthManager {
  constructor() {
    this.token = this.getToken();
    this.refreshToken = this.getRefreshToken();
    this.deviceId = this.getDeviceId();
    this.userId = this.getUserId();
  }

  // Get stored token
  getToken() {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Get stored refresh token
  getRefreshToken() {
    return sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Get device ID
  getDeviceId() {
    let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (!deviceId) {
      // Generate UUID v4
      deviceId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        },
      );
      localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
    }
    return deviceId;
  }

  // Get user ID
  getUserId() {
    return sessionStorage.getItem(STORAGE_KEYS.USER_ID);
  }

  // Get current user
  getCurrentUser() {
    const user = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }

  // Store after login
  setAuthData(token, refreshToken, userId, user) {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    sessionStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.token = token;
    this.refreshToken = refreshToken;
    this.userId = userId;
  }

  // Clear on logout
  clearAuthData() {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER_ID);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.token = null;
    this.refreshToken = null;
    this.userId = null;
  }

  // Check if logged in
  isLoggedIn() {
    return !!this.token;
  }

  // Refresh token if expired
  async refreshAccessToken() {
    try {
      const response = await fetch(API_ENDPOINTS.refreshToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      const result = await response.json();
      if (result.success) {
        sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, result.token);
        this.token = result.token;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }
}

// Create global auth instance
const auth = new AuthManager();

// ============ API CALL HELPER ============

async function apiCall(endpoint, method = "GET", data = null) {
  try {
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Device-ID": auth.getDeviceId(),
      },
    };

    // Add authorization header if logged in
    if (auth.isLoggedIn()) {
      options.headers.Authorization = `Bearer ${auth.token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, options);

    // Handle token expiration
    if (response.status === 403) {
      const refreshed = await auth.refreshAccessToken();
      if (refreshed) {
        // Retry request with new token
        options.headers.Authorization = `Bearer ${auth.token}`;
        return fetch(endpoint, options).then((res) => res.json());
      } else {
        // Redirect to login
        window.location.href = "welcome.html";
        return { success: false, error: "Session expired" };
      }
    }

    const result = await response.json();

    if (!response.ok) {
      console.error("API Error:", result);
      return { success: false, error: result.error || "Unknown error" };
    }

    return result;
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, error: error.message };
  }
}

// ============ TIMER API ============

const timerAPI = {
  // Get all sessions
  getSessions: async (date = null) => {
    let url = API_ENDPOINTS.timerSessions;
    if (date) {
      url += `?date=${date}`;
    }
    return await apiCall(url);
  },

  // Add new session
  addSession: async (
    taskName,
    duration,
    category = "General",
    description = "",
  ) =>
    await apiCall(API_ENDPOINTS.timerSessions, "POST", {
      task_name: taskName,
      duration: duration,
      category: category,
      description: description,
    }),

  // Update session
  updateSession: async (id, sessionData) =>
    await apiCall(API_ENDPOINTS.timerSession(id), "PUT", sessionData),

  // Delete session
  deleteSession: async (id) =>
    await apiCall(API_ENDPOINTS.timerSession(id), "DELETE"),

  // Get stats
  getStats: async () => await apiCall(API_ENDPOINTS.timerStats),
};

// ============ TODO API ============

const todoAPI = {
  // Get all todos
  getTodos: async () => await apiCall(API_ENDPOINTS.todos),

  // Add todo
  addTodo: async (title, description = "", priority = 1, due_date = null) =>
    await apiCall(API_ENDPOINTS.todos, "POST", {
      title,
      description,
      priority,
      due_date,
    }),

  // Update todo
  updateTodo: async (id, todoData) =>
    await apiCall(API_ENDPOINTS.todo(id), "PUT", todoData),

  // Delete todo
  deleteTodo: async (id) => await apiCall(API_ENDPOINTS.todo(id), "DELETE"),
};

// ============ AUTH API ============

const authAPI = {
  // Register
  register: async (username, email, password, device_name = "Unknown") =>
    await apiCall(API_ENDPOINTS.register, "POST", {
      username,
      email,
      password,
      device_name,
    }),

  // Login
  login: async (email, password, device_name = "Unknown") =>
    await apiCall(API_ENDPOINTS.login, "POST", {
      email,
      password,
      device_name,
      device_id: auth.getDeviceId(),
    }),

  // Logout
  logout: () => {
    auth.clearAuthData();
  },
};

// ============ DEVICE API ============

const deviceAPI = {
  // Get all devices
  getDevices: async () => await apiCall(API_ENDPOINTS.devices),

  // Logout from device
  logoutDevice: async (deviceId) =>
    await apiCall(API_ENDPOINTS.device(deviceId), "DELETE"),
};
```

---

### 2. **welcome.html** - Update Login/Register Form

Add this event handler to the login form:

```javascript
// In welcome.html <script> section

async function handleLogin(email, password) {
  const deviceName = getDeviceName(); // Detect device type

  const result = await authAPI.login(email, password, deviceName);

  if (result.success) {
    // Store auth data
    auth.setAuthData(
      result.token,
      result.refreshToken,
      result.user.id,
      result.user,
    );

    // Redirect to main app
    window.location.href = "index.html";
  } else {
    showError(result.error);
  }
}

async function handleRegister(username, email, password) {
  const deviceName = getDeviceName();

  const result = await authAPI.register(username, email, password, deviceName);

  if (result.success) {
    // Store auth data
    auth.setAuthData(
      result.token,
      result.refreshToken,
      result.user.id,
      result.user,
    );

    // Redirect to main app
    window.location.href = "index.html";
  } else {
    showError(result.error);
  }
}

function getDeviceName() {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "Android Device";
  if (/iphone|ipad/i.test(ua)) return "iOS Device";
  if (/win/i.test(ua)) return "Windows PC";
  if (/mac/i.test(ua)) return "Mac";
  if (/linux/i.test(ua)) return "Linux";
  return "Unknown Device";
}

function showError(message) {
  alert("Error: " + message);
}
```

---

### 3. **index.html** - Update Timer Tracking

Replace localStorage calls with API calls:

```javascript
// OLD (Remove):
// db.saveUserData(currentUser, userData);

// NEW (Add):
async function saveTimerSession(taskName, duration) {
  const result = await timerAPI.addSession(taskName, duration, "General", "");

  if (result.success) {
    console.log("Timer saved to backend!");
    showSyncStatus("✅ Synced");
  } else {
    console.error("Failed to save:", result.error);
    showSyncStatus("❌ Sync failed");
  }
}

async function loadTimerSessions() {
  const today = new Date().toISOString().split("T")[0];
  const result = await timerAPI.getSessions(today);

  if (result.success) {
    displaySessions(result.data);
  } else {
    console.error("Failed to load:", result.error);
  }
}

function showSyncStatus(message) {
  const statusEl =
    document.getElementById("syncStatus") || createSyncStatusElement();
  statusEl.textContent = message;
}

function createSyncStatusElement() {
  const el = document.createElement("div");
  el.id = "syncStatus";
  el.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 15px;
    background: #4f46e5;
    color: white;
    border-radius: 6px;
    font-size: 12px;
    z-index: 999;
  `;
  document.body.appendChild(el);
  return el;
}

// Call on page load
document.addEventListener("DOMContentLoaded", async () => {
  if (!auth.isLoggedIn()) {
    window.location.href = "welcome.html";
    return;
  }

  await loadTimerSessions();

  // Auto-sync every 5 minutes
  setInterval(loadTimerSessions, 5 * 60 * 1000);
});
```

---

### 4. **index.html** - Add Logout & Device Manager

Add to header:

```html
<div class="right">
  <button onclick="showDevices()">📱 Devices</button>
  <button onclick="handleLogout()">Logout</button>
</div>

<!-- Device Modal -->
<div
  id="deviceModal"
  style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;"
>
  <div
    style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%;"
  >
    <h2>Your Devices</h2>
    <div id="deviceList"></div>
    <button onclick="closeDevices()" style="margin-top: 20px; width: 100%;">
      Close
    </button>
  </div>
</div>

<script>
  async function showDevices() {
    const result = await deviceAPI.getDevices();

    const deviceList = document.getElementById("deviceList");
    deviceList.innerHTML = "";

    if (result.success && result.data.length > 0) {
      result.data.forEach((device) => {
        const el = document.createElement("div");
        el.style.cssText = `
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
        el.innerHTML = `
        <div>
          <strong>${device.device_name}</strong>
          <div style="font-size: 12px; color: #666;">
            Last active: ${new Date(device.last_active).toLocaleDateString()}
          </div>
        </div>
        <button onclick="logoutDevice('${device.device_id}')" style="background: #ef4444; color: white;">
          Logout
        </button>
      `;
        deviceList.appendChild(el);
      });
    } else {
      deviceList.innerHTML = "<p>No devices found</p>";
    }

    document.getElementById("deviceModal").style.display = "block";
  }

  function closeDevices() {
    document.getElementById("deviceModal").style.display = "none";
  }

  async function logoutDevice(deviceId) {
    if (confirm("Logout this device?")) {
      await deviceAPI.logoutDevice(deviceId);
      showDevices(); // Refresh
    }
  }

  function handleLogout() {
    if (confirm("Logout from all devices?")) {
      authAPI.logout();
      window.location.href = "welcome.html";
    }
  }
</script>
```

---

### 5. **All HTML Files** - Check Authentication

Add this to the top of every protected page (index.html, Timer.html, etc.):

```html
<script>
  // Ensure user is logged in
  if (!auth.isLoggedIn()) {
    window.location.href = "welcome.html";
  }
</script>
```

---

## 🔄 Data Sync Flow After Implementation

```
User Opens App
    ↓
Check auth token → if expired, refresh
    ↓
Load data from API (GET /api/timer/sessions)
    ↓
Display in UI
    ↓
User creates timer
    ↓
Save to API (POST /api/timer/sessions)
    ↓
Get response with session ID
    ↓
Update UI with server data
    ↓
Every 5 minutes: Auto-sync in background
    ↓
Check for new data on other devices
    ↓
Merge and update UI
    ↓
User can switch devices → Same data everywhere!
```

---

## 🧪 Testing Checklist

- [ ] Register new user
- [ ] Login on same device
- [ ] Create timer → See in API response
- [ ] Login on different device
- [ ] See same timer data
- [ ] Create timer on device 2 → Appears on device 1
- [ ] Delete timer on device 1 → Gone from device 2
- [ ] Edit timer on device 2 → Updated on device 1
- [ ] Logout from device 2 → Still logged in on device 1
- [ ] Go offline → Create timer → Goes back online → Sync happens

---

## ⚠️ Common Issues & Solutions

### Issue: CORS Error

**Solution**: Ensure backend has CORS enabled for your frontend domain

### Issue: 401 Unauthorized

**Solution**: Token expired, needs refresh - handled automatically in apiCall()

### Issue: Data not syncing

**Solution**: Check browser console for errors, ensure backend is running

### Issue: Device ID changes

**Solution**: Store in localStorage (persistent), not sessionStorage

---

## 🎯 Migration Plan

1. **Step 1**: Deploy backend with all endpoints
2. **Step 2**: Update config.js first
3. **Step 3**: Update welcome.html login
4. **Step 4**: Update index.html for timer operations
5. **Step 5**: Update Timer.html for timer display
6. **Step 6**: Update todo.html for todo operations
7. **Step 7**: Full testing across devices
8. **Step 8**: Deploy to production

---

**Ready to integrate?** Start with Step 1: Deploy the backend!
