# pay-by-transfer 💸

> Simple, safe, and affordable bank transfer payments for African businesses.

Save **99% on payment fees**. Accept payments with **any bank account**.

[![npm version](https://badge.fury.io/js/pay-by-transfer.svg)](https://www.npmjs.com/package/pay-by-transfer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

```bash
npm install pay-by-transfer
```

```javascript
const PayByTransfer = require("pay-by-transfer");

const payment = new PayByTransfer({
  provider: "manual", // Start FREE!
  account: {
    number: "7060XXXXXX",
    name: "YOUR BUSINESS",
    bank: "Moniepoint",
  },
});

// Create payment
const session = await payment.create({
  amount: 7700, // ₦77 in kobo
  reference: "ORDER_123",
});

// Listen for confirmation
payment.on("payment.confirmed", (data) => {
  console.log("✅ Payment received!", data.reference);
});
```

## 💰 Pricing

| You Pay         | vs Paystack (₦215) | Savings               |
| --------------- | ------------------ | --------------------- |
| **₦0** (Manual) | 100%               | ₦215,000 on 1000 txns |
| **₦7** (Mono)   | 97%                | ₦208,000 on 1000 txns |

## 📖 Documentation

- [Full Documentation](https://pay-by-transfer.com/docs)
- [API Reference](https://pay-by-transfer.com/api)
- [Examples](./examples)

## 🤝 Support

- Email: support@pay-by-transfer.com
- Issues: [GitHub Issues](https://github.com/yourusername/pay-by-transfer/issues)

## 📝 License

MIT © 2025 pay-by-transfer
