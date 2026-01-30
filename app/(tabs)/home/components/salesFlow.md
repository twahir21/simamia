Good question — this is **core POS data modeling**, and the choice you make here affects reports, debts, and audits later.

I’ll be very direct and practical.

---

## 1️⃣ Short answer (best practice)

> ✅ **ALWAYS save the sale in the `sales` table**
> ✅ Track unpaid amounts in a **separate `debts` table**

❌ Do **not** “hold” debt sales outside `sales`
That breaks revenue tracking and daily reports.

---

## 2️⃣ Why debt sales MUST be in `sales`

Even if not paid:

* The product left inventory
* A receipt exists
* Revenue is recognized (accounts receivable)
* Stock must reduce immediately

In real-world accounting:

> **Debt sale = Sale + Outstanding balance**

---

## 3️⃣ Correct table design (clean & scalable)

### 🧾 `sales` table (source of truth)

```ts
export const initSalesDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      saleNumber TEXT UNIQUE NOT NULL,
      totalAmount REAL NOT NULL,
      paidAmount REAL NOT NULL,
      balance REAL NOT NULL,
      paymentType TEXT NOT NULL CHECK (
        paymentType IN ('cash', 'mobile', 'bank', 'mixed', 'debt')
      ),
      status TEXT NOT NULL CHECK (
        status IN ('paid', 'partial', 'unpaid')
      ),
      customerName TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
```

**Examples**

* Cash sale → `paidAmount = totalAmount`, `balance = 0`
* Debt sale → `paidAmount = 0`, `balance > 0`
* Partial → mixed payment

---

## 4️⃣ `sale_items` table (important)

Never store items directly in `sales`.

```ts
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
```

This supports:

* Quick sales
* Deleted stock
* Historical accuracy

---

## 5️⃣ `debts` table (tracking payments over time)

```ts
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
```

👉 One sale → one debt record (simple & clean)

---

## 6️⃣ Payment flow (real-world)

### Cash / Mobile / Bank

```
sales (paid)
```

### Debt sale

```
sales (unpaid)
↓
debts (open)
```

### Customer pays later

```
update debts.amountPaid
update sales.paidAmount
update sales.balance
```

When `balance === 0`:

* `sales.status = 'paid'`
* `debts.status = 'paid'`

---

## 7️⃣ Why this design wins

| Concern            | Result      |
| ------------------ | ----------- |
| Daily sales report | ✅ correct   |
| Stock deduction    | ✅ immediate |
| Debt tracking      | ✅ clean     |
| Audit trail        | ✅ solid     |
| Future sync        | ✅ possible  |

---

## 8️⃣ Common mistakes to avoid ❌

* ❌ Storing debt sales only in `debts`
* ❌ Updating stock only after payment
* ❌ Mixing sale items into sales table
* ❌ Using payment type instead of status

---

## Final recommendation (use this)

* **`sales`** → every sale, no exceptions
* **`sale_items`** → what was sold
* **`debts`** → unpaid balances only
