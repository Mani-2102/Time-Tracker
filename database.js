// Pro Work Time Tracker - Database Manager
// This file manages all user data and authentication

class DatabaseManager {
  constructor() {
    this.USERS_KEY = "pwtm_users";
    this.CURRENT_USER_KEY = "pwtm_current_user";
    this.initializeDatabase();
  }

  // Initialize database structure
  initializeDatabase() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify({}));
    }
  }

  // Get all users
  getAllUsers() {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : {};
  }

  // Check if user exists
  userExists(username) {
    const users = this.getAllUsers();
    return users.hasOwnProperty(username);
  }

  // Register new user
  registerUser(username, password) {
    if (this.userExists(username)) {
      return { success: false, message: "User already exists!" };
    }

    const users = this.getAllUsers();
    users[username] = {
      password: this.hashPassword(password),
      createdAt: new Date().toISOString(),
      sheets: {
        "Sheet 1": [],
      },
      currentSheet: "Sheet 1",
      runningTimers: {},
      singleTaskMode: true,
      isNew: true,
    };

    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return { success: true, message: "User registered successfully!" };
  }

  // Authenticate user
  authenticateUser(username, password) {
    const users = this.getAllUsers();

    if (!users.hasOwnProperty(username)) {
      return { success: false, message: "User not found!", isNew: true };
    }

    const user = users[username];
    if (user.password !== this.hashPassword(password)) {
      return { success: false, message: "Incorrect password!" };
    }

    return { success: true, message: "Login successful!", isNew: user.isNew };
  }

  // Get user data
  getUserData(username) {
    const users = this.getAllUsers();
    if (users.hasOwnProperty(username)) {
      return users[username];
    }
    return null;
  }

  // Save user data
  saveUserData(username, userData) {
    const users = this.getAllUsers();
    if (users.hasOwnProperty(username)) {
      // Mark as not new after first save
      userData.isNew = false;
      users[username] = { ...users[username], ...userData };
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  }

  // Set current user
  setCurrentUser(username) {
    localStorage.setItem(this.CURRENT_USER_KEY, username);
  }

  // Get current user
  getCurrentUser() {
    return localStorage.getItem(this.CURRENT_USER_KEY);
  }

  // Logout
  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Simple password hashing (for client-side only - not secure for production)
  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Delete user
  deleteUser(username) {
    const users = this.getAllUsers();
    delete users[username];
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Export user data (for backup)
  exportUserData(username) {
    const userData = this.getUserData(username);
    return userData ? JSON.stringify(userData, null, 2) : null;
  }

  // Get all user statistics
  getUserStats(username) {
    const userData = this.getUserData(username);
    if (!userData) return null;

    let totalSheets = Object.keys(userData.sheets).length;
    let totalTasks = 0;
    let totalTime = 0;

    Object.values(userData.sheets).forEach((sheet) => {
      totalTasks += sheet.length;
      sheet.forEach((task) => {
        totalTime += task.total || 0;
      });
    });

    return {
      totalSheets,
      totalTasks,
      totalTime,
      totalTimeFormatted: this.formatDuration(totalTime),
      joinedDate: new Date(userData.createdAt).toLocaleDateString(),
    };
  }

  // Format duration
  formatDuration(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }
}

// Create global database instance
const db = new DatabaseManager();
