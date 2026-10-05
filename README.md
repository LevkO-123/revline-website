# REVLINE Mobile Diagnostics & Repair

This is a static website served directly from the repository root. The existing dark glass panels, red accents, mobile service form, and Google Maps coverage section are retained.

## Vercel

Import this repository with the project root set to the repository root. Use the Other framework preset and leave build, install, and output directory commands empty. Vercel serves index.html, the linked CSS and JavaScript, and static assets directly. The included vercel.json supplies security headers. A commit to the connected production branch (usually main) deploys when the Vercel Git integration is enabled.

## Contact form

The request form posts directly to FormSubmit at revlineutah@gmail.com, then returns to /thank-you.html. The email field uses the name expected by FormSubmit. CAPTCHA remains enabled so the configured autoresponse can work; FormSubmit documents that autoresponses are not sent for AJAX submissions or when CAPTCHA is disabled.

## Missing media

The page currently uses the generated SVG background and photo placeholders. Upload the original photos and videos listed in MEDIA_UPLOADS.md, then replace the matching placeholder image paths with the uploaded media paths. The existing logo file /revline-r.webp is already present.
