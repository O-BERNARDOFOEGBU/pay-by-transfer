const EventEmitter = require("eventemitter3");
const providers = require("./providers");
const { WebhookHandler } = require("./webhook");
const { PaymentMatcher } = require("./matching");
const { validate } = require("./utils/validation");
const {
  PayByTransferError,
  DuplicatePaymentError,
  PaymentNotFoundError,
} = require("./utils/errors");
const { EVENTS, PAYMENT_STATUS } = require("./config/constants");

/**
 * PayByTransfer - Main Class
 * Simple, safe, and affordable bank transfer payments
 */
class PayByTransfer extends EventEmitter {
  constructor(config) {
    super();

    // Validate configuration
    const validation = validate.config(config);
    if (validation.error) {
      throw new PayByTransferError(validation.error.message);
    }

    this.config = validation.value;
    this.provider = null;
    this.webhookHandler = null;
    this.matcher = new PaymentMatcher(config.matching || {});
    this.sessions = new Map();

    // Initialize provider
    this._initializeProvider();

    // Initialize webhook handler if configured
    if (config.webhookUrl) {
      this.webhookHandler = new WebhookHandler({
        url: config.webhookUrl,
        secret: config.webhookSecret,
        onPayment: this._handleWebhookPayment.bind(this),
      });
    }
  }

  /**
   * Initialize payment provider
   */
  _initializeProvider() {
    const { provider: providerType, account, apiKey } = this.config;

    if (providerType) {
      // Dynamic provider (Paystack, Mono, etc.)
      const Provider = providers[providerType];
      if (!Provider) {
        throw new PayByTransferError(`Unknown provider: ${providerType}`);
      }
      this.provider = new Provider({ apiKey, ...this.config });
    } else if (account) {
      // Static account with manual confirmation
      const Provider = providers.manual;
      this.provider = new Provider({ account, ...this.config });
    } else {
      throw new PayByTransferError(
        "Either provider or account must be specified"
      );
    }
  }

  /**
   * Create a new payment session
   */
  async create(options) {
    try {
      // Validate input
      const validation = validate.payment(options);
      if (validation.error) {
        throw new PayByTransferError(validation.error.message);
      }

      const {
        amount,
        reference,
        customerEmail,
        metadata = {},
      } = validation.value;

      // Check if reference already exists
      if (this.sessions.has(reference)) {
        throw new DuplicatePaymentError(reference);
      }

      // Create session with provider
      const session = await this.provider.createSession({
        amount,
        reference,
        customerEmail,
        metadata,
      });

      // Store session
      const sessionData = {
        ...session,
        amount,
        reference,
        customerEmail,
        metadata,
        status: PAYMENT_STATUS.PENDING,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(
          Date.now() + this.config.sessionTimeout
        ).toISOString(),
      };

      this.sessions.set(reference, sessionData);

      // Emit event
      this.emit(EVENTS.SESSION_CREATED, sessionData);

      return {
        reference: sessionData.reference,
        accountNumber: sessionData.accountNumber,
        accountName: sessionData.accountName,
        bankName: sessionData.bankName,
        bankCode: sessionData.bankCode,
        amount: sessionData.amount,
        expiresAt: sessionData.expiresAt,
      };
    } catch (error) {
      this.emit(EVENTS.ERROR, error);
      throw error;
    }
  }

  /**
   * Check payment status
   */
  async check(reference) {
    try {
      const session = this.sessions.get(reference);

      if (!session) {
        throw new PaymentNotFoundError(reference);
      }

      // Check if expired
      if (
        new Date() > new Date(session.expiresAt) &&
        session.status === PAYMENT_STATUS.PENDING
      ) {
        session.status = PAYMENT_STATUS.EXPIRED;
        this.sessions.set(reference, session);
        this.emit(EVENTS.PAYMENT_EXPIRED, session);
      }

      return {
        reference: session.reference,
        status: session.status,
        amount: session.amount,
        paidAt: session.paidAt || null,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
      };
    } catch (error) {
      this.emit(EVENTS.ERROR, error);
      throw error;
    }
  }

  /**
   * Verify payment manually
   */
  async verify(reference) {
    try {
      const session = this.sessions.get(reference);

      if (!session) {
        throw new PaymentNotFoundError(reference);
      }

      if (session.status === PAYMENT_STATUS.CONFIRMED) {
        return { verified: true, session };
      }

      // Query provider for verification
      const verified = await this.provider.verify(reference);

      if (verified) {
        session.status = PAYMENT_STATUS.CONFIRMED;
        session.paidAt = new Date().toISOString();
        this.sessions.set(reference, session);
        this.emit(EVENTS.PAYMENT_CONFIRMED, session);
      }

      return { verified, session };
    } catch (error) {
      this.emit(EVENTS.ERROR, error);
      throw error;
    }
  }

  /**
   * Handle webhook payment notification
   */
  _handleWebhookPayment(paymentData) {
    try {
      // Try to match payment to a session
      const matchedSession = this.matcher.match(
        paymentData,
        Array.from(this.sessions.values())
      );

      if (matchedSession) {
        matchedSession.status = PAYMENT_STATUS.CONFIRMED;
        matchedSession.paidAt = new Date().toISOString();
        matchedSession.transactionId = paymentData.transactionId;

        this.sessions.set(matchedSession.reference, matchedSession);
        this.emit(EVENTS.PAYMENT_CONFIRMED, matchedSession);
      } else {
        // Unmatched payment
        this.emit(EVENTS.PAYMENT_UNMATCHED, paymentData);
      }
    } catch (error) {
      this.emit(EVENTS.ERROR, error);
    }
  }

  /**
   * Get all sessions
   */
  getAllSessions() {
    return Array.from(this.sessions.values());
  }

  /**
   * Get pending sessions
   */
  getPendingSessions() {
    return Array.from(this.sessions.values()).filter(
      (s) => s.status === PAYMENT_STATUS.PENDING
    );
  }

  /**
   * Clear expired sessions
   */
  clearExpiredSessions() {
    const now = new Date();
    for (const [reference, session] of this.sessions.entries()) {
      if (
        new Date(session.expiresAt) < now &&
        session.status === PAYMENT_STATUS.PENDING
      ) {
        session.status = PAYMENT_STATUS.EXPIRED;
        this.sessions.set(reference, session);
        this.emit(EVENTS.PAYMENT_EXPIRED, session);
      }
    }
  }

  /**
   * Start webhook server (for testing/development)
   */
  startWebhookServer(port = 3000) {
    if (!this.webhookHandler) {
      throw new PayByTransferError("Webhook URL not configured");
    }
    return this.webhookHandler.startServer(port);
  }

  /**
   * Stop webhook server
   */
  stopWebhookServer() {
    if (this.webhookHandler) {
      this.webhookHandler.stopServer();
    }
  }
}

module.exports = PayByTransfer;
