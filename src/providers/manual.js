const BaseProvider = require("./base");
const { getBankCode } = require("../config/banks");

/**
 * Manual Confirmation Provider
 * FREE - no third-party dependencies
 * Perfect for starting out or low-volume businesses
 */
class ManualProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.name = "manual";
    this.account = config.account;
    this.pendingPayments = new Map();
    this.confirmedPayments = new Map();

    if (!this.account) {
      throw new Error("Bank account details are required for manual provider");
    }
  }

  /**
   * Create payment session (returns static account details)
   */
  async createSession(options) {
    const { amount, reference, customerEmail, metadata = {} } = options;

    // Store in pending
    const session = {
      amount,
      reference,
      customerEmail,
      metadata,
      accountNumber: this.account.number,
      accountName: this.account.name,
      bankName: this.account.bank,
      bankCode: this.account.bankCode || getBankCode(this.account.bank),
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    this.pendingPayments.set(reference, session);

    return session;
  }

  /**
   * Manually confirm a payment
   * Called by business owner after checking bank alert
   */
  async confirmPayment(reference, transactionDetails = {}) {
    const payment = this.pendingPayments.get(reference);

    if (!payment) {
      throw new Error(`Payment ${reference} not found`);
    }

    payment.status = "confirmed";
    payment.confirmedAt = new Date().toISOString();
    payment.transactionId =
      transactionDetails.transactionId || `MAN_${Date.now()}`;
    payment.confirmedBy = transactionDetails.confirmedBy || "manual";
    payment.notes = transactionDetails.notes || "";

    this.confirmedPayments.set(reference, payment);
    this.pendingPayments.delete(reference);

    return payment;
  }

  /**
   * Reject/cancel a payment
   */
  async rejectPayment(reference, reason = "") {
    const payment = this.pendingPayments.get(reference);

    if (!payment) {
      throw new Error(`Payment ${reference} not found`);
    }

    payment.status = "rejected";
    payment.rejectedAt = new Date().toISOString();
    payment.rejectionReason = reason;

    this.pendingPayments.delete(reference);

    return payment;
  }

  /**
   * Verify payment status
   */
  async verify(reference) {
    return this.confirmedPayments.has(reference);
  }

  /**
   * Get all pending payments (for admin dashboard)
   */
  getPendingPayments() {
    return Array.from(this.pendingPayments.values());
  }

  /**
   * Get all confirmed payments
   */
  getConfirmedPayments() {
    return Array.from(this.confirmedPayments.values());
  }

  /**
   * Get payment by reference
   */
  getPayment(reference) {
    return (
      this.pendingPayments.get(reference) ||
      this.confirmedPayments.get(reference)
    );
  }

  /**
   * Bulk confirm payments (e.g., from CSV upload)
   */
  async bulkConfirm(references, transactionDetails = {}) {
    const results = [];

    for (const ref of references) {
      try {
        const payment = await this.confirmPayment(ref, transactionDetails);
        results.push({ reference: ref, success: true, payment });
      } catch (error) {
        results.push({ reference: ref, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Get statistics
   */
  getStats() {
    const pending = this.pendingPayments.size;
    const confirmed = this.confirmedPayments.size;
    const total = pending + confirmed;

    const pendingAmount = Array.from(this.pendingPayments.values()).reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const confirmedAmount = Array.from(this.confirmedPayments.values()).reduce(
      (sum, p) => sum + p.amount,
      0
    );

    return {
      pending,
      confirmed,
      total,
      pendingAmount,
      confirmedAmount,
      totalAmount: pendingAmount + confirmedAmount,
    };
  }

  /**
   * Not used for manual provider
   */
  normalizeWebhook(webhookData) {
    return null;
  }

  verifyWebhookSignature(signature, payload) {
    return false;
  }
}

module.exports = ManualProvider;
