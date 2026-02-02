
This is a **critical question** — payment + activation is where many African SaaS/POS apps fail.
Below is a **battle-tested flow** that works even with **unstable internet, USSD payments, and offline apps**.

I’ll give you **the right way**, then simpler fallbacks.

---

# ✅ BEST PRACTICE FLOW (RECOMMENDED)

This is how serious POS & utility apps do it.

---

## 1. Core principle (very important)

> **Payment ≠ Activation**

Payment is **external** (TigoPesa).
Activation is **internal** (your system).

Never auto-activate only because a user pressed *“I have paid”*.

---

## 2. High-level activation flow

```text
User selects package
↓
User pays via mobile money
↓
User submits payment reference (or triggers confirmation)
↓
System verifies payment
↓
Account expiry date is updated
↓
User is activated
```

---

## 3. Data model (minimal but correct)

### `subscriptions`

```ts
subscriptions {
  id
  user_id
  expiry_date
  status        // active | expired | suspended
}
```

### `payments`

```ts
payments {
  id
  user_id
  package_id
  amount
  method            // tigopesa
  reference         // txn id / receipt number
  status            // pending | confirmed | rejected
  created_at
}
```

👉 **Expiry date lives ONLY in subscriptions**

---

## 4. Activation logic (the correct formula)

### If user is NEW

```ts
expiry = today + package.days
```

### If user is ACTIVE

```ts
expiry = current_expiry + package.days
```

### If user is EXPIRED

```ts
expiry = today + package.days
```

🚫 Never overwrite expiry blindly.

---

## 5. Payment confirmation methods (ranked)

---

## 🥇 Option A: Automatic confirmation (BEST)

If you later integrate **TigoPesa API / Lipa callback**:

```text
Payment made
→ Tigo sends callback to your server
→ Server confirms amount & reference
→ Mark payment = confirmed
→ Extend expiry
```

✔ Fully automatic
✔ No fraud
✔ Scales well

> This is how Vodacom, Tigo, TRA do it.

---

## 🥈 Option B: Semi-automatic (REALISTIC NOW)

Most startups do this.

### Flow

```text
User pays
→ clicks "I have paid"
→ enters reference number
→ payment = pending
→ admin dashboard lists pending payments
→ admin confirms
→ expiry extended
```

### Why this works

* Mobile money always gives a **reference**
* Admin confirmation is fast
* Fraud risk is low

✔ Works offline
✔ Cheap
✔ Trusted

---

## 🥉 Option C: Time-limited trust (fallback)

Used when you don’t want admin work.

### Flow

```text
User clicks "I have paid"
→ temporary access (e.g. 6–12 hours)
→ system waits for verification
→ auto-expire if not confirmed
```

⚠ Risky
⚠ Must be time-boxed

---

## 6. What “I have paid” should REALLY do

❌ Wrong:

```text
Activate account immediately
```

✅ Correct:

```ts
createPayment({
  user_id,
  package_id,
  amount,
  status: 'pending'
})
```

Then show:

> “Payment received. Activation pending confirmation.”

---

## 7. Expiry update pseudocode (important)

```ts
function applySubscription(user, packageDays) {
  const now = today()

  if (!user.expiry || user.expiry < now) {
    return now + packageDays
  }

  return user.expiry + packageDays
}
```

This avoids:

* Losing remaining days
* Overwriting active subscriptions

---

## 8. UI status states (simple & clear)

### Subscription badge

* 🟢 Active — *expires in 18 days*
* 🟡 Pending payment confirmation
* 🔴 Expired — renew to continue

### Payment badge

* Pending
* Confirmed
* Rejected

---

## 9. Anti-fraud basics (cheap but effective)

* Amount must match package price
* Reference must be unique
* Same reference cannot be reused
* Log device/user ID

---

## 10. Real-world example (Tanzania context)

**User buys 6 months (72,000 TZS)**
Pays via TigoPesa
Receives SMS:

> *Kiasi: 72,000
> Kumbukumbu: TP8392KQ*

User enters `TP8392KQ`

Admin confirms → system does:

```text
Old expiry: 2026-03-10
New expiry: 2026-09-06
```

✔ No days lost
✔ Clean audit trail

---

## 11. Final recommendation (what YOU should implement)

**Phase 1 (NOW)**

* Manual confirmation (Option B)
* Pending payments
* Expiry extension logic

**Phase 2**

* Admin dashboard
* Analytics

**Phase 3**

* Mobile money callbacks

---

If you want next, I can:

* Design **SQLite schema + sync**
* Build **admin confirmation UI**
* Add **subscription guards** (lock features)
* Write **expiry middleware** for Expo Router

Just tell me.
