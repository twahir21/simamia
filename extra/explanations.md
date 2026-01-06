# SIMAMIA APP

1. Home page itakuwa na vitu vitatu straight foward three analytics:
- How much have I sold today?
- low stock products
- total debit money
- cash sales
- mobile money sales

(in top bar there is name logo and time)

and big three buttons (Sale, stock and Debts). that's all no noise, no charts
this screen opens atleast 50+ times a day.

2. Chini yake kutakuwa na tabs (4 parts)

[a]. Swipe left ita switch bottom tabs

3. Tab 1: Orders
hii ita deal na orders kwa watu walio mbali (waliopiga simu) na jambo la delivery.

4. Tab 2: Pages
Hii ita deal na visual buttons design user friendly other pages kama products/items e.t.c see picture
named chat-home.png if pages are long scroll down

5. Tab 3: Reports
hii ita deal na ripoti za aina zote

6. Tab 4: Settings
Mambo yote dynamic ni huku , ku lock app etc. 

7. Sales page (after sales click in home)
 have add to cart. All methods use quantity default as 1, price auto-filled
 and have 4 main tabs (customizable) default to scan 
 others are smart search (search with auto-suggestion name)
 then payment type: cash, mobile payment or debt autosave sales after any of type completes
 autofocus next input, thumb-friend. (no modal unless is must)

 customer is must in debt only. use Guest or provide transaction_id (for the whole cart)
 design in such a way that service selling is acceptable (e.g. repair, saloon, etc.)
 sales takes < 3 taps.

8. Stock page
 show name, remaining quantity, selling price, low stock indicator (red)
 action buttons (edit, delete with confirm, add)
 sort by low stock first, name, fast moving items (later)



9. Debts page
 


## Tech stack
expo and sqlite for offline first and fast sales used for local DB structure. No sync,
No auth, no cloud.

## Licencing (charging)
- If you skip this, people will share APK

1. Attach device_id at first launch so as to able to lock the app. Give 1 week free trial.

To lock the app: 
- lock new sale, new stock, new debt buttons only
- people can view old records, settings, anything but not adding new data.
- Show payment instructions which has a close option
- After payment, device should be online and server should generate unlock token for x days
- you can use JWT tokens which contain valid until .... 
- store last server timestamp (to avoid clock cheating)

# Keys to consider all the times
1. App never crashes
2. App opens < 2s
3. App saves time daily (for manual work, e.g. manual sales, stock etc )

## long color palette
Use:

Background: Off-white / light gray
#F7F7F7

Primary action (Sale button): Deep green
#0F766E (trust + money)

Danger / Low stock: Muted red
#DC2626

Text: Dark charcoal
#111827