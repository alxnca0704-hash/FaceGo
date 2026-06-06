import * as SQLite from 'expo-sqlite';

// ONE Master Database Connection
const db = SQLite.openDatabaseSync('attendance.db');

export const initializeBiometricDatabase = () => {
  try {
    db.execSync(`
      -- 1. Biometric Ledgers (Saved FIRST when face is captured)
      CREATE TABLE IF NOT EXISTS enrollment_ledgers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- 2. Core Users Table (Saved SECOND, linked to the ledger)
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        department TEXT,
        ledger_id INTEGER NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ledger_id) REFERENCES enrollment_ledgers(id) ON DELETE CASCADE
      );

      -- 3. Departments Lookup Table
      CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );

      -- 4. Attendance Logs
      CREATE TABLE IF NOT EXISTS attendance_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL, 
        time_in TEXT NOT NULL, 
        status TEXT NOT NULL, 
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    
    // Migration for existing installs
    try {
      db.execSync('ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1;');
    } catch (e) {
      // Column might already exist
    }

    console.log('✅ Unified Database initialized successfully.');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

export const saveBiometricLedger = (capturedProfiles: any[]) => {
  try {
    const fullLedgerPayload = JSON.stringify(capturedProfiles);
    db.runSync(
      'INSERT INTO enrollment_ledgers (profile_data) VALUES (?)',
      [fullLedgerPayload]
    );
    return { success: true };
  } catch (error) {
    console.error("SQLite Ledger Write Error:", error);
    return { success: false, error };
  }
};

export const getLatestLedgerId = (): number | null => {
  try {
    const result = db.getFirstSync<{ id: number }>(
      'SELECT id FROM enrollment_ledgers ORDER BY id DESC LIMIT 1'
    );
    return result ? result.id : null;
  } catch (error) {
    return null;
  }
};

export const saveUserProfile = (employeeId: string, fullName: string, department: string, ledgerId: number) => {
  try {
    db.runSync(
      'INSERT INTO users (employee_id, full_name, department, ledger_id) VALUES (?, ?, ?, ?)',
      [employeeId, fullName, department, ledgerId]
    );
    return { success: true };
  } catch (error) {
    console.error("SQLite User Profile Write Error:", error);
    return { success: false, error };
  }
};

export const getDbConnection = () => db;
