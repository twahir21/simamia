import { db } from "./stock.sqlite"

export const initSettingsDb = () => {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY NOT NULL,
            value TEXT NOT NULL
        );
    `)
}

export const insertSettingsDb = () => {
    db.runSync(`
        INSERT INTO settings (
        key, value
        ) VALUES (?, ?)
    `, [])
}