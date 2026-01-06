Good. Text wireframes force discipline. I’ll keep this **MSP-level**, not fantasy UI.

Below are **STRICT, TEXT-BASED WIREFRAMES** exactly how screens should feel on a small Android phone used all day.

---

# 1️⃣ HOME SCREEN — “TODAY CONTROL”

**Rule:** Zero scrolling if possible.

```
┌─────────────────────────────────┐
│ SIMAMIA                         │
│ Today: Tue 12 Jan               │
├─────────────────────────────────┤

│  TODAY SALES                    │
│  TZS 1,245,000                  │
│                                 │
│  Cash: 980,000   Debt: 265,000  │

├─────────────────────────────────┤

│ ⚠ LOW STOCK ITEMS: 3            │

├─────────────────────────────────┤

│ [ + NEW SALE ]                  │
│                                 │
│ [ + ADD STOCK ]                 │
│                                 │
│ [ 📒 DEBTS ]                    │

└─────────────────────────────────┘
```

### Supervisor notes:

* **Big money number** → psychological anchor
* Buttons must be **full-width**
* This screen is opened **50+ times/day**
* No charts. No tabs. No noise.

---

# 2️⃣ SALES SCREEN — “FAST ENTRY”

**Rule:** One hand, one thumb, <5 seconds.

```
┌─────────────────────────────────┐
│ ← NEW SALE                      │
├─────────────────────────────────┤

│ Item                            │
│ [ Search or select item ]       │

│ Qty                             │
│ [  1  ]   (+)   (−)             │

│ Price (TZS)                     │
│ [  12,000 ]                     │

│ Payment Type                    │
│ (●) Cash    ( ) Debt            │

│ Customer (only if Debt)         │
│ [ Optional name ]               │

├─────────────────────────────────┤

│        [ SAVE SALE ]            │
│                                 │
│ Total: TZS 12,000               │

└─────────────────────────────────┘
```

### Supervisor notes:

* Default **Qty = 1**
* Price auto-fills from product
* Debt customer field **hidden unless selected**
* SAVE button always visible (sticky)

❌ No receipts
❌ No discounts v1
❌ No tax fields

---

# 3️⃣ STOCK SCREEN — “INVENTORY AT A GLANCE”

**Rule:** See problems instantly.

```
┌─────────────────────────────────┐
│ ← STOCK                         │
├─────────────────────────────────┤

│ [ + ADD ITEM ]                  │

├─────────────────────────────────┤
│ ⚠ Sugar 1kg        2 left       │
│ Price: 3,000                    │
│ [ Edit ]                        │
├─────────────────────────────────┤
│ Rice 25kg         12 left       │
│ Price: 55,000                  │
│ [ Edit ]                        │
├─────────────────────────────────┤
│ Soap              40 left       │
│ Price: 1,500                   │
│ [ Edit ]                        │
└─────────────────────────────────┘
```

### Supervisor notes:

* Low stock always floats to top
* No images (slow, useless)
* Edit = change price or add quantity

---

# 4️⃣ ADD / EDIT STOCK (SUB-SCREEN)

Keep it dead simple.

```
┌─────────────────────────────────┐
│ ← ADD STOCK                     │
├─────────────────────────────────┤

│ Item Name                       │
│ [ Sugar 1kg ]                   │

│ Quantity                        │
│ [  10  ]                        │

│ Selling Price (TZS)             │
│ [  3,000 ]                      │

│ Low Stock Alert At              │
│ [  5 ]                          │

├─────────────────────────────────┤

│       [ SAVE ITEM ]             │

└─────────────────────────────────┘
```

---

# NAVIGATION (IMPORTANT)

**Bottom tabs are a mistake here.**

Use:

* Home → buttons navigate
* Back arrow everywhere
* Always return to Home after sale

Reason: shop owners don’t think in “tabs”.

---

# UX RULES YOU MUST OBEY

If you break these, the app fails:

1. App opens → Home in **<2 seconds**
2. New Sale always reachable in **1 tap**
3. No popups during sale
4. Works fully offline
5. No forced login

---

# FINAL SUPERVISOR CHECK

You’re on the **right path**.

But I’ll warn you:

* If you add reports too early → delay launch
* If you add user accounts → friction
* If you add cloud sync → bugs

**Ship this. Sell it. Then improve.**

Next useful steps (pick one):

* SQLite schema (exact tables + indexes)
* Expo screen component breakdown
* License & payment UX flow wireframe

Choose wisely.
