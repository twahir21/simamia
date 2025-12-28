📘 Simamia App Documentation

🎯 Purpose

Simamia is a business management app tailored for Tanzanian shops, especially in high-traffic areas like Kariakoo. It helps shop owners manage daily sales, stock levels, debts, and customer records — all from a mobile device.

😣 Problem Statement (Pain Points)

Kariakoo businesses face:

Manual record-keeping (paper notebooks, verbal tracking)

Lost sales data and poor stock visibility

Difficulty tracking customer debts

No real-time insights into profit or low-stock alerts

Expensive or unreliable POS systems

✅ Solution

Simamia solves these by offering:

Offline-first mobile app with fast sale entry

Simple dashboard showing daily sales, profit, debts, and stock alerts

Debt tracking tied to customer profiles

Barcode scanning and autocomplete for fast item lookup

Local payment integration (M-Pesa, TigoPesa)

Affordable daily, weekly, or monthly packages

📱 App Pages & Layouts

1️⃣ Home / Today Screen

Header: Simamia logo + app name

Metrics:

Today's Sales Total

Today's Profit

Outstanding Debts

Stock Alerts (low items)

Actions:

➕ New Sale

📦 Stock

👥 Debts

2️⃣ New Sale Screen

Tabs: Grid | Quick Sale | Scan | Search

Scan Tab (Active):

Barcode scanner button

Cart section with item name, quantity, price

Optional customer selector

Payment buttons:

Cash Sale

Debt Sale

Mobile Money

Final "Sell" button

3️⃣ Stock Management

List of items with:

Name

Quantity

Reorder alert

Add/Edit/Delete buttons

4️⃣ Debts Page

Customer list with:

Name

Total owed

Last payment date

View/Add payment button

5️⃣ Customers Page

Add new customer

View customer history

Link sales to customer profile

6️⃣ Payment Page (Subscription)

Header: Simamia logo + "Unlock Premium"

Package Options:

Daily (e.g. TZS 500)

Weekly (e.g. TZS 2,500)

Monthly (e.g. TZS 8,000)

Payment Methods:

M-Pesa

TigoPesa

Airtel Money

Instructions:

Enter phone number

Choose package

Tap "Pay Now"

After Payment:

App unlocks offline features for selected duration

Payment verified via local SDK or SMS confirmation

🔐 Offline Unlock Strategy

After successful mobile money payment:

App stores unlock token locally (SQLite)

Token includes expiry timestamp

No internet needed until renewal

Optional SMS fallback for verification

🧠 Tech Stack Recommendation

Frontend: Expo + SQLite (offline-first)

Backend (optional): Node.js + Supabase/PostgreSQL for sync

Payments: Integrate local mobile money SDKs or use USSD/SMS triggers

🚀 Future Features

Multi-shop support

Expense tracking

SMS reminders for debts

Cloud sync for backup

Simamia is designed to be fast, local, and practical — built for Tanzanian business realities.