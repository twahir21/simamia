import { useEffect } from "react";
import "@/global.css";

import { Slot } from "expo-router";
import { initStockDB } from "@/db/stock.sqlite";
import { initSaleItemsDB, initSalesDB } from "@/db/sales.sqlite";
import { initDebtsDB } from "@/db/debts.sqlite";
import AppLock from "./(tabs)/home/components/ui/AppLock";

export default function RootLayout() {
  // initial configurations like initiating databases 
  useEffect(() => {
    initStockDB()
    initSalesDB()
    initSaleItemsDB()
    initDebtsDB()
  }, []);
  // useEffect(() => deleteStockDb(), [])

  return (
    <AppLock>
      <Slot />
    </AppLock>
  );
}
