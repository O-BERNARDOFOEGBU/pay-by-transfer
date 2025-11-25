/**
 * Nigerian Bank Codes
 * Source: Central Bank of Nigeria (CBN)
 */

const BANK_CODES = {
  "access bank": "044",
  "access bank (diamond)": "063",
  citibank: "023",
  ecobank: "050",
  "fidelity bank": "070",
  "first bank": "011",
  "first city monument bank": "214",
  fcmb: "214",
  gtbank: "058",
  "guaranty trust bank": "058",
  "heritage bank": "030",
  "keystone bank": "082",
  "polaris bank": "076",
  "providus bank": "101",
  "stanbic ibtc": "221",
  "standard chartered": "068",
  "sterling bank": "232",
  "suntrust bank": "100",
  "union bank": "032",
  uba: "033",
  "united bank for africa": "033",
  "unity bank": "215",
  "wema bank": "035",
  "zenith bank": "057",

  // Digital banks
  kuda: "50211",
  rubies: "50218",
  sparkle: "090325",
  vfd: "50153",

  // Fintech / Mobile money
  moniepoint: "50515",
  opay: "999992",
  palmpay: "999991",
  paga: "327",
  carbon: "565",
  gtworld: "758",
};

/**
 * Get bank code from bank name
 */
function getBankCode(bankName) {
  const normalizedName = bankName.toLowerCase().trim();
  return BANK_CODES[normalizedName] || "999";
}

/**
 * Get bank name from code
 */
function getBankName(code) {
  const entry = Object.entries(BANK_CODES).find(
    ([, bankCode]) => bankCode === code
  );
  return entry ? entry[0] : "Unknown Bank";
}

/**
 * Validate bank code
 */
function isValidBankCode(code) {
  return Object.values(BANK_CODES).includes(code);
}

/**
 * Get all banks
 */
function getAllBanks() {
  return Object.entries(BANK_CODES).map(([name, code]) => ({
    name,
    code,
  }));
}

module.exports = {
  BANK_CODES,
  getBankCode,
  getBankName,
  isValidBankCode,
  getAllBanks,
};
