# REVLINE media upload notes

## Existing customer work photos

Eight genuine photos supplied by REVLINE are already stored in `/media/` and appear only on the dedicated `/work/` page:

| Supplied photo | Published file | Work shown |
| --- | --- | --- |
| `photo_2026-10-04_23-26-40.jpg` | `media/revline-suspension.jpg` | Suspension and undercarriage |
| `photo_2026-10-04_23-26-29.jpg` | `media/revline-component-inspection.jpg` | Component inspection |
| `photo_2026-10-04_23-26-26.jpg` | `media/revline-engine-exhaust.jpg` | Engine and exhaust |
| `photo_2026-10-04_23-26-23.jpg` | `media/revline-diagnostics.jpg` | Autel live-data diagnostics |
| `photo_2026-10-04_23-26-13.jpg` | `media/revline-cooling-system.jpg` | Cooling system |
| `photo_2026-10-04_23-26-07.jpg` | `media/revline-exhaust-sensor.jpg` | Exhaust sensor inspection |
| `photo_2026-10-04_23-26-04.jpg` | `media/revline-drivetrain.jpg` | Drivetrain work on a lift |
| `photo_2026-10-04_23-25-49.jpg` | `media/revline-engine-bay.jpg` | Engine-bay service |

`photo_2026-10-04_23-26-00.jpg` remains excluded because a license plate is visible. Upload a manually masked copy only if REVLINE wants it published.

## Optional premium hero video

The homepage contains a video element configured for muted autoplay, looping and inline mobile playback. It does not request a missing file while the video is unavailable; the site-wide 3D technical background and abstract diagnostics scene remain visible.

If REVLINE supplies or approves a licensed, no-people video, upload the compressed H.264 MP4 to:

`media/revline-hero.mp4`

Use a short seamless 6–12 second loop, 720p or 1080p, no audio track, target under 12 MB, and avoid text/logos from other brands. Then set the homepage video element's `data-src` to `/media/revline-hero.mp4`. Keep the abstract fallback; verify the video on mobile and with reduced-motion enabled. The video is owner-supplied and is not included in this change.

## No vehicle render art

The site no longer uses generic AI vehicle renders or cartoon/vehicle illustrations in the hero or service cards. Customer photos stay on the work gallery as proof, not decorative fillers.
