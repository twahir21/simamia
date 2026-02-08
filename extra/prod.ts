const generateStockBatch = (supplierName?: string): string => {
  // 1. Get first 15 letters of supplier (uppercase)
  const sup = (supplierName || "HAIJULIKANI").substring(0, 15).toUpperCase().replace(/\s+/g, "") ; // removes spaces.
  
  // 2. Get Date in DDMMYY format
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const dateStr = `${day}${month}${year}`;

  // 3. Return the code
  return `${sup}-${dateStr}`;
};


const generateOrderBatch = (supplierName?: string): string => {
  // 1. Get first 15 letters of supplier (uppercase)
  const sup = (supplierName || "HAIJULIKANI").substring(0, 15).toUpperCase().replace(/\s+/g, "") ; // removes spaces.
  
  // 2. Get Date in DDMMYY format
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const dateStr = `${day}${month}${year}`;

  // 3. Generate random number 
  const timeStr = `${now.getHours()}${now.getMinutes()}${now.getMilliseconds()}`;

  // 3. Return the code
  return `${sup}-${dateStr}-${timeStr}`;
};





console.log(generateStockBatch("TWAHI R"));
console.log(generateOrderBatch("azam"))
