// API Configuration for Time Tracker
// This file is required for frontend-backend communication

// API Base URL - automatically selects based on environment
const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000" // Development - local
    : window.location.hostname === "139.59.30.160"
      ? "http://139.59.30.160:5000" // Direct IP access
      : "https://api.iamtimer.com"; // Production - use domain

// JWT Token Storage Keys
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

// API Endpoints
const API_ENDPOINTS = {
  // Auth
  register: `${API_BASE_URL}/api/auth/register`,
  login: `${API_BASE_URL}/api/auth/login`,
  profile: `${API_BASE_URL}/api/auth/profile`,

  // Sync
  syncTracker: `${API_BASE_URL}/api/sync/tracker`,
  syncAll: `${API_BASE_URL}/api/sync/all`,

  // Timer Sessions
  timerSessions: `${API_BASE_URL}/api/timer/sessions`,

  // Todos
  todos: `${API_BASE_URL}/api/todos`,

  // Health
  health: `${API_BASE_URL}/api/health`,
};

// Helper function for API calls
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

    // Add JWT token if required
    if (requireAuth) {
      const token = getAuthToken();
      if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
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
    return { success: false, error: error.message };
  }
}

// Check JWT authentication status
function isJWTAuthenticated() {
  const token = getAuthToken();
  const userData = getCurrentUserData();
  return !!token && !!userData;
}

// Test backend connection
async function testBackendConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const result = await response.json();
    console.log("✅ Backend is reachable:", result);
    return true;
  } catch (error) {
    console.error("❌ Backend connection failed:", error.message);
    console.error("💡 Trying alternative URL...");
    return false;
  }
}

console.log("✅ config.js loaded - API_BASE_URL:", API_BASE_URL);
