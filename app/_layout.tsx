import { useEffect } from "react";
import "@/global.css";

import { Slot } from "expo-router";
import { initStockDB } from "@/db/stock.sqlite";
import { initSaleItemsDB, initSalesDB } from "@/db/sales.sqlite";
import { initDebtsDB } from "@/db/debts.sqlite";
import AppLock from "./(tabs)/home/components/ui/AppLock";
import { getSetting, initSettingsDb } from "@/db/settings.sqlite";
import { initExpensesDb, initExpensesItemsDB } from "@/db/expenses.sqlite";
import { initOrderCounter } from "@/db/orders.sqlite";
import { LanguageProvider } from "@/configs/languages/provider";

export default function RootLayout() {
  // initial configurations like initiating databases 
  useEffect(() => {
    initStockDB()
    initSalesDB()
    initSaleItemsDB()
    initDebtsDB() 
    initSettingsDb()
    initExpensesDb()
    initExpensesItemsDB()
    initOrderCounter()
  }, []);
  // useEffect(() => deleteStockDb(), [])

  const isLockEnabled = getSetting("app_lock") === "true";

  if (!isLockEnabled) return (
      <LanguageProvider>
        <Slot />
      </LanguageProvider>
  );

  return (
    <LanguageProvider>
      <AppLock>
        <Slot />
      </AppLock>
    </LanguageProvider>
  );
}
