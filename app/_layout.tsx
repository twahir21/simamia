import { useEffect } from "react";
import "../global.css";

import { Slot } from "expo-router";
import { initStockDB } from "@/db/stock.sqlite";

export default function RootLayout() {
  // initial configurations like initiating databases 
  useEffect(() => initStockDB(), []);
  // useEffect(() => deleteStockDb(), [])

  return <Slot />;
}
