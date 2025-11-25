const { WebhookVerificationError } = require("../utils/errors");

/**
 * Webhook Handler
 * Receives and processes webhook notifications from payment providers
 */
class WebhookHandler {
  constructor(config) {
    this.config = config;
    this.url = config.url;
    this.secret = config.secret;
    this.onPayment = config.onPayment;
    this.server = null;
  }

  /**
   * Process incoming webhook
   */
  process(headers, body, provider) {
    const signature = this._extractSignature(headers, provider);

    if (!this.verifySignature(signature, body, provider)) {
      throw new WebhookVerificationError("Invalid webhook signature");
    }

    const paymentData = this._normalizeWebhookData(body, provider);

    if (paymentData && this.onPayment) {
      this.onPayment(paymentData);
    }

    return paymentData;
  }

  /**
   * Verify webhook signature
   */
  verifySignature(signature, payload, provider) {
    if (!this.secret) {
      console.warn("Webhook secret not configured - skipping verification");
      return true;
    }

    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha512", this.secret)
      .update(JSON.stringify(payload))
      .digest("hex");

    return hash === signature;
  }

  /**
   * Extract signature from headers based on provider
   */
  _extractSignature(headers, provider) {
    const headerMap = {
      paystack: "x-paystack-signature",
      flutterwave: "verif-hash",
      mono: "mono-webhook-signature",
    };

    const headerName = headerMap[provider] || "x-webhook-signature";
    return headers[headerName] || headers[headerName.toLowerCase()];
  }

  /**
   * Normalize webhook data from different providers
   */
  _normalizeWebhookData(body, provider) {
    switch (provider) {
      case "paystack":
        return this._normalizePaystack(body);

      case "mono":
        return this._normalizeMono(body);

      default:
        return body;
    }
  }

  /**
   * Normalize Paystack webhook
   */
  _normalizePaystack(body) {
    const { event, data } = body;

    if (event === "charge.success" || event === "transfer.success") {
      return {
        provider: "paystack",
        transactionId: data.id.toString(),
        reference: data.reference,
        amount: data.amount,
        currency: data.currency,
        customerEmail: data.customer?.email,
        paidAt: data.paid_at,
        channel: data.channel,
        metadata: data.metadata,
        raw: data,
      };
    }

    return null;
  }

  /**
   * Normalize Mono webhook
   */
  _normalizeMono(body) {
    const { type, data } = body;

    if (type === "mono.events.account_updated") {
      const credits =
        data.account.transactions?.filter((t) => t.type === "credit") || [];

      if (credits.length > 0) {
        const latest = credits[0];
        return {
          provider: "mono",
          transactionId: latest._id,
          amount: Math.abs(latest.amount * 100),
          currency: "NGN",
          narration: latest.narration,
          paidAt: latest.date,
          raw: latest,
        };
      }
    }

    return null;
  }

  /**
   * Start Express server to receive webhooks (for testing)
   */
  startServer(port = 3000) {
    const express = require("express");
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post("/webhook", (req, res) => {
      try {
        const provider = req.query.provider || "paystack";
        const paymentData = this.process(req.headers, req.body, provider);

        res.status(200).json({
          success: true,
          message: "Webhook processed",
          data: paymentData,
        });
      } catch (error) {
        console.error("Webhook error:", error);
        res.status(400).json({
          success: false,
          error: error.message,
        });
      }
    });

    app.get("/health", (req, res) => {
      res.json({ status: "ok" });
    });

    this.server = app.listen(port, () => {
      console.log(`Webhook server listening on port ${port}`);
      console.log(`Webhook URL: http://localhost:${port}/webhook`);
    });

    return this.server;
  }

  /**
   * Stop webhook server
   */
  stopServer() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}

module.exports = { WebhookHandler };
