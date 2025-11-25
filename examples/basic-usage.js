/**
 * Basic Usage Example - Manual Confirmation
 * Start FREE with zero dependencies
 */

const PayByTransfer = require("../src/index");

// Initialize with manual provider (FREE!)
const payment = new PayByTransfer({
  provider: "manual",
  account: {
    number: "7060859311",
    name: "OPARANTHO VENTURES",
    bank: "Moniepoint",
  },
});

// Listen for successful payments
payment.on("payment.confirmed", (data) => {
  console.log("🎉 Payment confirmed!");
  console.log("Reference:", data.reference);
  console.log("Amount:", data.amount / 100, "NGN");
  console.log("Paid at:", data.paidAt);

  // Update your database here
  // updateOrderStatus(data.reference, 'paid');
});

// Listen for errors
payment.on("error", (error) => {
  console.error("❌ Error:", error.message);
});

// Create a payment session
async function createPayment() {
  try {
    const session = await payment.create({
      amount: 7700, // Amount in kobo (₦77)
      reference: "ORDER_12345",
      customerEmail: "customer@example.com",
    });

    console.log("✅ Payment session created:");
    console.log("Account Number:", session.accountNumber);
    console.log("Account Name:", session.accountName);
    console.log("Bank:", session.bankName);
    console.log("Amount:", session.amount / 100, "NGN");
    console.log("Reference:", session.reference);
    console.log("Expires:", session.expiresAt);
    console.log("\n📱 Customer should transfer money to the account above\n");

    return session;
  } catch (error) {
    console.error("Failed to create payment:", error.message);
  }
}

// Check payment status manually
async function checkPaymentStatus(reference) {
  try {
    const status = await payment.check(reference);
    console.log("Payment status:", status);
    return status;
  } catch (error) {
    console.error("Failed to check status:", error.message);
  }
}

// Manually confirm payment (after checking bank alert)
async function confirmPayment(reference) {
  try {
    await payment.provider.confirmPayment(reference, {
      transactionId: "BANK_TXN_123",
      confirmedBy: "admin",
    });
    console.log("✅ Payment manually confirmed");
  } catch (error) {
    console.error("Failed to confirm:", error.message);
  }
}

// Example usage
async function main() {
  // 1. Create payment
  const session = await createPayment();

  // 2. Customer transfers money...
  console.log("Waiting for customer to transfer...");
  console.log(
    "After they transfer, you check your bank alert and confirm manually\n"
  );

  // 3. Manually confirm (you do this after checking bank alert)
  setTimeout(async () => {
    console.log("Simulating manual confirmation...");
    await confirmPayment("ORDER_12345");
  }, 2000);

  // 4. Check status
  setTimeout(async () => {
    await checkPaymentStatus("ORDER_12345");
  }, 3000);
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { createPayment, checkPaymentStatus, confirmPayment };
