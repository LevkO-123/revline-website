# Manual media uploads

The site uses generated SVG placeholders, so every visible media slot works without the original binaries. To restore the real project photos and footage, create a media directory in the repository root and upload these exact files.

## Photos

- media/inline-photo-02.webp — hero service truck.
- media/inline-photo-03.webp — diagnostics service card.
- media/inline-photo-04.webp — programming card and diagnostics gallery tile.
- media/inline-photo-05.jpg — electrical/repair card and engine gallery tile.
- media/inline-photo-06.jpg — accessories and upgrades card.
- media/inline-photo-07.jpg — European/domestic feature and BMW gallery tile.
- media/inline-photo-08.webp — RV electrical feature.
- media/inline-photo-09.webp — UTV/Polaris feature.
- media/inline-photo-10.webp — RV battery gallery tile.
- media/inline-photo-11.jpg — UTV drivetrain gallery tile.
- media/inline-photo-12.jpg — component/turbo gallery tile.

Each placeholder image records its intended upload path in a data-manual-asset attribute. After uploading a photo, change the relevant image src from /media/photo-placeholder.svg to the matching /media/inline-photo-... path. Some photos appear in more than one location; update every element with the same data-manual-asset value. Keep descriptive alt text.

## Videos

- media/inline-video-01.mp4 — optional looping hero footage; the hero container records this in data-video-needed.
- media/inline-video-02.mp4 — the See It Happen video card; its container records this in data-video-needed.

Replace the See It Happen placeholder with a video controls playsinline preload=metadata element using /media/inline-video-02.mp4 as its source. For hero footage, add the uploaded file as a muted, looping, inline video behind the hero caption. No poster upload is required because /media/photo-placeholder.svg is the generated fallback. The old missing service-detail-poster.webp, site-bg-reference-8k.webp, site-bg-8k.webp, and hex-industrial.webp references were removed; none of those files need to be uploaded.

## Already included

- /revline-r.webp — existing RevLine logo and favicon.
- /media/site-background.svg — generated full-screen technical background.
- /media/photo-placeholder.svg — generated automotive photo/video placeholder.
