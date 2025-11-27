# 💸 pay-by-transfer

> **Accept bank transfers in Africa with any business account. Simple, safe, and 99% cheaper than Paystack.**

[![npm version](https://badge.fury.io/js/pay-by-transfer.svg)](https://www.npmjs.com/package/pay-by-transfer)
![npm downloads](https://img.shields.io/npm/dw/pay-by-transfer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/o-bernardofoegbu/pay-by-transfer.svg)](https://github.com/o-bernardofoegbu/pay-by-transfer/stargazers)

---

## 🚀 Why pay-by-transfer?

Bank transfers are **fast, reliable, and low-cost**, yet businesses face **high fees and manual confirmation**. `pay-by-transfer` solves this by:

* **Working with any bank account** — no need for virtual accounts.
* **Automating confirmations** via [Mono](https://mono.co/) or manual mode.
* **Saving up to 99% on transaction fees** compared to traditional gateways.
* **Being developer-friendly** — simple API, secure, and extensible.

---

## ✨ Features

* ✅ Accept payments with **any bank account**.
* ✅ Automatic confirmation with Mono webhooks.
* ✅ Manual mode for FREE testing.
* ✅ Supports multiple providers (Paystack, Flutterwave, Moniepoint, Mono).
* ✅ Secure — encrypted API keys, verified webhooks.
* ✅ Open-source and contribution-ready.

---

## 🏁 Quick Start

```bash
npm install pay-by-transfer
```

```javascript
const PayByTransfer = require("pay-by-transfer");

// Initialize with Mono for automatic confirmation
const payment = new PayByTransfer({
  provider: "mono",
  account: {
    number: "7060XXXXXX",
    name: "YOUR BUSINESS",
    bank: "GTBank",
    monitor: "mono",
    monoToken: process.env.MONO_TOKEN,
  },
});

// Create a payment session
const session = await payment.create({
  amount: 7700,
  reference: "ORDER_123",
});

// Listen for confirmation
payment.on("payment.confirmed", (data) => {
  console.log("✅ Payment confirmed!", data.reference);
});
```

---

## 💰 Pricing

| You Pay         | vs Paystack (₦215) | Savings               |
| --------------- | ------------------ | --------------------- |
| **₦0** (Manual) | 100%               | ₦215,000 on 1000 txns |
| **₦7** (Mono)   | 97%                | ₦208,000 on 1000 txns |

> Small businesses can start free and scale as they grow.

---

## 📚 Documentation

* [Full Docs](https://pay-by-transfer.com/docs)
* [API Reference](https://pay-by-transfer.com/api)
* [Examples](./examples)

---

## 🤝 Contributing

We ❤️ contributions! Here’s how you can help:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

---

## 📝 License

MIT © 2025 [pay-by-transfer](https://github.com/o-bernardofoegbu/pay-by-transfer)

---

## 🌟 Star this project if it helped you!

> `pay-by-transfer` is open-source and free to use. Every star helps us grow and reach more developers and businesses across Africa.

---

## 🤝 Support

- Email: support@pay-by-transfer.com
- Issues: [GitHub Issues](https://github.com/o-bernardofoegbu/pay-by-transfer/issues)


