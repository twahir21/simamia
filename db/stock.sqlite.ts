import { CartStockRow, FetchStock, StockInput } from '@/types/stock.types';
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
      qrCode TEXT UNIQUE,
      location TEXT DEFAULT 'Main Store',
      expiryDate TEXT,
      suppliers TEXT, 
      batchNumber TEXT,
      targetMax INTEGER,
      status TEXT NOT NULL DEFAULT 'in-stock',
      quantity INTEGER NOT NULL,
      sellingPrice REAL NOT NULL,
      buyingPrice REAL NOT NULL,
      totalCost REAL,
      minStock REAL NOT NULL,
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
        status, quantity, sellingPrice, buyingPrice, totalCost, minStock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        Number(data.sellingPrice),
        Number(data.buyingPrice),
        Number(data.totalCost),
        Number(data.minStock)
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

export const deleteStockDb = () => {
  return db.execSync(`
  DROP TABLE IF EXISTS stock;
`);
}


export const searchStock = (query: string) => {
  return db.getAllSync<FetchStock>(
    `SELECT * FROM stock 
     WHERE productName LIKE ? 
     OR qrCode LIKE ? OR category LIKE ?`,
    [`%${query}%`, `%${query}%`, `%${query}`]
  );
};


export const checkIfProductExists = (barcode: string): number | null => {
  const result = db.getFirstSync<{ id: number }>(
    `SELECT id FROM stock WHERE qrCode = ? LIMIT 1`,
    [barcode]
  );

  return result ? result.id : null;
};


export const addToCart = (id: number): CartStockRow | null => {
  return db.getFirstSync<CartStockRow>(`
      SELECT id, productName, sellingPrice FROM stock
      WHERE id = ? LIMIT 1
  `, [id]);
}

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
      sellingPrice = ?,
      buyingPrice = ?,
      totalCost = ?,
      minStock = ?,
      lastUpdate = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      data.productName ?? null,
      data.category ?? null,
      data.unit ?? null,
      data.qrCode ?? null,
      data.location ?? 'Main Store',
      data.expiryDate ?? null,
      data.suppliers ?? null,
      data.batchNumber ?? null,
      data.targetMax ?? 0,
      data.status ?? "in-stock",
      data.quantity ?? 0,
      data.sellingPrice ?? 0,
      data.buyingPrice ?? 0,
      data.totalCost ?? 0,
      data.minStock ?? 0,
      id
    ]
  );
};

// do soft delete instead of hard delete (for easy backups)
export const deleteStock = (id: number) => {
  db.runSync(`DELETE FROM stock WHERE id = ?`, [id]);
};

type stockAnalysisTs = {  lowStock: number; totalItems: number; outOfStock: number} | null;

export const stockAnalysis = () => {
  const result: stockAnalysisTs = db.getFirstSync(`
    SELECT
      COUNT(*) AS totalItems,
      SUM(CASE WHEN quantity > 0 AND quantity < 5 THEN 1 ELSE 0 END) AS lowStock,
      SUM(CASE WHEN quantity = 0 THEN 1 ELSE 0 END) AS outOfStock
    FROM stock;
  `);

  return {
    totalItems: result?.totalItems || 0,
    lowStock: result?.lowStock || 0,
    outOfStock: result?.outOfStock || 0,
  };
};
