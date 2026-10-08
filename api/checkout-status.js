module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return res.status(503).json({ error: "checkout_not_configured" });

  const sessionId = typeof req.query?.session_id === "string" ? req.query.session_id : "";
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return res.status(400).json({ error: "invalid_session_id" });
  }

  try {
    const response = await fetch(
      "https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(sessionId),
      { headers: { Authorization: "Bearer " + secret } }
    );
    const session = await response.json();
    if (!response.ok) return res.status(502).json({ error: "session_lookup_failed" });
    return res.status(200).json({
      status: session.status === "complete" ? "complete" : "open",
      payment_status: session.payment_status === "paid" ? "paid" : "unpaid"
    });
  } catch {
    return res.status(502).json({ error: "session_lookup_failed" });
  }
};
