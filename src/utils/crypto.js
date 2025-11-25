const crypto = require("crypto");

/**
 * Cryptographic utilities for pay-by-transfer
 */

/**
 * Generate HMAC signature
 */
function generateHmacSignature(payload, secret, algorithm = "sha512") {
  const payloadString =
    typeof payload === "string" ? payload : JSON.stringify(payload);

  return crypto
    .createHmac(algorithm, secret)
    .update(payloadString)
    .digest("hex");
}

/**
 * Verify HMAC signature
 */
function verifyHmacSignature(payload, signature, secret, algorithm = "sha512") {
  const expectedSignature = generateHmacSignature(payload, secret, algorithm);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Generate random string
 */
function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Hash data with SHA256
 */
function sha256Hash(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Encrypt sensitive data
 */
function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key.padEnd(32, "0").substring(0, 32)),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt sensitive data
 */
function decrypt(encryptedData, key) {
  const parts = encryptedData.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key.padEnd(32, "0").substring(0, 32)),
    iv
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = {
  generateHmacSignature,
  verifyHmacSignature,
  generateRandomString,
  sha256Hash,
  encrypt,
  decrypt,
};
