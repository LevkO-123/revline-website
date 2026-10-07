# REVLINE website integration setup

Account-dependent services below are not live until the business owner supplies the listed access and configuration. The static pages keep their fallbacks when an integration is unavailable. `INTEGRATIONS.env.example` lists empty variable names and safe URL examples; configure actual values in Vercel, not in the repository.

## Google review feed
To display reviewer name, rating, text, profile photo and date from Google automatically:
1. Confirm the verified REVLINE Business Profile and grant the authorized account access.
2. Create a Google Cloud project and enable the Business Profile APIs available for that account.
3. Configure a Vercel server-side endpoint with OAuth credentials and a cache.
4. Store `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, and `GBP_LOCATION_ID` as Vercel environment variables; keep all except any published OAuth client ID server-side.
5. Confirm the displayed fields and refresh schedule. Keep the official Google profile link as fallback.

No reviews or review count are fabricated in the current pages. Until API access is authorized and connected, the Reviews page links to the official Google profile and accepts separate website testimonials for manual review.

## Website testimonial form
The Reviews page submits name, email, rating, review text and an optional JPG/PNG image to the existing FormSubmit recipient `revlineutah@gmail.com`. Submissions are for owner moderation and are not published automatically or converted into Google reviews. Complete FormSubmit's first-use email confirmation before relying on the flow.

## Stripe Checkout, Apple Pay and Google Pay
The branch now contains server-side Vercel API routes for creating a Checkout Session from an owner-approved Stripe Price ID, checking paid session status, and validating Stripe webhook signatures. Checkout returns a safe configuration error until the Stripe environment is configured. The public website does not expose card fields or an active Pay button.

Add these Vercel environment variables in Preview first, then Production only after approval:
- `STRIPE_SECRET_KEY` — server-only Stripe key.
- `STRIPE_WEBHOOK_SECRET` — server-only webhook signing secret.
- `STRIPE_PRICE_IDS` — comma-separated allowlist of Stripe Price IDs REVLINE has approved.
- `STRIPE_SUCCESS_URL` — fixed absolute URL for the paid-order confirmation page.
- `STRIPE_CANCEL_URL` — fixed absolute URL back to the website.
- `PUBLIC_SITE_URL` — exact trusted origin used by server routes.

Create a Stripe webhook pointed to `/api/stripe-webhook` and subscribe to `checkout.session.completed`. The route verifies the signature and returns an acknowledgement; order handling/receipts must be tested for REVLINE's chosen service/payment flow before taking payment. Register the production domain for Apple Pay / Google Pay in Stripe and confirm merchant eligibility. Do not place secret keys in browser code or expose them with a public prefix.

## Affirm and Klarna
These options are not currently active. Confirm merchant eligibility, category approval, settlement/dispute terms, customer disclosures and service eligibility with Stripe/provider before publishing buttons. Any future availability depends on provider approval and final terms.

## Appointment calendar and customer follow-up
The website form sends an appointment request and preferred time; it does not reserve a calendar slot. To automate confirmed bookings, REVLINE must choose a scheduling/CRM provider, connect its business calendar, specify service durations and drive/coverage rules, and set cancellation/reminder behavior. Prevent double bookings and test notifications before replacing the request flow.

## Analytics and conversion events
The front end emits browser event `revline:conversion` and pushes events to `window.dataLayer` only when an analytics container initializes it. Names include `phone_click`, `sms_click`, `quote_request_click`, `service_request_submitted`, `service_request_received`, `testimonial_submitted`, `payment_initiated`, and `payment_completed`. Payment completion must only be emitted after the server verifies that Stripe reports the session as paid.

To connect GA4 or Google Tag Manager, provide the approved measurement/container ID and any consent requirements. No analytics ID is embedded.

## Business details to verify before launch
- Confirm the current phone number, starting prices, hours, supported services, coverage, listed makes and FormSubmit first-use confirmation.
- The page keeps the verified existing 224-area-code phone number; replace it only after REVLINE provisions a new number and updates the website, schema, Google listing and business citations together.
- No technician name, certifications, years of experience, insurance, warranty or guarantees are claimed without verified details.
