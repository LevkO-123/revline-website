REVLINE V36 READY
=================
Upload the CONTENTS of this folder to the root of the GitHub repository.
Do not nest the project inside another folder.

index.html is the production entry point.
All local media are in /media.
The exact supplied hex reference is shipped as:
- media/site-bg-reference.png (original)
- media/site-bg-reference-4k.webp
- media/site-bg-reference-8k.webp
- media/site-bg-4k.webp / media/site-bg-8k.webp (vector fallback)

Critical reliability fixes:
- fixed malformed inline JS closure
- content is visible even if JS fails
- main/footer sit above fixed background layer
- all embedded photo/video sources extracted to local files
- native FormSubmit fallback if AJAX fails
