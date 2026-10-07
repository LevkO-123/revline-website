module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const siteOrigin = process.env.PUBLIC_SITE_URL;
  const secret = process.env.STRIPE_SECRET_KEY;
  const allowedPriceIds = (process.env.STRIPE_PRICE_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => /^price_[A-Za-z0-9]+$/.test(value));

  if (!siteOrigin || !secret || !allowedPriceIds.length ||
      !process.env.STRIPE_SUCCESS_URL || !process.env.STRIPE_CANCEL_URL) {
    return res.status(503).json({ error: "checkout_not_configured" });
  }

  try {
    if (!req.headers.origin || new URL(req.headers.origin).origin !== new URL(siteOrigin).origin) {
      return res.status(403).json({ error: "origin_not_allowed" });
    }
  } catch {
    return res.status(403).json({ error: "origin_not_allowed" });
  }

  const body = typeof req.body === "string" ? (() => {
    try { return JSON.parse(req.body); } catch { return {}; }
  })() : (req.body || {});
  const priceId = typeof body.priceId === "string" ? body.priceId : "";
  if (!allowedPriceIds.includes(priceId)) {
    return res.status(400).json({ error: "price_not_allowed" });
  }

  let successUrl;
  let cancelUrl;
  try {
    successUrl = new URL(process.env.STRIPE_SUCCESS_URL);
    cancelUrl = new URL(process.env.STRIPE_CANCEL_URL);
    const origin = new URL(siteOrigin).origin;
    if (successUrl.origin !== origin || cancelUrl.origin !== origin ||
        !successUrl.searchParams.has("session_id")) {
      return res.status(503).json({ error: "checkout_urls_invalid" });
    }
  } catch {
    return res.status(503).json({ error: "checkout_urls_invalid" });
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("success_url", successUrl.toString());
  params.set("cancel_url", cancelUrl.toString());
  params.set("metadata[source]", "revline_website");

  try {
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + secret,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": require("node:crypto").randomUUID()
      },
      body: params
    });
    const session = await stripeResponse.json();
    if (!stripeResponse.ok || !session.url) {
      return res.status(502).json({ error: "checkout_session_failed" });
    }
    return res.status(200).json({ url: session.url });
  } catch {
    return res.status(502).json({ error: "checkout_unavailable" });
  }
};
