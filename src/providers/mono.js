const axios = require("axios");
const { generateHmacSignature } = require("../utils/crypto");
const { getBankCode } = require("../config/banks");
const BaseProvider = require("./base");
const { ProviderError } = require("../utils/errors");

/**
 * Mono Provider
 * Monitors static bank accounts for transactions
 * Alternative to Okra (which shut down in May 2025)
 */
class MonoProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.name = "mono";
    this.apiKey = config.apiKey || config.monitorApiKey;
    this.account = config.account;
    this.baseUrl = "https://api.withmono.com";

    if (!this.apiKey) {
      throw new Error("Mono API key is required");
    }

    if (!this.account) {
      throw new Error("Bank account details are required");
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "mono-sec-key": this.apiKey,
        "Content-Type": "application/json",
      },
    });

    this.processedTransactions = new Set();
  }

  /**
   * Return static account details
   */
  async createSession(options) {
    const { amount, reference } = options;

    return {
      accountNumber: this.account.number,
      accountName: this.account.name,
      bankName: this.account.bank,
      bankCode: this.account.bankCode || getBankCode(this.account.bank),
      reference,
      amount,
    };
  }

  /**
   * Verify payment by checking recent transactions
   */
  async verify(reference) {
    try {
      const transactions = await this.getRecentTransactions();

      const matching = transactions.find((txn) => {
        return this._matchesReference(txn, reference);
      });

      return !!matching;
    } catch (error) {
      console.error("Mono verification error:", error.message);
      return false;
    }
  }

  /**
   * Get recent credit transactions
   */
  async getRecentTransactions(accountId = null, limit = 50) {
    try {
      const endpoint = accountId
        ? `/accounts/${accountId}/transactions`
        : "/transactions";

      const response = await this.client.get(endpoint, {
        params: { limit },
      });

      const transactions = response.data.data || [];
      return transactions.filter((t) => t.type === "credit");
    } catch (error) {
      throw new ProviderError(
        "mono",
        `Failed to fetch transactions: ${error.message}`,
        error
      );
    }
  }

  /**
   * Set up webhook for real-time notifications
   * Note: Mono webhooks are configured in dashboard
   */
  async subscribeToWebhooks(webhookUrl) {
    console.log("Configure webhook in Mono dashboard:", webhookUrl);
    return { success: true, webhookUrl };
  }

  /**
   * Normalize Mono webhook data
   */
  normalizeWebhook(webhookData) {
    const { type, data } = webhookData;

    if (type === "mono.events.account_updated" && data.account) {
      const credits =
        data.account.transactions?.filter((t) => t.type === "credit") || [];

      if (credits.length > 0) {
        const latest = credits[0];
        const txnId = latest._id;

        if (this.processedTransactions.has(txnId)) {
          return null;
        }

        this.processedTransactions.add(txnId);

        return {
          provider: "mono",
          transactionId: txnId,
          amount: Math.abs(latest.amount * 100),
          currency: "NGN",
          narration: latest.narration || "",
          date: latest.date,
          accountNumber: this.account.number,
          raw: latest,
        };
      }
    }

    return null;
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(signature, payload) {
    const hash = generateHmacSignature(payload, this.apiKey, "sha256");
    return hash === signature;
  }

  /**
   * Match transaction to reference
   */
  _matchesReference(transaction, reference) {
    const narration = (transaction.narration || "").toLowerCase();
    return narration.includes(reference.toLowerCase());
  }

  /**
   * Link user's bank account (one-time setup)
   */
  async linkBankAccount(redirectUrl = "http://localhost:3000/callback") {
    try {
      const response = await this.client.post("/account/initiate", {
        redirect_url: redirectUrl,
      });

      return {
        connectUrl: response.data.data.url,
        reference: response.data.data.reference,
      };
    } catch (error) {
      throw new ProviderError(
        "mono",
        `Failed to initiate bank link: ${error.message}`,
        error
      );
    }
  }

  /**
   * Exchange code for account ID
   */
  async exchangeToken(code) {
    try {
      const response = await this.client.post("/account/auth", { code });
      return response.data.data.id;
    } catch (error) {
      throw new ProviderError(
        "mono",
        `Failed to exchange token: ${error.message}`,
        error
      );
    }
  }

  /**
   * Clear old processed transactions
   */
  clearProcessedCache(olderThanHours = 24) {
    if (this.processedTransactions.size > 1000) {
      this.processedTransactions.clear();
    }
  }
}

module.exports = MonoProvider;
