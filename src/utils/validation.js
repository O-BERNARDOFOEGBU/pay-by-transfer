const Joi = require("joi");

/**
 * Validation schemas and utilities
 */

const configSchema = Joi.object({
  apiKey: Joi.string().optional(),

  provider: Joi.string()
    .valid("paystack", "flutterwave", "mono", "manual")
    .optional(),

  account: Joi.object({
    number: Joi.string().required(),
    name: Joi.string().required(),
    bank: Joi.string().required(),
    bankCode: Joi.string().optional(),
  }).optional(),

  monitor: Joi.string().valid("mono").optional(),
  monitorApiKey: Joi.string().optional(),

  webhookUrl: Joi.string().uri().optional(),
  webhookSecret: Joi.string().optional(),

  sessionTimeout: Joi.number().min(300000).max(86400000).default(3600000),

  matching: Joi.object({
    strategy: Joi.string()
      .valid("exact-reference", "amount-time-reference", "amount-time-window")
      .default("amount-time-reference"),
    timeWindow: Joi.number().min(60000).default(3600000),
    amountTolerance: Joi.number().min(0).default(0),
  }).optional(),
}).or("provider", "account");

const paymentSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be positive",
    "any.required": "Amount is required",
  }),

  reference: Joi.string()
    .min(3)
    .max(100)
    .required()
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .messages({
      "string.pattern.base":
        "Reference can only contain letters, numbers, hyphens and underscores",
      "any.required": "Reference is required",
    }),

  customerEmail: Joi.string().email().optional().messages({
    "string.email": "Invalid email address",
  }),

  metadata: Joi.object().optional(),
});

function validateConfig(config) {
  return configSchema.validate(config, { abortEarly: false });
}

function validatePayment(options) {
  return paymentSchema.validate(options, { abortEarly: false });
}

function validateWebhookSignature(signature) {
  if (!signature || typeof signature !== "string") {
    return { error: new Error("Invalid webhook signature") };
  }
  return { value: signature };
}

function sanitizeReference(reference) {
  return reference.replace(/[^a-zA-Z0-9_-]/g, "").substring(0, 100);
}

function validatePhoneNumber(phone) {
  const phoneRegex = /^(\+234|234|0)[789][01]\d{8}$/;
  return phoneRegex.test(phone);
}

function validateAccountNumber(accountNumber) {
  const accountRegex = /^\d{10}$/;
  return accountRegex.test(accountNumber);
}

function formatAmount(amount) {
  if (amount < 100 && amount % 1 !== 0) {
    return Math.round(amount * 100);
  }
  return Math.round(amount);
}

module.exports = {
  validate: {
    config: validateConfig,
    payment: validatePayment,
    webhookSignature: validateWebhookSignature,
  },
  sanitizeReference,
  validatePhoneNumber,
  validateAccountNumber,
  formatAmount,
};
