import { FetchStock, StockInput } from '@/types/stock.types';
import * as SQLite from 'expo-sqlite';

// Open (or create) the database file
export const db = SQLite.openDatabaseSync('simamia.db');

export const initStockDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productName TEXT UNIQUE NOT NULL,
      category TEXT,
      unit TEXT,
      qrCode TEXT,
      location TEXT DEFAULT 'Main Store',
      expiryDate TEXT,
      suppliers TEXT, 
      batchNumber TEXT,
      targetMax INTEGER,
      status TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      lastUpdate DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const saveStock = (data: StockInput) => {
  try {
    db.runSync(
      `INSERT INTO stock (
        productName, category, unit, qrCode, location, 
        expiryDate, suppliers, batchNumber, targetMax, 
        status, quantity, price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.productName,
        data.category || null,
        data.unit || null,
        data.qrCode || null,
        data.location || 'Main Store',
        data.expiryDate || null,
        data.suppliers || null, 
        data.batchNumber || null,
        data.targetMax ? Number(data.targetMax) : null,
        data.status,
        Number(data.quantity),
        Number(data.price)
      ]
    );
  } catch (error) {
    if(error instanceof Error){
        if (error.message.includes("UNIQUE constraint failed")) {
            alert("Error: A product with this name already exists!")
        }
        console.log(error)
    } else {
      console.error("Database Error");
    }
  }
};

export const fetchAllStock = () => {
  return db.getAllSync<FetchStock>(`SELECT * FROM stock ORDER BY lastUpdate DESC`);
};


export const searchStock = (query: string) => {
  return db.getAllSync(
    `SELECT * FROM stock 
     WHERE productName LIKE ? 
     OR category LIKE ?`,
    [`%${query}%`, `%${query}%`]
  );
};


export const updateStock = (id: number, data: Partial<StockInput>) => {
  db.runSync(
    `UPDATE stock SET
      productName = ?,
      category = ?,
      unit = ?,
      qrCode = ?,
      location = ?,
      expiryDate = ?,
      suppliers = ?,
      batchNumber = ?,
      targetMax = ?,
      status = ?,
      quantity = ?,
      price = ?,
      lastUpdate = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      data.productName,
      data.category ?? null,
      data.unit ?? null,
      data.qrCode ?? null,
      data.location ?? 'Main Store',
      data.expiryDate ?? null,
      data.suppliers ?? null,
      data.batchNumber ?? null,
      data.targetMax ?? null,
      data.status,
      data.quantity,
      data.price,
      id
    ]
  );
};

// do soft delete instead of hard delete (for easy backups)
export const deleteStock = (id: number) => {
  db.runSync(`DELETE FROM stock WHERE id = ?`, [id]);
};
