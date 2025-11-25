// src/providers/index.js
const BaseProvider = require("./base");
const ManualProvider = require("./manual");
const PaystackProvider = require("./paystack");
const MonoProvider = require("./mono");

module.exports = {
  BaseProvider,
  manual: ManualProvider,
  paystack: PaystackProvider,
  mono: MonoProvider,
};
