# REVLINE website integration setup

Account-dependent services stay inactive until the owner completes the access and configuration below. Put credentials in Vercel Project Settings, never in source files. Preview must be tested before activating Production.

## Google Business Profile reviews

The site imports real reviews from Google's Business Profile API through a server-side Vercel route. It does not invent ratings, text or counts. The Reviews page shows a clear Google Reviews label and links to the official profile while API access is not configured.

Required owner setup:

1. Confirm the REVLINE Business Profile is verified and the Google account has manager/owner access.
2. Create or select a Google Cloud project, request/enable Business Profile API access for that account, and configure OAuth consent.
3. Authorize the `business.manage` OAuth scope for the profile owner; obtain a refresh token using the approved account.
4. Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GBP_ACCOUNT_ID`, and `GBP_LOCATION_ID` in Vercel. Keep credentials server-side.
5. Confirm actual profile data and refresh behavior in Preview.

The endpoint uses the official Reviews API and a short server response cache. Google's API access/eligibility is account-controlled; the website cannot grant that access itself. Review data is not stored in Supabase. Google's API policies govern refresh and retention of cached content; verify current terms before changing cache behavior.

Official docs: [Reviews API](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list), [OAuth](https://developers.google.com/my-business/content/implement-oauth), [Business Profile API policies](https://developers.google.com/my-business/content/policies).

## REVLINE website reviews and moderation

Run `supabase/reviews.sql` in the REVLINE Supabase project, then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel. The service-role key stays server-side. The review-photo bucket is private; uploaded review photos are served only for approved reviews.

Workflow is enforced as submission → pending → owner approval → published. A new submission is always pending and never shown publicly until an owner changes its status to approved. Owner moderation occurs in the Supabase dashboard. Configure Vercel Firewall/Bot Protection or an equivalent request rate limit before broad promotion; the honeypot and same-origin checks are basic spam controls, not a complete rate-limit system. Until credentials are present, the form explicitly reports that the review service is unavailable rather than pretending a review was saved.

## Stripe payments, cards and wallets

The payment page explains card and supported wallet payments. The browser may receive only `STRIPE_PUBLISHABLE_KEY` (a `pk_` value) through the payment-config route. `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and approved Price IDs remain server-only. Existing Checkout routes accept only owner-approved Price IDs and remain unavailable until fully configured.

Before enabling Checkout, configure Preview values, approved service/price IDs, fixed success/cancel URLs, webhook verification, and the Stripe account's Apple Pay/Google Pay domain and merchant eligibility. Complete a test-mode transaction and verify the webhook/session status before enabling any live payment flow. Never place secret keys in HTML, JavaScript, or public-prefixed environment variables.

## Affirm and Klarna

Financing is shown as not active. REVLINE must receive provider/merchant approval, confirm supported service categories and payment terms, and complete any Stripe/provider setup before representing either option as available.

## Hero video

See [MEDIA_UPLOADS.md](MEDIA_UPLOADS.md) for the exact MP4 path and video element change. No video is included because a licensed, approved asset has not been supplied.

## Appointment requests and follow-up

The request form is a request, not a confirmed booking. FormSubmit's first-use confirmation must be completed. Automated scheduling requires the owner's selected CRM/calendar, service durations, travel rules, cancellation rules and notifications. Do not show a time as booked until availability is confirmed.

## Analytics

Conversion events are emitted to the browser event bus and to `dataLayer` only if an approved container initializes it. Add the approved analytics ID and any required consent management before enabling tracking.
