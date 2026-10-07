const crypto = require("node:crypto");

async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return Buffer.from(req.body);
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > 1024 * 1024) throw new Error("payload_too_large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ error: "webhook_not_configured" });

  try {
    const raw = await readRawBody(req);
    const signature = req.headers["stripe-signature"] || "";
    const parts = Object.fromEntries(String(signature).split(",").map((piece) => {
      const index = piece.indexOf("=");
      return index < 0 ? ["", ""] : [piece.slice(0, index), piece.slice(index + 1)];
    }));
    const timestamp = Number(parts.t);
    const signatures = String(signature).split(",").filter((piece) => piece.startsWith("v1=")).map((piece) => piece.slice(3));
    if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > 300 || !signatures.length) {
      return res.status(400).json({ error: "invalid_signature" });
    }

    const expected = crypto.createHmac("sha256", secret).update(String(timestamp) + "." + raw.toString("utf8")).digest();
    const valid = signatures.some((value) => {
      try {
        const received = Buffer.from(value, "hex");
        return received.length === expected.length && crypto.timingSafeEqual(received, expected);
      } catch {
        return false;
      }
    });
    if (!valid) return res.status(400).json({ error: "invalid_signature" });

    const event = JSON.parse(raw.toString("utf8"));
    const supported = ["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type);
    return res.status(200).json({ received: true, supported_event: supported });
  } catch {
    return res.status(400).json({ error: "invalid_payload" });
  }
};

module.exports.config = { api: { bodyParser: false } };
