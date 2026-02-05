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
          SUM(sa.totalAmount - sub.totalCost),
          0
        )
        FROM sales sa
        JOIN (
          -- Subquery to calculate the total cost (COGS) per sale
          SELECT 
            si.saleId,
            SUM(
              CASE 
                WHEN si.isQuickSale = 1 THEN 0 
                ELSE IFNULL(s.buyingPrice, 0) * si.qty 
              END
            ) AS totalCost
          FROM sale_items si
          LEFT JOIN stock s ON s.id = si.stockId
          GROUP BY si.saleId
        ) sub ON sa.id = sub.saleId
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


export const getTopSoldProducts = (limit: number = 5) => {
  const query = `
    SELECT
      si.stockId AS id,
      si.productName,
      si.price,
      SUM(si.qty) AS itemsSold
    FROM sale_items si
    INNER JOIN sales s ON s.id = si.saleId
    WHERE s.createdAt >= datetime('now','-30 days')    
    GROUP BY si.productName, si.price, si.stockId
    HAVING itemsSold > 0
    ORDER BY itemsSold DESC
    LIMIT ${limit};
  `;

  return db.getAllSync<{
    id: number | null;
    productName: string;
    price: number;
    itemsSold: number;
  }>(query) ?? [];
};


export const getRecentSoldProducts = (limit: number = 8) => {
  const query = `
    SELECT 
      si.stockId as id, 
      si.productName, 
      si.price, 
      MAX(sa.createdAt) as lastSold
    FROM sale_items si
    JOIN sales sa ON si.saleId = sa.id
    GROUP BY si.productName
    ORDER BY sa.createdAt DESC
    LIMIT ${limit};
  `;

  return db.getAllSync<{ 
    id: number | null, 
    productName: string, 
    price: number, 
    lastSold: string 
  }>(query);
};

export const top5SoldToday = (limit: number = 5) => {
  const query = `
    SELECT
      si.stockId AS id,
      si.productName,
      si.price,
      SUM(si.qty) AS itemsSold
    FROM sale_items si
    INNER JOIN sales s ON s.id = si.saleId
    WHERE DATE(s.createdAt) = DATE('now', 'localtime')
    GROUP BY si.productName, si.price, si.stockId
    HAVING itemsSold > 0
    ORDER BY itemsSold DESC
    LIMIT ${limit};
  `;

  return db.getAllSync<{
    id: number | null;
    productName: string;
    price: number;
    itemsSold: number;
  }>(query) ?? [];
};
