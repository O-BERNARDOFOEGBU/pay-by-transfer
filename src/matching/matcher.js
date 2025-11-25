/**
 * Smart Payment Matcher
 * Matches incoming payments to pending sessions
 */
class PaymentMatcher {
  constructor(config = {}) {
    this.config = {
      timeWindow: config.timeWindow || 3600000, // 1 hour
      amountTolerance: config.amountTolerance || 0,
      strategy: config.strategy || "amount-time-reference",
      ...config,
    };
  }

  /**
   * Match a payment to a session
   */
  match(payment, sessions) {
    const pendingSessions = sessions.filter((s) => s.status === "pending");

    if (pendingSessions.length === 0) {
      return null;
    }

    let matched = null;

    switch (this.config.strategy) {
      case "exact-reference":
        matched = this._matchByExactReference(payment, pendingSessions);
        break;

      case "amount-time-reference":
        matched = this._matchByAmountTimeReference(payment, pendingSessions);
        break;

      case "amount-time-window":
        matched = this._matchByAmountTimeWindow(payment, pendingSessions);
        break;

      default:
        matched = this._matchByAmountTimeReference(payment, pendingSessions);
    }

    return matched;
  }

  /**
   * Match by exact reference in payment narration
   */
  _matchByExactReference(payment, sessions) {
    const narration = (payment.narration || "").toLowerCase();

    return sessions.find((session) => {
      return narration.includes(session.reference.toLowerCase());
    });
  }

  /**
   * Match by amount + time window + reference
   */
  _matchByAmountTimeReference(payment, sessions) {
    const paymentAmount = payment.amount;
    const paymentTime = new Date(payment.date || payment.paidAt || Date.now());

    // First try exact reference match
    let matches = sessions.filter((session) => {
      const narration = (payment.narration || "").toLowerCase();
      return narration.includes(session.reference.toLowerCase());
    });

    if (matches.length === 1) {
      return matches[0];
    }

    // Filter by amount and time
    matches = sessions.filter((session) => {
      const amountMatch = this._isAmountMatch(paymentAmount, session.amount);
      const timeMatch = this._isWithinTimeWindow(
        paymentTime,
        new Date(session.createdAt)
      );

      return amountMatch && timeMatch;
    });

    if (matches.length > 0) {
      return matches.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];
    }

    return null;
  }

  /**
   * Match by amount within time window
   */
  _matchByAmountTimeWindow(payment, sessions) {
    const paymentAmount = payment.amount;
    const paymentTime = new Date(payment.date || payment.paidAt || Date.now());

    const matches = sessions.filter((session) => {
      const amountMatch = this._isAmountMatch(paymentAmount, session.amount);
      const timeMatch = this._isWithinTimeWindow(
        paymentTime,
        new Date(session.createdAt)
      );

      return amountMatch && timeMatch;
    });

    if (matches.length === 1) {
      return matches[0];
    }

    return null;
  }

  /**
   * Check if payment amount matches session amount
   */
  _isAmountMatch(paymentAmount, sessionAmount) {
    const tolerance = this.config.amountTolerance;
    const diff = Math.abs(paymentAmount - sessionAmount);

    return diff <= tolerance;
  }

  /**
   * Check if payment is within acceptable time window
   */
  _isWithinTimeWindow(paymentTime, sessionTime) {
    const diff = Math.abs(paymentTime - sessionTime);
    return diff <= this.config.timeWindow;
  }

  /**
   * Calculate confidence score for a match (0-100)
   */
  getConfidenceScore(payment, session) {
    let score = 0;

    // Exact amount match: +40 points
    if (payment.amount === session.amount) {
      score += 40;
    } else if (this._isAmountMatch(payment.amount, session.amount)) {
      score += 20;
    }

    // Reference in narration: +30 points
    const narration = (payment.narration || "").toLowerCase();
    if (narration.includes(session.reference.toLowerCase())) {
      score += 30;
    }

    // Within time window: +20 points
    const timeDiff = Math.abs(
      new Date(payment.date) - new Date(session.createdAt)
    );
    if (timeDiff <= this.config.timeWindow) {
      const timeScore = 20 * (1 - timeDiff / this.config.timeWindow);
      score += timeScore;
    }

    // Email match: +10 points
    if (payment.customerEmail === session.customerEmail) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  /**
   * Find all possible matches with confidence scores
   */
  findPossibleMatches(payment, sessions) {
    const pendingSessions = sessions.filter((s) => s.status === "pending");

    return pendingSessions
      .map((session) => ({
        session,
        confidence: this.getConfidenceScore(payment, session),
      }))
      .filter((match) => match.confidence > 50)
      .sort((a, b) => b.confidence - a.confidence);
  }
}

module.exports = { PaymentMatcher };
