export function applySort<T>(
  data: T[],
  rule?: string
): T[] {
  if (!rule) return data;

  const sorted = [...data];

  switch (rule) {

    case "name_asc":
      return sorted.sort((a:any,b:any)=>
        a.productName.localeCompare(b.productName)
      );

    case "name_desc":
      return sorted.sort((a:any,b:any)=>
        b.productName.localeCompare(a.productName)
      );

    case "qty_desc":
      return sorted.sort((a:any,b:any)=>
        b.quantity - a.quantity
      );

    case "price_desc":
      return sorted.sort((a:any,b:any)=>
        b.sellingPrice - a.sellingPrice
      );

    case "date_desc":
      return sorted.sort((a:any,b:any)=>
        new Date(b.date).getTime()
        - new Date(a.date).getTime()
      );

    default:
      return sorted;
  }
}
