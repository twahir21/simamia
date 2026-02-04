import { ActionContext } from "@/types/globals.types";
import { Alert } from "react-native";
import * as Print from 'expo-print';
import { generateCustomerHTML, generateOrderHTML, generateSalesHTML, generateStockHTML } from "./html";
import { StockPdf } from "@/types/files.types";
import { exportStockToCSV } from "./csv";

type ModuleType = "sales" | "stock" | "customers" | "orders";

export const useListActions = <T,>(context: ActionContext<T>) => {

const handleExport = async () => {
  const fileName = `stock-report-${new Date().toISOString().split('T')[0]}.csv`;
  
  try {
    exportStockToCSV(context.data as StockPdf[], fileName);
    console.log("Export successful");
  } catch (error) {
    console.error("Export failed", error);
  }
};

  // Define a type for the available modules

  // Create the map
  const htmlGenerators: Record<ModuleType, (data: StockPdf | any) => string> = {
    stock: generateStockHTML,
    sales: generateSalesHTML,
    customers: generateCustomerHTML,
    orders: generateOrderHTML,
  };

  const handlePrint = async () => {
    const moduleName = context.module as ModuleType;
    
    try {
      console.log("Module: ", moduleName);

      // 1. Check if a generator exists for this module
      const generator = htmlGenerators[moduleName];
      
      if (!generator) {
        throw new Error(`No HTML generator found for module: ${moduleName}`);
      }

      // 2. Generate the specific HTML
      const htmlContent = generator(context.data);

      // 3. Create the PDF file
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // 4. Send to the printer
      await Print.printAsync({ uri });

      console.log(`${moduleName} Print successful`);
    } catch (error) {
      console.error(`Error printing ${moduleName}:`, error);
      Alert.alert('Print Error', `Could not generate the ${moduleName} report.`);
    }
  };

  const openFilter = () => {
    console.log(`Open filter for ${context.module}`);
    // setFilterModal({ module: context.module })
  };

  const openSort = () => {
    console.log(`Open sort for ${context.module}`);
    // setSortModal({ module: context.module })
  };

  return {
    handleExport,
    handlePrint,
    openFilter,
    openSort,
  };
};
