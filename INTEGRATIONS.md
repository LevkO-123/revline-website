# REVLINE website integration setup

This static-site update improves service information and lead capture. These account-dependent integrations still need business-owner access before they can be activated.

## Google review feed

To display review name, rating, text, profile photo and date from Google automatically:

1. Confirm the correct Google Business Profile location and that it is verified.
2. Grant authorized access to the profile and configure a Google Cloud project for the Business Profile API.
3. Provide an authenticated server-side connection and a small serverless endpoint/cache on Vercel.
4. Store OAuth/client secrets in Vercel environment variables only. Never put credentials in `script.js` or public HTML.
5. Approve the displayed fields and refresh schedule. Keep the official Google profile link as a fallback.

Until this is connected, the Reviews page links to Google and displays no invented quotes, reviewer identities or star totals. Do not add self-serving aggregate review markup to the business website.

## Online payment, Apple Pay and Google Pay

Before enabling checkout, REVLINE needs a verified Stripe account, selected payment flow (hosted link versus deposit/checkout), business-approved pricing/refund terms, and a server-side payment integration. Register the production domain for the wallet methods supported by the Stripe account. Use Stripe-hosted checkout or a server endpoint; never put a secret key in browser code. Confirm receipts, cancellation/refund handling and webhook status before accepting online payments.

## Affirm and Klarna

Confirm the merchant's eligibility and category approval with Stripe/provider, settlement and dispute terms, customer disclosures and the exact services eligible for financing. Add provider buttons only after approval and successful checkout testing. Until then, the website does not claim financing is available.

## Appointment calendar and customer follow-up

The request form collects a preferred date/time window and emails REVLINE via FormSubmit; it does not reserve a slot. To automate confirmed bookings, choose a calendar/CRM, connect the business calendar, set service durations and drive/coverage rules, and decide cancellation, reminders and after-hours handling. Test notifications and double-booking prevention before replacing the request flow.

## Business details to reconcile before launch

- Replace the current 224 area-code phone with a Utah business number only after a new number is provisioned. Update the site, Google Business Profile, schema, text links and any citations together.
- Confirm that the listed starting prices, Saturday hours, all nine service cities, listed makes and all service categories remain current.
- Supply verified facts for certifications, years of experience, insurance, warranty terms and service guarantees before publishing any trust claim.
- Ensure FormSubmit's first-submission email confirmation has been completed. FormSubmit's email auto-response can reach customers only when they provide a valid email.
- Uploaded form images are limited on the page to 3 JPG/PNG files totaling less than 10 MB and are sent with the FormSubmit request.
