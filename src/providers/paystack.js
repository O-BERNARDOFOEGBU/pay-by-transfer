const axios = require("axios");
const { generateHmacSignature } = require("../utils/crypto");
const BaseProvider = require("./base");
const { ProviderError } = require("../utils/errors");

/**
 * Paystack Provider
 * Uses Paystack's Dedicated Virtual Accounts for payments
 */
class PaystackProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.name = "paystack";
    this.apiKey = config.apiKey;
    this.baseUrl = "https://api.paystack.co";

    if (!this.apiKey) {
      throw new Error("Paystack API key is required");
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Create a dedicated virtual account
   */
  async createSession(options) {
    const { amount, reference, customerEmail, metadata = {} } = options;

    try {
      // For Paystack, we create a customer first, then a dedicated account
      const customerResponse = await this.client.post("/customer", {
        email: customerEmail || `customer_${reference}@temp.com`,
        first_name: metadata.firstName || "Customer",
        last_name: metadata.lastName || reference.substring(0, 10),
      });

      const customer = customerResponse.data.data;

      // Create dedicated virtual account
      const accountResponse = await this.client.post("/dedicated_account", {
        customer: customer.customer_code,
        preferred_bank: this.config.preferredBank || "wema-bank",
      });

      const accountData = accountResponse.data.data;

      return {
        accountNumber: accountData.account_number,
        accountName: accountData.account_name,
        bankName: accountData.bank.name,
        bankCode: accountData.bank.code,
        reference: customer.customer_code,
        metadata: {
          customerId: customer.id,
          accountId: accountData.id,
          originalReference: reference,
        },
      };
    } catch (error) {
      throw new ProviderError(
        "paystack",
        error.response?.data?.message || error.message,
        error
      );
    }
  }

  /**
   * Verify a transaction
   */
  async verify(reference) {
    try {
      const response = await this.client.get(
        `/transaction/verify/${reference}`
      );
      const { data } = response.data;

      return data.status === "success";
    } catch (error) {
      return false;
    }
  }

  /**
   * Normalize Paystack webhook data
   */
  normalizeWebhook(webhookData) {
    const { event, data } = webhookData;

    if (
      event === "charge.success" ||
      event === "dedicated_account.assign.success"
    ) {
      return {
        provider: "paystack",
        transactionId: data.id?.toString(),
        reference: data.reference || data.customer?.customer_code,
        amount: data.amount,
        currency: data.currency || "NGN",
        customerEmail: data.customer?.email,
        paidAt: data.paid_at || data.created_at,
        channel: data.channel,
        metadata: data.metadata,
        raw: data,
      };
    }

    return null;
  }

  /**
   * Verify Paystack webhook signature
   */
  verifyWebhookSignature(signature, payload) {
    const hash = generateHmacSignature(payload, this.apiKey, "sha512");
    return hash === signature;
  }

  /**
   * Get transaction details
   */
  async getTransaction(reference) {
    try {
      const response = await this.client.get(
        `/transaction/verify/${reference}`
      );
      return response.data.data;
    } catch (error) {
      throw new ProviderError(
        "paystack",
        `Failed to get transaction: ${error.message}`,
        error
      );
    }
  }

  /**
   * List all transactions
   */
  async listTransactions(options = {}) {
    try {
      const { perPage = 50, page = 1, from, to } = options;

      const response = await this.client.get("/transaction", {
        params: { perPage, page, from, to },
      });

      return response.data.data;
    } catch (error) {
      throw new ProviderError(
        "paystack",
        `Failed to list transactions: ${error.message}`,
        error
      );
    }
  }
}

module.exports = PaystackProvider;
