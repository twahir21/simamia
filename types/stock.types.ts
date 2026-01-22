export interface StockInput {
  productName: string;
  category?: string;
  unit?: string;
  qrCode?: string;
  location?: string;
  expiryDate?: string;
  suppliers?: string;
  batchNumber?: string;
  targetMax: number | null;
  status: 'in-stock' | 'out-of-stock' | 'low-stock';
  quantity: number;
  price: number;
}

export interface FetchStock extends StockInput {
    id: string;
    lastUpdate: string;
}

 //[{"batchNumber": null, "category": null, "expiryDate": null, "id": 1, "lastUpdate": "2026-01-21 10:04:24", "location": "Main Store", "price": 500, "productName": "twahir", "qrCode": null, "quantity": 2, "status": "in-stock", "suppliers": null, "targetMax": null, "unit": null}]
//    {
//     id: '1',
//     status: 'in-stock',
//     quantity: 450,
//   },