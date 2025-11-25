/**
 * Base Provider Interface
 * All payment providers must extend this class
 */
class BaseProvider {
  constructor(config) {
    this.config = config;
    this.name = "base";
  }

  /**
   * Create a payment session
   * @param {Object} options - Session options
   * @returns {Promise<Object>} Session details with account info
   */
  async createSession(options) {
    throw new Error("createSession must be implemented by provider");
  }

  /**
   * Verify a payment
   * @param {string} reference - Payment reference
   * @returns {Promise<boolean>} Whether payment is verified
   */
  async verify(reference) {
    throw new Error("verify must be implemented by provider");
  }

  /**
   * Handle webhook data from provider
   * @param {Object} webhookData - Raw webhook data
   * @returns {Object} Normalized payment data
   */
  normalizeWebhook(webhookData) {
    throw new Error("normalizeWebhook must be implemented by provider");
  }

  /**
   * Verify webhook signature
   * @param {string} signature - Webhook signature
   * @param {Object} payload - Webhook payload
   * @returns {boolean} Whether signature is valid
   */
  verifyWebhookSignature(signature, payload) {
    throw new Error("verifyWebhookSignature must be implemented by provider");
  }
}

module.exports = BaseProvider;
