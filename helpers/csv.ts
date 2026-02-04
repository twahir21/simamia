import { StockPdf } from '@/types/files.types';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const exportStockToCSV = async (data: StockPdf[], filename: string) => {
  try {
    // 1. Generate CSV Content
    const headers = ["ID", "Product Name", "Batch Number", "Buying Price", "Selling Price", "Quantity", "Status"];
    const rows = data.map(item => [
      item.id,
      `"${item.productName}"`, // Quotes handle names with commas
      item.batchNumber,
      item.buyingPrice,
      item.sellingPrice,
      item.quantity,
      item.status
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    // 2. Create the File instance using Paths.cache
    // This ensures we save to the correct temporary directory
    const file = new File(Paths.cache, filename);

    // 3. Write the content
    // We use await to ensure the file exists before sharing
    file.write(csvContent);

    // 4. Open the Native Share Sheet
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Stock Data',
        UTI: 'public.comma-separated-values-text', // Critical for iOS CSV recognition
      });
    } else {
      console.error("Sharing is not available on this platform");
    }
  } catch (error) {
    console.error("Error saving CSV:", error);
    throw error;
  }
};
