# REVLINE Mobile Diagnostics & Repair

This is a static website served directly from the repository root. It keeps the existing dark glass panels, red accents, mobile service form, and Google Maps coverage section.

## Vercel

Import this repository with the project root set to the repository root. Use the Other framework preset and leave build, install, and output directory commands empty. Vercel serves index.html, the linked CSS and JavaScript, and the local media directly. The included vercel.json supplies security headers.

## Contact form

The request form posts directly to FormSubmit at revlineutah@gmail.com, then returns to /thank-you.html. The email field uses the name expected by FormSubmit. CAPTCHA remains enabled so the configured autoresponse can work; FormSubmit documents that autoresponses are not sent for AJAX submissions or when CAPTCHA is disabled.

## Media

All media required to render the site is included as local SVG artwork. The illustrations are not photos of completed REVLINE jobs. See MEDIA_UPLOADS.md for the asset inventory and future photo replacement notes.
