interface StockPdf {
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

interface OrderPdf {
    code: string;
    date: string;
    delivery: 'onway' | 'not-taken' | 'completed';
    id: string;
    payment: 'pending' | 'paid' | 'cancelled';
    phone: string;
    time: string;
}

export function generateStockHTML(contextData: StockPdf[]): string {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatCurrency = (amount: number) => {
    return `TSh ${amount.toLocaleString('en-US')}`;
  };

  let totalValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  const tableRows = contextData
    .map((product) => {
      const isOutOfStock = product.quantity === 0;
      const isLowStock = !isOutOfStock && product.quantity <= product.minStock;
      
      if (isOutOfStock) outOfStockCount++;
      if (isLowStock) lowStockCount++;
      
      const itemValue = product.quantity * product.buyingPrice;
      totalValue += itemValue;

      return `
      <tr class="${isOutOfStock ? 'bg-red' : isLowStock ? 'bg-amber' : ''}">
        <td style="width: 5%">${product.id}</td>
        <td style="width: 20%; font-weight: 600;">${product.productName}</td>
        <td style="width: 25%; color: #666; font-family: monospace;">${product.batchNumber}</td>
        <td class="text-right">${product.quantity}</td>
        <td class="text-right" style="color: #888;">${product.minStock}</td>
        <td class="text-right">${formatCurrency(product.buyingPrice)}</td>
        <td class="text-right" style="font-weight: 600;">${formatCurrency(product.sellingPrice)}</td>
      </tr>`;
    })
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
        body { font-family: 'Inter', system-ui, sans-serif; color: #1a1a1a; margin: 0; padding: 20px; font-size: 11pt; }
        
        /* Header Design */
        .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header-title h1 { margin: 0; font-size: 22pt; text-transform: uppercase; letter-spacing: -1px; }
        .header-meta { text-align: right; font-size: 9pt; color: #444; }

        /* Stats Grid */
        .stats-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 30px; }
        .stat-card { border: 1px solid #727274; padding: 12px; border-radius: 4px; }
        .stat-label { font-size: 8pt; text-transform: uppercase; color: #6b7280; font-weight: 700; }
        .stat-value { font-size: 14pt; font-weight: 800; margin-top: 4px; }

        /* Table Design */
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #f3f4f6; text-transform: uppercase; font-size: 8pt; font-weight: 700; padding: 10px; border-bottom: 2px solid #727274; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #dad8d8; font-size: 9pt; }
        .text-right { text-align: right; }
        
        /* Highlighting for Print */
        .bg-red { background-color: #fef2f2 !important; }
        .bg-amber { background-color: #fffbeb !important; }
        
        .footer { margin-top: 50px; padding-top: 10px; font-size: 8pt; color: #7f8185; text-align: center; }

        @media print {
            body { padding: 60px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-title">
            <h1>Stock Report</h1>
            <div style="color: #075985; font-weight: 700;">Simamia Shop</div>
        </div>
        <div class="header-meta">
            <div>Generated: ${currentDate}</div>
            <div>Reference: INV-${Date.now().toString().slice(-6)}</div>
        </div>
    </div>

    <div class="stats-container">
        <div class="stat-card">
            <div class="stat-label">Total Items</div>
            <div class="stat-value">${contextData.length}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Inventory Value</div>
            <div class="stat-value" style="color: #059669;">${formatCurrency(totalValue)}</div>
        </div>
        <div class="stat-card" style="${lowStockCount > 0 ? 'border-left: 4px solid #f59e0b' : ''}">
            <div class="stat-label">Low Stock</div>
            <div class="stat-value">${lowStockCount}</div>
        </div>
        <div class="stat-card" style="${outOfStockCount > 0 ? 'border-left: 4px solid #ef4444' : ''}">
            <div class="stat-label">Out of Stock</div>
            <div class="stat-value">${outOfStockCount}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Batch / SKU</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Min</th>
                <th class="text-right">Buying</th>
                <th class="text-right">Selling</th>
            </tr>
        </thead>
        <tbody>
            ${tableRows}
        </tbody>
    </table>

    <div class="footer">
        <p>End of Report • This document is an official record of stock levels as of ${currentDate}.</p>
    </div>
</body>
</html>`;
}


const commonStyles = `
    body { font-family: sans-serif; padding: 20px; color: #111; }
    .header { border-bottom: 2px solid #111; margin-bottom: 20px; padding-bottom: 10px; }
    .header h1 { margin: 0; font-size: 18pt; text-transform: uppercase; }
    .stats-container { display: flex; gap: 15px; margin-bottom: 20px; }
    .stat-card { border: 1px solid #ddd; padding: 10px; flex: 1; border-radius: 4px; }
    .stat-label { font-size: 8pt; color: #666; text-transform: uppercase; }
    .stat-value { font-size: 14pt; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; background: #f4f4f4; padding: 8px; font-size: 9pt; border-bottom: 1px solid #111; }
    td { padding: 8px; border-bottom: 1px solid #eee; font-size: 10pt; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
`;

export function generateSalesHTML(data: any[]): string {
    const totalRevenue = data.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    
    const rows = data.map(sale => `
        <tr>
            <td>${sale.invoiceNo || sale.id}</td>
            <td>${sale.customerName || 'Walk-in'}</td>
            <td>${sale.paymentMethod}</td>
            <td class="text-right">TSh ${sale.totalAmount.toLocaleString()}</td>
        </tr>
    `).join('');

    return `
    <html>
      <head><style>${commonStyles}</style></head>
      <body>
        <div class="header"><h1>Sales Summary Report</h1></div>
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-label">Total Revenue</div>
                <div class="stat-value" style="color: #059669">TSh ${totalRevenue.toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Transactions</div>
                <div class="stat-value">${data.length}</div>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Payment</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
      </body>
    </html>`;
}

export const generateOrderHTML = (orders: OrderPdf[]) => {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Analytics Calculations
  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.payment === 'paid').length;
  const pendingDelivery = orders.filter(o => o.delivery === 'onway').length;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
        body { font-family: 'Inter', system-ui, sans-serif; color: #1a1a1a; margin: 0; padding: 20px; font-size: 11pt; }
        
        /* Header Design */
        .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
        .header-title h1 { margin: 0; font-size: 22pt; text-transform: uppercase; letter-spacing: -1px; }
        .header-meta { text-align: right; font-size: 9pt; color: #444; }

        /* Analytics Cards */
        .analytics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .card { padding: 15px; border: 1px solid #727274; border-radius: 8px; background-color: #f9fafb; }
        .card-label { font-size: 8pt; text-transform: uppercase; color: #6b7280; font-weight: 600; }
        .card-value { font-size: 16pt; font-weight: 700; color: #075985; }

        /* Table Design */
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #f3f4f6; text-align: left; padding: 12px 8px; font-size: 9pt; text-transform: uppercase; border-bottom: 2px solid #e5e7eb; }
        td { padding: 10px 8px; border-bottom: 1px solid #dad8d8; font-size: 10pt; }
        
        /* Status Badges */
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 8pt; font-weight: 600; text-transform: uppercase; }
        .bg-pending { background: #fef3c7; color: #92400e; }
        .bg-paid { background: #dcfce7; color: #166534; }
        .bg-onway { background: #dbeafe; color: #1e40af; }

        @media print {
          body { padding: 60px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
          <div class="header-title">
              <h1>Order Report</h1>
              <div style="color: #075985; font-weight: 700;">Simamia Shop</div>
          </div>
          <div class="header-meta">
              <div>Generated: ${currentDate}</div>
              <div>Reference: ORD-${Date.now().toString().slice(-6)}</div>
          </div>
      </div>

      <div class="analytics-grid">
          <div class="card">
              <div class="card-label">Total Orders</div>
              <div class="card-value">${totalOrders}</div>
          </div>
          <div class="card" style="border-left: 4px solid #166534;">
              <div class="card-label">Payments Cleared</div>
              <div class="card-value">${paidOrders}</div>
          </div>
          <div class="card" style="border-left: 4px solid #92400e;">
              <div class="card-label">Pending Delivery</div>
              <div class="card-value">${pendingDelivery}</div>
          </div>
      </div>

      <table>
          <thead>
              <tr>
                  <th>Order Code</th>
                  <th>Date & Time</th>
                  <th>Phone Number</th>
                  <th>Payment</th>
                  <th>Delivery</th>
              </tr>
          </thead>
          <tbody>
              ${orders.map(order => `
                  <tr>
                      <td style="font-weight: 600;">#${order.code}</td>
                      <td>${order.date} <span style="color: #6b7280; font-size: 9pt;">${order.time}</span></td>
                      <td>${order.phone}</td>
                      <td>
                        <span class="badge ${order.payment === 'paid' ? 'bg-paid' : 'bg-pending'}">
                          ${order.payment}
                        </span>
                      </td>
                      <td>
                        <span class="badge ${order.delivery === 'onway' ? 'bg-onway' : 'bg-pending'}">
                          ${order.delivery}
                        </span>
                      </td>
                  </tr>
              `).join('')}
          </tbody>
      </table>

      <div style="margin-top: 40px; font-size: 8pt; color: #9ca3af; text-align: center;">
          End of Report - Simamia Shop Management System
      </div>
    </body>
    </html>
  `;
};

export function generateCustomerHTML(data: any[]): string {
    const rows = data.map(customer => `
        <tr>
            <td style="font-weight: 600">${customer.name}</td>
            <td>${customer.phone || 'N/A'}</td>
            <td>${customer.email || 'N/A'}</td>
            <td class="text-right">${customer.totalOrders || 0}</td>
            <td class="text-right" style="color: ${customer.balance > 0 ? '#dc2626' : '#111'}">
                TSh ${customer.balance?.toLocaleString() || 0}
            </td>
        </tr>
    `).join('');

    return `
    <html>
      <head><style>${commonStyles}</style></head>
      <body>
        <div class="header"><h1>Customer Directory & Balances</h1></div>
        <table>
            <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th class="text-right">Orders</th>
                    <th class="text-right">Balance Due</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
      </body>
    </html>`;
}

