import { ActionContext } from "@/types/globals.types";
import { Alert } from "react-native";
import * as Print from 'expo-print';
import { generateCustomerHTML, generateOrderHTML, generateSalesHTML, generateStockHTML } from "./html";
import { StockPdf } from "@/types/files.types";
import { exportStockToCSV } from "./csv";

  export type ModuleType = "sales" | "stock" | "customers" | "orders";
  export type FilterOption = { label: string; value: string; color?: string; icon?: string };
  export type SortOption = {
    label: string;
    value: string;
  };


  // Create the map
  const htmlGenerators: Record<ModuleType, (data: StockPdf | any) => string> = {
    stock: generateStockHTML,
    sales: generateSalesHTML,
    customers: generateCustomerHTML,
    orders: generateOrderHTML,
  };

  export const MODULE_FILTERS: Record<ModuleType, { title: string; sections: { title: string; key: string; options: FilterOption[] }[] }> = {
    orders: {
      title: "Filter Orders",
      sections: [
        {
          title: "Delivery Status",
          key: "delivery",
          options: [
            { label: "All Orders", value: "all" },
            { label: "Not Taken ⏳", value: "pending" },
            { label: "On the Way 🚚", value: "onway" },
            { label: "Completed ✅", value: "completed" },
          ]
        },
        {
          title: "Payment Status",
          key: "payment",
          options: [
            { label: "💳 Unpaid", value: "unpaid", color: "bg-red-500" }
          ]
        }
      ]
    },
    stock: {
      title: "Inventory Filter",
      sections: [
        {
          title: "Availability",
          key: "status",
          options: [
            { label: "All Items", value: "all" },
            { label: "Low Stock ⚠️", value: "low" },
            { label: "Out of Stock 🚫", value: "out" },
            { label: "Expired 🍄", value: "expired" },
          ]
        }
      ]
    },
    sales: {
      title: "Sales History",
      sections: [
        {
          title: "Method",
          key: "paymentType",
          options: [
            { label: "Cash 💵", value: "cash" },
            { label: "Digital 📱", value: "digital" },
            { label: "Debt 📝", value: "debt" },
          ]
        }
      ]
    },
    customers: {
      title: "Customer List",
      sections: [
        {
          title: "Balance",
          key: "debt",
          options: [
            { label: "All", value: "all" },
            { label: "Has Debt 🚩", value: "hasDebt" },
          ]
        }
      ]
    }
  };

  export const MODULE_SORTS: Record<
    ModuleType,
    { title: string; options: SortOption[] }
  > = {
    stock: {
      title: "Sort Inventory",
      options: [
        { label: "Name A-Z", value: "name_asc" },
        { label: "Name Z-A", value: "name_desc" },
        { label: "Quantity Low → High", value: "qty_asc" },
        { label: "Quantity High → Low", value: "qty_desc" },
        { label: "Price Low → High", value: "price_asc" },
        { label: "Price High → Low", value: "price_desc" },
        { label: "Newest", value: "newest" },
        { label: "Oldest", value: "oldest" },
      ],
    },

    sales: {
      title: "Sort Sales",
      options: [
        { label: "Newest First", value: "date_desc" },
        { label: "Oldest First", value: "date_asc" },
        { label: "Amount High → Low", value: "amount_desc" },
      ],
    },

    customers: {
      title: "Sort Customers",
      options: [
        { label: "Name A-Z", value: "name_asc" },
        { label: "Debt High → Low", value: "debt_desc" },
      ],
    },

    orders: {
      title: "Sort Orders",
      options: [
        { label: "Newest", value: "date_desc" },
        { label: "Delivery Priority", value: "priority" },
      ],
    },
  };


  export const useListActions = <T,>(context: ActionContext<T>) => {

    const openFilter = () => {
      console.log(`Open filter for ${context.module}`);
      // setFilterModal({ module: context.module })
    };

    const handleExport = async () => {
      const fileName = `stock-report-${new Date().toISOString().split('T')[0]}.csv`;
      
      try {
        exportStockToCSV(context.data as StockPdf[], fileName);
        console.log("Export successful");
      } catch (error) {
        console.error("Export failed", error);
      }
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
