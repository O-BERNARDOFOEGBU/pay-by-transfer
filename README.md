# pay-by-transfer 💸  
**The fastest, cheapest, and most reliable bank transfer payment API for Nigeria and Africa.**  
Accept instant bank transfers from *any Nigerian bank* with near-zero fees.  
Perfect for **fintechs, ecommerce platforms, mobile apps, agencies, and developers** who need a simple bank transfer payment solution.

[![npm version](https://badge.fury.io/js/pay-by-transfer.svg)](https://www.npmjs.com/package/pay-by-transfer)
![npm downloads](https://img.shields.io/npm/dw/pay-by-transfer.svg)
![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## 🔍 What is pay-by-transfer?
`pay-by-transfer` is a lightweight Node.js library for accepting **bank transfer payments** in Nigeria using:
- Virtual account numbers  
- Direct bank transfers  
- Manual confirmation  
- Provider integrations (Moniepoint, Paystack, Opay, Flutterwave — coming)

It is built for **high accuracy, reliability, and virtually zero transaction fees**, making it a powerful alternative to traditional payment gateways in Africa.

---

## ✨ Key Features (SEO-Rich)
- ⚡ **Instant bank transfer confirmation API**
- 💳 **Virtual account generation for payments (Nigeria)**
- 🔒 **Secure payment verification**
- 💸 **Save 99% on payment fees vs Paystack or Flutterwave**
- 🌍 **Works with all Nigerian banks (GTBank, Access, Zenith, Opay, Kuda, etc.)**
- 🧩 **Supports Moniepoint, Paystack, and more (coming)**
- 🛠 **Easy integration with Node.js, Express.js, NestJS, Next.js**
- 🔗 **Webhook support for production apps**
- 📦 **Zero dependencies — tiny bundle size**
- 🆓 **Completely free manual provider**

The entire library is built for **fintech-grade performance**.

---

## 🚀 Install
```bash
npm install pay-by-transfer
```

---

## 💻 Quick Example: Accept Bank Transfer Payment
```javascript
const PayByTransfer = require("pay-by-transfer");

const payment = new PayByTransfer({
  provider: "manual", // FREE starter
  account: {
    number: "7060XXXXXX",
    name: "MY BUSINESS",
    bank: "Moniepoint",
  },
});

// Create a payment session (virtual account optional)
const session = await payment.create({
  amount: 7700, // ₦77 in kobo
  reference: "ORDER_123",
});

// Receive confirmation in real-time
payment.on("payment.confirmed", (data) => {
  console.log("✅ Payment received:", data.reference);
});
```

---

## 🧩 Supported Payment Providers
| Provider | Type | Fees | Status |
|---------|------|------|--------|
| Manual (built-in) | Direct transfers | **₦0** | ✓ Available |
| Moniepoint | Virtual Accounts | ₦7 | ✓ Available |
| Paystack Bank Transfer | Virtual Accounts | ₦10–₦25 | Coming Soon |
| Flutterwave VA | Virtual Accounts | ₦15–₦30 | Coming Soon |
| Opay / PalmPay | Wallet Transfers | ₦0–₦10 | Coming Soon |

This makes `pay-by-transfer` perfect for:
- Marketplace apps  
- Lending apps  
- Utility billing apps  
- Agency banking  
- Ecommerce checkout flows  
- Subscription billing  
- POS backend systems  

---

## 💰 Pricing & Cost Comparison
| Provider | Cost/Txn | Savings vs Paystack (₦215) |
|----------|----------|-----------------------------|
| **Manual** | **₦0** | Save ₦215,000 per 1,000 txns |
| **Moniepoint VA** | ₦7 | Save ₦208,000 per 1,000 txns |

This is the **cheapest payment processing method in Nigeria**.

---

## 📘 Full Documentation
- Website → https://pay-by-transfer.com  
- Docs → https://pay-by-transfer.com/docs  
- API Reference → https://pay-by-transfer.com/api  
- Examples → [`/examples`](./examples)

---

## 🛠 Roadmap (SEO Included)
- [ ] Virtual account API for more Nigerian banks  
- [ ] Flutterwave / Paystack / Opay integrations  
- [ ] Full KudiTrace-powered monitoring  
- [ ] Retry logic + automated reconciliation  
- [ ] Web dashboard for transactions  
- [ ] Inline widget for checkout  
- [ ] Python & Go SDK versions  
- [ ] SMS/Email alerts for incoming transfers  

---

## 🤝 Contributing
Contributions are welcome!  
If you want to improve African payment infrastructure, join us:

- Open an issue  
- Submit a PR  
- Suggest providers  
- Add integrations  

---

## ⭐ Support the Project
If `pay-by-transfer` saved you money, time, or stress, please give the repository a **⭐ star**.  
It helps developers discover the project and supports the mission of affordable African payments.

---

## 📝 License
MIT © 2025 O. Bernard Ofoegbu — pay-by-transfer
