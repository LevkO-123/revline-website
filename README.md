# REVLINE Mobile Diagnostics & Repair

This is a static website served directly from the repository root. It keeps the existing dark glass panels, red accents, mobile service form, and Google Maps coverage section.

## Vercel

Import this repository with the project root set to the repository root. Use the Other framework preset and leave build, install, and output directory commands empty. Vercel serves the local CSS, JavaScript, SVG logo/background, and the job photos in `/media/`.

## Contact form

The request form posts directly to FormSubmit at revlineutah@gmail.com, then returns to /thank-you.html. The email field uses the name expected by FormSubmit. CAPTCHA remains enabled so the configured autoresponse can work; FormSubmit documents that autoresponses are not sent for AJAX submissions or when CAPTCHA is disabled.

## Photos

Eight supplied REVLINE work photos are included in `/media/`; no manual photo upload is required. Stock images are labeled where used as category illustrations. See [MEDIA_UPLOADS.md](MEDIA_UPLOADS.md) for the complete file map and photo credits.
