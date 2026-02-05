// ============================================================
// FRONTEND-BACKEND DATA INTEGRATION - COMPLETE GUIDE
// ============================================================
//
// This file shows EXACTLY how to save data from your frontend
// to the backend. Copy these functions into your HTML files.
//
// ============================================================

// ==========================================
// STEP 1: CONFIGURATION (put at top of your HTML <script>)
// ==========================================

const API_URL = "http://139.59.30.160:5000/api";

// Get stored auth data
function getAuth() {
  return {
    token: localStorage.getItem("authToken"),
    userId: localStorage.getItem("userId"),
    deviceId: localStorage.getItem("deviceId"),
  };
}

// Check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem("authToken");
}

// ==========================================
// STEP 2: API HELPER FUNCTION (reusable for all requests)
// ==========================================

async function apiRequest(endpoint, method = "GET", data = null) {
  const auth = getAuth();

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Add auth token if logged in
  if (auth.token) {
    options.headers["Authorization"] = "Bearer " + auth.token;
  }

  // Add body data for POST/PUT
  if (data && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(API_URL + endpoint, options);
    const result = await response.json();

    // Handle expired token
    if (response.status === 403 || response.status === 401) {
      console.log("Token expired, need to login again");
      localStorage.removeItem("authToken");
      window.location.href = "login.html";
      return null;
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// STEP 3: USER AUTHENTICATION
// ==========================================

// Register new user
async function registerUser(username, email, password) {
  const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
  localStorage.setItem("deviceId", deviceId);

  const result = await apiRequest("/auth/register", "POST", {
    username,
    email,
    password,
    device_id: deviceId,
    device_name: navigator.userAgent.substring(0, 50),
  });

  if (result && result.success) {
    // Store auth data
    localStorage.setItem("authToken", result.token);
    localStorage.setItem("refreshToken", result.refreshToken);
    localStorage.setItem("userId", result.user.id);
    localStorage.setItem("userName", result.user.username);
    localStorage.setItem("userEmail", result.user.email);
    console.log("✅ Registration successful!");
  }

  return result;
}

// Login user
async function loginUser(email, password) {
  const deviceId = localStorage.getItem("deviceId") || generateDeviceId();
  localStorage.setItem("deviceId", deviceId);

  const result = await apiRequest("/auth/login", "POST", {
    email,
    password,
    device_id: deviceId,
    device_name: navigator.userAgent.substring(0, 50),
  });

  if (result && result.success) {
    // Store auth data
    localStorage.setItem("authToken", result.token);
    localStorage.setItem("refreshToken", result.refreshToken);
    localStorage.setItem("userId", result.user.id);
    localStorage.setItem("userName", result.user.username);
    localStorage.setItem("userEmail", result.user.email);
    console.log("✅ Login successful!");
  }

  return result;
}

// Logout user
function logoutUser() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  // Keep deviceId for next login
  window.location.href = "login.html";
}

// Generate unique device ID
function generateDeviceId() {
  return "device_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}

// ==========================================
// STEP 4: SAVE TIMER SESSION
// ==========================================

// Save a completed timer session to backend
async function saveTimerSession(taskName, duration, category = "General") {
  if (!isLoggedIn()) {
    console.log("Not logged in, saving to localStorage only");
    saveTimerLocal(taskName, duration, category);
    return;
  }

  const result = await apiRequest("/timer/sessions", "POST", {
    task_name: taskName,
    duration: duration, // in seconds
    category: category,
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
    description: "",
  });

  if (result && result.success) {
    console.log("✅ Timer session saved to backend, ID:", result.id);
  } else {
    console.log("⚠️ Backend save failed, saving locally");
    saveTimerLocal(taskName, duration, category);
  }

  return result;
}

// Get all timer sessions from backend
async function getTimerSessions(date = null) {
  let endpoint = "/timer/sessions";
  if (date) {
    endpoint += "?date=" + date;
  }

  const result = await apiRequest(endpoint, "GET");
  return result && result.success ? result.data : [];
}

// Get timer statistics
async function getTimerStats() {
  const result = await apiRequest("/timer/stats", "GET");
  return result && result.success ? result.data : null;
}

// Local fallback for timer
function saveTimerLocal(taskName, duration, category) {
  const sessions = JSON.parse(localStorage.getItem("timerSessions") || "[]");
  sessions.push({
    id: Date.now(),
    task_name: taskName,
    duration: duration,
    category: category,
    date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  });
  localStorage.setItem("timerSessions", JSON.stringify(sessions));
}

// ==========================================
// STEP 5: SAVE TODO ITEMS
// ==========================================

// Create new todo
async function createTodo(title, description = "", priority = 1) {
  if (!isLoggedIn()) {
    console.log("Not logged in, saving to localStorage only");
    saveTodoLocal(title, description, priority);
    return;
  }

  const result = await apiRequest("/todos", "POST", {
    title,
    description,
    priority, // 1 = low, 2 = medium, 3 = high
  });

  if (result && result.success) {
    console.log("✅ Todo saved to backend, ID:", result.id);
  }

  return result;
}

// Get all todos
async function getTodos() {
  const result = await apiRequest("/todos", "GET");
  return result && result.success ? result.data : [];
}

// Update todo
async function updateTodo(todoId, updates) {
  // updates can include: title, description, completed, priority
  const result = await apiRequest("/todos/" + todoId, "PUT", updates);
  return result;
}

// Mark todo as complete
async function completeTodo(todoId) {
  return await updateTodo(todoId, { completed: true });
}

// Delete todo
async function deleteTodo(todoId) {
  const result = await apiRequest("/todos/" + todoId, "DELETE");
  return result;
}

// Local fallback for todos
function saveTodoLocal(title, description, priority) {
  const todos = JSON.parse(localStorage.getItem("todos") || "[]");
  todos.push({
    id: Date.now(),
    title,
    description,
    priority,
    completed: false,
    created_at: new Date().toISOString(),
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ==========================================
// STEP 6: SYNC ALL DATA
// ==========================================

// Get all user data at once (for page load)
async function syncAllData() {
  if (!isLoggedIn()) {
    return null;
  }

  const result = await apiRequest("/sync/all", "GET");

  if (result && result.success) {
    console.log("✅ Data synced from backend");
    return result.data;
  }

  return null;
}

// ==========================================
// STEP 7: DEVICE MANAGEMENT
// ==========================================

// Get all logged-in devices
async function getDevices() {
  const result = await apiRequest("/devices", "GET");
  return result && result.success ? result.data : [];
}

// Remove a device (logout from that device)
async function removeDevice(deviceId) {
  const result = await apiRequest("/devices/" + deviceId, "DELETE");
  return result;
}

// ==========================================
// USAGE EXAMPLES
// ==========================================

/*

// Example 1: Login and save timer
async function example1() {
  // Login first
  await loginUser("user@example.com", "password123");
  
  // Then save a timer session
  await saveTimerSession("Study Math", 3600, "Study");  // 1 hour
}

// Example 2: Load all data on page load
async function example2() {
  if (isLoggedIn()) {
    const data = await syncAllData();
    console.log("Timers:", data.timers);
    console.log("Todos:", data.todos);
  } else {
    window.location.href = "login.html";
  }
}

// Example 3: Create and complete a todo
async function example3() {
  // Create todo
  const result = await createTodo("Finish homework", "Math chapter 5", 3);
  
  // Mark it complete
  if (result.success) {
    await completeTodo(result.id);
  }
}

// Example 4: On page load, check if logged in
document.addEventListener("DOMContentLoaded", async () => {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return;
  }
  
  // Load user's data
  const data = await syncAllData();
  if (data) {
    displayTimers(data.timers);
    displayTodos(data.todos);
  }
});

*/

// ==========================================
// WHAT TO DO IN EACH HTML FILE
// ==========================================

/*

1. LOGIN.HTML (already created)
   - Use loginUser() and registerUser()
   - Redirect to index.html after login

2. INDEX.HTML (Main Dashboard)
   - On load: Check isLoggedIn(), redirect if not
   - On load: Call syncAllData() to get user's data
   - Display timer stats from getTimerStats()

3. TIMER.HTML
   - On load: Check isLoggedIn()
   - When timer stops: Call saveTimerSession(taskName, duration, category)
   
4. TODO.HTML
   - On load: Get todos with getTodos()
   - Create: Use createTodo(title, description, priority)
   - Complete: Use completeTodo(id)
   - Delete: Use deleteTodo(id)

5. WELCOME.HTML
   - Check isLoggedIn()
   - If logged in: redirect to index.html
   - If not: show welcome page with login/register buttons

*/

// ==========================================
// DATABASE TABLES NEEDED ON SERVER
// ==========================================

/*
Run this SQL on your MySQL server:

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  device_id VARCHAR(100) NOT NULL,
  device_name VARCHAR(100),
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_device (user_id, device_id)
);

CREATE TABLE timer_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  device_id VARCHAR(100),
  task_name VARCHAR(200) NOT NULL,
  duration INT DEFAULT 0,
  date DATE,
  category VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority INT DEFAULT 1,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE sheets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

*/

console.log("Frontend-Backend Integration Guide loaded!");
