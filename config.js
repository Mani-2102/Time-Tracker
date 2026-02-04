// API Configuration - Change this to your server IP
// Use api.iamtimer.com for production (with HTTPS after SSL setup)
// Fallback to IP if domain not ready
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://139.59.30.160:5000" // Development
    : "https://api.iamtimer.com"; // Production

// JWT Token Storage Keys (same as login.html)
const JWT_KEYS = {
  AUTH_TOKEN: "pwtm_auth_token",
  USER_DATA: "pwtm_user_data",
  REFRESH_TOKEN: "pwtm_refresh_token",
};

// Get JWT token from localStorage
function getAuthToken() {
  return localStorage.getItem(JWT_KEYS.AUTH_TOKEN);
}

// Get current user data
function getCurrentUserData() {
  const userData = localStorage.getItem(JWT_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getAuthToken() && !!getCurrentUserData();
}

// Offline sync queue - stores data to sync when back online
const SYNC_QUEUE_KEY = "pwtm_sync_queue";

function getSyncQueue() {
  const queue = localStorage.getItem(SYNC_QUEUE_KEY);
  return queue ? JSON.parse(queue) : [];
}

function addToSyncQueue(item) {
  const queue = getSyncQueue();
  // Add unique ID to prevent duplicates
  item.queueId = Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  queue.push(item);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

function removeFromSyncQueue(queueId) {
  const queue = getSyncQueue().filter((item) => item.queueId !== queueId);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

function clearSyncQueue() {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([]));
}

// API Endpoints
const API_ENDPOINTS = {
  // Timer Sessions (with auth)
  timerSessions: `${API_BASE_URL}/api/timer/sessions`,
  timerSession: (id) => `${API_BASE_URL}/api/timer/sessions/${id}`,
  timerSync: `${API_BASE_URL}/api/sync/timer`,

  // Todos
  todos: `${API_BASE_URL}/api/todos`,
  todo: (id) => `${API_BASE_URL}/api/todos/${id}`,

  // Auth
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
};

// Helper function for API calls WITH authentication
async function apiCall(
  endpoint,
  method = "GET",
  data = null,
  requireAuth = true,
) {
  try {
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Add JWT token if required and available
    if (requireAuth) {
      const token = getAuthToken();
      if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
      } else {
        // No token - save to sync queue for later
        console.log("No auth token - data will sync when online/logged in");
        return { success: false, error: "No token provided", offline: true };
      }
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (!response.ok) {
      console.error("API Error:", result);
      return { success: false, error: result.error || "Unknown error" };
    }

    return result;
  } catch (error) {
    console.error("Fetch Error:", error);
    // Network error - save to sync queue
    return { success: false, error: error.message, offline: true };
  }
}

// Silent sync function - no alerts, just logs
async function silentSync(endpoint, method, data, dataType) {
  const result = await apiCall(endpoint, method, data, true);

  if (result.offline || !result.success) {
    // Save to sync queue for later
    addToSyncQueue({
      endpoint,
      method,
      data,
      dataType,
      timestamp: new Date().toISOString(),
    });
    console.log(`[Sync] Saved to queue for later: ${dataType}`);
    return { success: true, queued: true };
  }

  console.log(`[Sync] Synced to server: ${dataType}`);
  return result;
}

// Process sync queue when back online
async function processSyncQueue() {
  if (!isAuthenticated()) return;

  const queue = getSyncQueue();
  if (queue.length === 0) return;

  console.log(`[Sync] Processing ${queue.length} queued items...`);

  for (const item of queue) {
    try {
      const result = await apiCall(item.endpoint, item.method, item.data, true);
      if (result.success) {
        removeFromSyncQueue(item.queueId);
        console.log(`[Sync] Processed queued item: ${item.dataType}`);
      }
    } catch (err) {
      console.log(`[Sync] Failed to process: ${item.dataType}`, err);
    }
  }
}

// Auto-sync when coming online
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    console.log("[Sync] Back online - processing queue...");
    processSyncQueue();
  });

  // Process queue on page load if online
  if (navigator.onLine) {
    setTimeout(processSyncQueue, 2000);
  }
}

// Timer Sessions API - WITH silent sync
const timerAPI = {
  getSessions: async () =>
    await apiCall(API_ENDPOINTS.timerSessions, "GET", null, true),

  addSession: async (sessionData) => {
    // Always save locally first (handled by caller)
    // Then try to sync to server silently
    return await silentSync(
      API_ENDPOINTS.timerSessions,
      "POST",
      sessionData,
      "timer_session",
    );
  },

  updateSession: async (id, sessionData) =>
    await silentSync(
      API_ENDPOINTS.timerSession(id),
      "PUT",
      sessionData,
      "timer_update",
    ),

  deleteSession: async (id) =>
    await silentSync(
      API_ENDPOINTS.timerSession(id),
      "DELETE",
      null,
      "timer_delete",
    ),

  // Sync all timer data to server
  syncAll: async (allData) => {
    return await silentSync(
      API_ENDPOINTS.timerSync,
      "POST",
      { timerData: allData },
      "timer_sync_all",
    );
  },

  // Load from server (for cross-device sync)
  loadFromServer: async () => {
    const result = await apiCall(API_ENDPOINTS.timerSync, "GET", null, true);
    if (result.success && result.data) {
      return { success: true, data: result.data.timerData || [] };
    }
    return { success: false, data: [] };
  },
};

// Todos API - WITH silent sync
const todoAPI = {
  getTodos: async () => await apiCall(API_ENDPOINTS.todos, "GET", null, true),

  addTodo: async (todoData) =>
    await silentSync(API_ENDPOINTS.todos, "POST", todoData, "todo_add"),

  updateTodo: async (id, todoData) =>
    await silentSync(API_ENDPOINTS.todo(id), "PUT", todoData, "todo_update"),

  deleteTodo: async (id) =>
    await silentSync(API_ENDPOINTS.todo(id), "DELETE", null, "todo_delete"),
};

// Auth API - No auth required for login/register
const authAPI = {
  register: async (username, email, password) =>
    await apiCall(
      API_ENDPOINTS.register,
      "POST",
      { username, email, password },
      false,
    ),

  login: async (email, password) =>
    await apiCall(API_ENDPOINTS.login, "POST", { email, password }, false),
};
