/**
 * Custom error classes for pay-by-transfer
 */

class PayByTransferError extends Error {
  constructor(message, code = "UNKNOWN_ERROR", details = {}) {
    super(message);
    this.name = "PayByTransferError";
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ConfigurationError extends PayByTransferError {
  constructor(message, details = {}) {
    super(message, "CONFIGURATION_ERROR", details);
    this.name = "ConfigurationError";
  }
}

class ValidationError extends PayByTransferError {
  constructor(message, details = {}) {
    super(message, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

class PaymentNotFoundError extends PayByTransferError {
  constructor(reference) {
    super(
      `Payment with reference ${reference} not found`,
      "PAYMENT_NOT_FOUND",
      { reference }
    );
    this.name = "PaymentNotFoundError";
  }
}

class PaymentExpiredError extends PayByTransferError {
  constructor(reference) {
    super(
      `Payment with reference ${reference} has expired`,
      "PAYMENT_EXPIRED",
      { reference }
    );
    this.name = "PaymentExpiredError";
  }
}

class DuplicatePaymentError extends PayByTransferError {
  constructor(reference) {
    super(
      `Payment with reference ${reference} already exists`,
      "DUPLICATE_PAYMENT",
      { reference }
    );
    this.name = "DuplicatePaymentError";
  }
}

class ProviderError extends PayByTransferError {
  constructor(provider, message, originalError = null) {
    super(`Provider error (${provider}): ${message}`, "PROVIDER_ERROR", {
      provider,
      originalError: originalError?.message,
    });
    this.name = "ProviderError";
  }
}

class WebhookVerificationError extends PayByTransferError {
  constructor(message) {
    super(message, "WEBHOOK_VERIFICATION_FAILED");
    this.name = "WebhookVerificationError";
  }
}

class MatchingError extends PayByTransferError {
  constructor(message, details = {}) {
    super(message, "MATCHING_ERROR", details);
    this.name = "MatchingError";
  }
}

module.exports = {
  PayByTransferError,
  ConfigurationError,
  ValidationError,
  PaymentNotFoundError,
  PaymentExpiredError,
  DuplicatePaymentError,
  ProviderError,
  WebhookVerificationError,
  MatchingError,
};
