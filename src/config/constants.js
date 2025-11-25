// src/config/constants.js
module.exports = {
  DEFAULT_SESSION_TIMEOUT: 3600000, // 1 hour
  DEFAULT_TIME_WINDOW: 3600000, // 1 hour for matching
  DEFAULT_AMOUNT_TOLERANCE: 0, // Exact match
  DEFAULT_MATCHING_STRATEGY: "amount-time-reference",

  PAYMENT_STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    EXPIRED: "expired",
    REJECTED: "rejected",
  },

  PROVIDER_NAMES: {
    PAYSTACK: "paystack",
    FLUTTERWAVE: "flutterwave",
    MONO: "mono",
    MANUAL: "manual",
  },

  EVENTS: {
    SESSION_CREATED: "session.created",
    PAYMENT_CONFIRMED: "payment.confirmed",
    PAYMENT_EXPIRED: "payment.expired",
    PAYMENT_UNMATCHED: "payment.unmatched",
    ERROR: "error",
  },
};
