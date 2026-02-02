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
  minStock: number;
}

export interface FetchStock extends StockInput {
    id: string;
    lastUpdate: string;
}

export type CartStockRow = {
  id: number;
  productName: string;
  sellingPrice: number;
};

export type CartItem = {
  stockId: number;
  name: string;
  price: number;
  qty: number;
  isQuickSale?: boolean;
};


export type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (stockId: number) => void;
  updateQty: (stockId: number, qty: number) => void;
  clearCart: () => void;
};
