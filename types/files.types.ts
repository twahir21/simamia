export interface StockPdf {
  id: number;
  productName: string;
  batchNumber: string;
  buyingPrice: number;
  sellingPrice: number;
  quantity: number;
  minStock: number;
  status: string;
  lastUpdate: string;
  location: string;
}