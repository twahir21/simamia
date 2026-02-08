import { db } from "./stock.sqlite";

function formatDateKey() {
  const now = new Date();
  return (
    now.getFullYear().toString().slice(-2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0")
  );
}


export function initOrderCounter() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS order_counter (
      date TEXT PRIMARY KEY,
      counter INTEGER
    );
  `);
}



export function generateOrderCode(): string {
  const date = formatDateKey();

  const row = db.getFirstSync<{ counter: number }>(
    `SELECT counter FROM order_counter WHERE date = ?`,
    [date]
  );

  let next = 1;

  if (row) {
    next = row.counter + 1;

    db.runSync(
      `UPDATE order_counter SET counter=? WHERE date=?`,
      [next, date]
    );
  } else {
    db.runSync(
      `INSERT INTO order_counter(date,counter) VALUES (?,?)`,
      [date, next]
    );
  }

  const seq = next.toString().padStart(3, "0");

  return `C-${date}-${seq}`;
}
