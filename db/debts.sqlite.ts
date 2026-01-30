import { db } from "./stock.sqlite";

export const initDebtsDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS debts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      saleId INTEGER NOT NULL,
      amountDue REAL NOT NULL,
      amountPaid REAL DEFAULT 0,
      dueDate TEXT,
      status TEXT NOT NULL CHECK (
        status IN ('open', 'partial', 'paid')
      ),
      lastPaymentDate TEXT,
      FOREIGN KEY (saleId) REFERENCES sales(id)
    );
  `);
};
