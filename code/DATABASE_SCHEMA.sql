-- Pro Timer Backend - MySQL Database Schema
-- Run this SQL on your MySQL server to create the database

-- Create Database
CREATE DATABASE IF NOT EXISTS time_tracker;
USE time_tracker;

-- ============ USERS TABLE ============
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ USER SESSIONS (Multi-Device) ============
CREATE TABLE user_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  device_id VARCHAR(255) UNIQUE NOT NULL,
  device_name VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_device_id (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ TIMER SESSIONS TABLE ============
CREATE TABLE timer_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  device_id VARCHAR(255),
  task_name VARCHAR(200) NOT NULL,
  duration INT, -- milliseconds
  date DATE,
  category VARCHAR(50) DEFAULT 'General',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES user_sessions(device_id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_date (date),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ TODOS TABLE ============
CREATE TABLE todos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority INT DEFAULT 1,
  due_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ SHEETS TABLE ============
CREATE TABLE sheets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ SHEET ITEMS TABLE ============
CREATE TABLE sheet_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sheet_id INT NOT NULL,
  task_name VARCHAR(200) NOT NULL,
  total_time INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (sheet_id) REFERENCES sheets(id) ON DELETE CASCADE,
  INDEX idx_sheet_id (sheet_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ SYNC LOG TABLE (Optional - for debugging) ============
CREATE TABLE sync_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  device_id VARCHAR(255),
  action VARCHAR(50), -- 'upload', 'download', 'merge'
  data_type VARCHAR(50), -- 'timer', 'todo', 'sheet'
  record_count INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============ EXAMPLE QUERIES ============

-- Get all timers for user today
-- SELECT * FROM timer_sessions WHERE user_id = 1 AND date = CURDATE();

-- Get all active devices for user
-- SELECT device_id, device_name, last_active FROM user_sessions WHERE user_id = 1;

-- Get user statistics
-- SELECT 
--   COUNT(*) as total_sessions,
--   SUM(duration) as total_time,
--   AVG(duration) as avg_time,
--   category
-- FROM timer_sessions
-- WHERE user_id = 1 AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
-- GROUP BY category;

-- Delete all sessions older than 90 days
-- DELETE FROM timer_sessions WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- ============ PERMISSIONS (Create backend user) ============
-- CREATE USER 'timer_user'@'localhost' IDENTIFIED BY 'secure_password';
-- GRANT ALL PRIVILEGES ON time_tracker.* TO 'timer_user'@'localhost';
-- FLUSH PRIVILEGES;
