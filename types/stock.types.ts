export interface StockInput {
  productName: string;
  category?: string;
  unit?: string;
  qrCode?: string;
  location?: string;
  buyingPrice: number;
  expiryDate?: string;
  suppliers?: string;
  batchNumber?: string;
  targetMax: number | null;
  status: 'in-stock' | 'out-of-stock' | 'low-stock';
  quantity: number;
  sellingPrice: number;
  totalCost: number;
}

export interface FetchStock extends StockInput {
    id: string;
    lastUpdate: string;
}
