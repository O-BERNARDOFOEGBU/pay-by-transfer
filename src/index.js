// src/index.js
const PayByTransfer = require("./PayByTransfer");
const providers = require("./providers");
const { WebhookHandler } = require("./webhook");
const errors = require("./utils/errors");
const { validate, formatAmount } = require("./utils/validation");

// Main export
module.exports = PayByTransfer;

// Named exports
module.exports.PayByTransfer = PayByTransfer;
module.exports.providers = providers;
module.exports.WebhookHandler = WebhookHandler;
module.exports.errors = errors;
module.exports.utils = { validate, formatAmount };

// Version
module.exports.VERSION = require("../package.json").version;
