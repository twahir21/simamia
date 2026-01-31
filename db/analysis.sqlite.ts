import { db } from "./stock.sqlite";

type HomeAnalysisTs = {
  todaySales: number;
  todayProfit: number;
  lowStock: number;
  outOfStock: number;
  expiredProducts: number;
};

export const fetchHomeAnalysis = (): HomeAnalysisTs => {
  const result = db.getFirstSync<HomeAnalysisTs>(`
    SELECT
      /* ================= SALES ================= */
      (
        SELECT COALESCE(SUM(totalAmount), 0)
        FROM sales
        WHERE DATE(createdAt, '+3 hours') = DATE('now', '+3 hours')
      ) AS todaySales,

      /* ================= PROFIT ================= */
        (
        SELECT COALESCE(
            SUM(
            CASE 
                WHEN si.isQuickSale = 1 THEN (si.price * si.qty)
                ELSE (si.price - IFNULL(s.buyingPrice, 0)) * si.qty 
            END
            ),
            0
        )
        FROM sale_items si
        JOIN sales sa ON sa.id = si.saleId
        LEFT JOIN stock s ON s.id = si.stockId
        WHERE DATE(sa.createdAt, '+3 hours') = DATE('now', '+3 hours')
        ) AS todayProfit,

      /* ================= INVENTORY ================= */
      (
        SELECT COUNT(*)
        FROM stock
        WHERE quantity > 0 AND quantity <= minStock
      ) AS lowStock,

      (
        SELECT COUNT(*)
        FROM stock
        WHERE quantity = 0
      ) AS outOfStock,

      (
        SELECT COUNT(*)
        FROM stock
        WHERE expiryDate IS NOT NULL
          AND DATE(expiryDate) < DATE('now', '+3 hours')
      ) AS expiredProducts;
  `);

  return {
    todaySales: result?.todaySales ?? 0,
    todayProfit: result?.todayProfit ?? 0,
    lowStock: result?.lowStock ?? 0,
    outOfStock: result?.outOfStock ?? 0,
    expiredProducts: result?.expiredProducts ?? 0,
  };
};
