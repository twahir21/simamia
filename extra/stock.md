# STOCK MANAGEMENT
1. product name (and must be unique)
2. category and unit (optional)
3. qrcode (optional)
4. location/shop e.g. warehouse A, warehouse B. (autofill main store as default)
5. Add expiry date (optional)
6. supplier name(s) (optional)
7. Optional batch number (to know this product)
8. target max number of products (optional)
9. status (in stock | low stock | out of stock) -> critical
10. quantity -> critical 
11. price -> critical 

## filter
1. filter by price, name or quantity
2. filter by category 
3. products with quantity range (min-max)
4. status (in-stock, low stock, out of stock)

# search
1. by product code (Bar-code), product name and category

# scrollable small report
1. total items
2. total low stocks
3. total out of stocks


# card
1. name
2. status (in-stock, low-stock, out-of-stock)
3. quantity
4. price
5. last update (less important)
6. edit and delete buttons.

-> i need three buttons to edit stock, add to order (for creating order list ), delete the stock
there is show more and show less in which hides and unhides extra informations
(on hiding -> show stock name, status, code, quanity and last update)
on expanding  show batch number target, expire date and list of suppliers (ul)


## important
if someone provide max target give a progress bar for easy spotting product volume so that user can easily spot what product is having low stocks.

when buying new stock, compare buying and selling price of new goods and update to the business.

suppliers may differ so track with batch number

Solve the ordering system with Linear programming so as to minimize costs, including the storage costs, and to maximize the profit 
- You will do automated re-odering with constraints as profit of a product, expire date (if available), current cash flow
- dynamic pricing based on stock level, demand to clear slow moving inventory

Also, we have economic order quanity
EOQ = sqrt((2 x D x S)/H) where D - units sold in a time (e.g. year)
S is order cost and H is holding cost (e.g. rent)

This EOQ is the cheapest amount to order at once