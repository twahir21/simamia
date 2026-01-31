import { db } from "./stock.sqlite"

// Initialize with default if not exists
export const initSettingsDb = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
    -- Set default value if 'app_lock' doesn't exist
    INSERT OR IGNORE INTO settings (key, value) VALUES ('app_lock', 'false');
  `);
};

// Generic function to save any setting
export const saveSetting = (key: string, value: string) => {
  return db.runSync(
    `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
    [key, value]
  );
};

// Function to fetch a setting
export const getSetting = (key: string): string | null => {
  const result = db.getFirstSync<{ value: string }>(
    `SELECT value FROM settings WHERE key = ?`,
    [key]
  );
  return result ? result.value : null;
};