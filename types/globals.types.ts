export type AppError = {
  type: "LOAD" | "SAVE" | "SYNC";
  message: string;
  retry?: () => void;
};


export type ActionItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
};


export type ActionContext<T> = {
  module: "sales" | "stock" | "customers" | "orders";
  data: T[];
};

export type PaymentMethod = 'cash' | 'digital' | 'debt' | 'mixed';
export type SaleStatus = 'paid' | 'partial' | 'upaid';

export interface SaleItem {
  id: number;
  saleId: number;
  stockId: number | null;
  productName: string;
  qty: number;
  price: number;
  isQuickSale: number;
}

export interface SaleRecord {
  id: number;
  saleNumber: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  paymentType: PaymentMethod;
  status: SaleStatus;
  customerName: string | null;
  createdAt: string; // DATETIME from SQLite comes back as a string
}

export interface AllSalesRecords extends SaleRecord {
  items: SaleItem []
}  
