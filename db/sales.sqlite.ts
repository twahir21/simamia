import { CartItem } from "@/types/stock.types";
import { db } from "./stock.sqlite";
import { AllSalesRecords, SaleItem, SaleRecord } from "@/types/globals.types";

export const initSalesDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      saleNumber TEXT UNIQUE NOT NULL,
      totalAmount REAL NOT NULL,
      paidAmount REAL NOT NULL,
      balance REAL NOT NULL,
      paymentType TEXT NOT NULL CHECK (
        paymentType IN ('cash', 'digital', 'mixed', 'debt')
      ),
      status TEXT NOT NULL CHECK (
        status IN ('paid', 'partial', 'unpaid')
      ),
      customerName TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// keep it separate from sales to support deleted stock (since user may have debt sales -> pay later)
export const initSaleItemsDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      saleId INTEGER NOT NULL,
      stockId INTEGER,
      productName TEXT NOT NULL,
      qty INTEGER NOT NULL,
      price REAL NOT NULL,
      isQuickSale INTEGER DEFAULT 0,
      FOREIGN KEY (saleId) REFERENCES sales(id)
    );
  `);
};


export const deleteSalesDb = () => {
  return db.execSync(`
  DROP TABLE IF EXISTS sales;
  DROP TABLE IF EXISTS sale_items;
`);
}



export const saveCashSales = (totalAmount: number, cart: CartItem[]) => {

  db.execSync("BEGIN TRANSACTION");

  try {
    // 1️⃣ Insert sale
    const saleResult = db.runSync(
      `
      INSERT INTO sales (
        saleNumber,
        totalAmount,
        paidAmount,
        balance,
        paymentType,
        status
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        `SALE-${Date.now()}`,
        totalAmount,
        totalAmount,
        0,
        "cash",
        "paid",
      ]
    );

    const saleId = saleResult.lastInsertRowId;

    // 2️⃣ Insert sale items + reduce stock
    for (const item of cart) {
      // sale_items
      db.runSync(
        `
        INSERT INTO sale_items (
            saleId,
            stockId,
            productName,
            qty,
            price,
            isQuickSale
        ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            saleId,
            item.isQuickSale ? null : item.stockId,
            item.name,
            item.qty,
            item.price,
            item.isQuickSale ? 1 : 0,
        ]
        );


      // reduce stock and skip for quick sales
      if (!item.isQuickSale) {
        db.runSync(
          `
          UPDATE stock
          SET quantity = quantity - ?
          WHERE id = ? AND quantity >= ?
        `,
          [item.qty, item.stockId, item.qty]
        );
      }
    }

    db.execSync("COMMIT");
    return saleId;
  } catch (error) {
    db.execSync("ROLLBACK");
    throw error;
  }
}

export const saveDigitalSales = (totalAmount: number, cart: CartItem[]) => {

  db.execSync("BEGIN TRANSACTION");

  try {
    // 1️⃣ Insert sale
    const saleResult = db.runSync(
      `
      INSERT INTO sales (
        saleNumber,
        totalAmount,
        paidAmount,
        balance,
        paymentType,
        status
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        `SALE-${Date.now()}`,
        totalAmount,
        totalAmount,
        0,
        "digital",
        "paid",
      ]
    );

    const saleId = saleResult.lastInsertRowId;

    // 2️⃣ Insert sale items + reduce stock
    for (const item of cart) {
      // sale_items
      db.runSync(
        `
        INSERT INTO sale_items (
            saleId,
            stockId,
            productName,
            qty,
            price,
            isQuickSale
        ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            saleId,
            item.isQuickSale ? null : item.stockId,
            item.name,
            item.qty,
            item.price,
            item.isQuickSale ? 1 : 0,
        ]
        );


      // reduce stock and skip for quick sales
      if (!item.isQuickSale) {
        db.runSync(
          `
          UPDATE stock
          SET quantity = quantity - ?
          WHERE id = ? AND quantity >= ?
        `,
          [item.qty, item.stockId, item.qty]
        );
      }
    }

    db.execSync("COMMIT");
    return saleId;
  } catch (error) {
    db.execSync("ROLLBACK");
    throw error;
  }
}

export const fetchSales = () => {
  const sales = db.getAllSync<SaleRecord>(`
    SELECT * FROM sales ORDER BY createdAt DESC
  `);

  const allItems = db.getAllSync<SaleItem>(`SELECT * FROM sale_items`);

  // 3. Map items to their respective sales
  return sales.map((sale) => ({
    ...sale,
    items: allItems.filter((item) => item.saleId === sale.id),
  }));
}

export const fetchSaleById = (saleId: number): AllSalesRecords | null => {
  const sale = db.getFirstSync<SaleRecord>(
    `SELECT * FROM sales WHERE id = ?`, 
    [saleId]
  );

  if (!sale) return null;

  const items = db.getAllSync<SaleItem>(
    `SELECT * FROM sale_items WHERE saleId = ?`, 
    [saleId]
  );

  return { ...sale, items };
};

const hasEnoughStock = (id: number, requestedQty: number): boolean => {
    const result = db.getFirstSync<{ quantity: number }>(
        `SELECT quantity FROM stock WHERE id = ?`, 
        [id]
    );

    // If product doesn't exist, we definitely don't have enough stock
    if (!result) return false;

    // Check if we have enough to cover the request
    return (result.quantity - requestedQty) >= 0;
}

export const validateCartStock = (cart: CartItem[]): { isValid: boolean; message: string } => {
  for (const item of cart) {
    // 1. Skip validation if it's a Quick Sale
    if (item.isQuickSale) continue;

    // 2. check other items in cart
    if (!hasEnoughStock(item.stockId, item.qty)) {
      return { 
        isValid: false, 
        message: `The item "${item.name}" does not have enough stock.` 
      };
    }
  }
  
  // If the loop finishes without returning, everything is good!
  return { isValid: true, message: 'All items have enough stock'};
};