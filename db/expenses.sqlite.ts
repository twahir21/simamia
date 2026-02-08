import { CartItem } from "@/types/stock.types";
import { db } from "./stock.sqlite";

export const initExpensesDb = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT DEFAULT 'Daily use',           -- e.g., "Weekly Restock" or "Monthly App Sub"
      category TEXT DEFAULT 'Personal', -- Helps with simple filtering
      totalAmount REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const initExpensesItemsDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS expenses_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      expenseId INTEGER NOT NULL,
      stockId INTEGER,              
      productName TEXT NOT NULL,
      qty INTEGER NOT NULL,
      price REAL NOT NULL,
      isQuickExpense INTEGER DEFAULT 0,
      FOREIGN KEY (expenseId) REFERENCES expenses(id) ON DELETE CASCADE
    );
  `);
};

export const saveExpenses = (totalAmount: number, cart: CartItem[], title?: string, category?: string) => {
  db.execSync("BEGIN TRANSACTION");

  try {
    // 1️⃣ Insert expense - REMOVED the trailing comma
    const result = db.runSync(
      `INSERT INTO expenses (totalAmount, title, category) VALUES (?, ?, ?)`,
      [
        totalAmount, 
        title || 'Daily use', 
        category || 'Personal'
      ]
    );

    const expenseId = result.lastInsertRowId;

    // 2️⃣ Insert expense items
    for (const item of cart) {
      db.runSync(
        `INSERT INTO expenses_items (
            expenseId,
            stockId,
            productName,
            qty,
            price,
            isQuickExpense
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
            expenseId,
            item.stockId || null, // Simplified check
            item.name,
            item.qty,
            item.price,
            item.isQuickSale ? 1 : 0,
        ]
      );

      // 3️⃣ Stock Logic
      // Note: If this is an EXPENSE (buying stock), you usually use +
      // If this is a LOSS (wastage), keep it as -
      if (!item.isQuickSale && item.stockId) {
        db.runSync(
          `UPDATE stock SET quantity = quantity - ? WHERE id = ?`,
          [item.qty, item.stockId]
        );
      }
    }

    db.execSync("COMMIT");
    return expenseId;
  } catch (error) {
    db.execSync("ROLLBACK");
    throw error;
  }
};

export const deleteExpensesDb = () => {
  return db.execSync(`
  DROP TABLE IF EXISTS expenses;
  DROP TABLE IF EXISTS expenses_items;
`);
}


export const fetchExpenses = () => {
  return db.getAllSync(
    `SELECT * FROM expenses`
  )
}