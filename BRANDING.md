# Table identity integration — 22 September 2026

Abdulla selected and explicitly requested implementation of the T/table concept: sample 5's solid T silhouette, sample 1's plate and draped napkin, and the T forming the first letter of Table. The approved presentation was isolated into transparent wordmark and opaque square icon masters using the built-in image tool. Standard web dimensions were exported with Sharp. Original masters, prompts and export script live in `outputs/table-identity-2026-09-22/production` in the enclosing workspace.

Header: the complete wordmark replaces the old T tile and duplicate text. It links to Recipes. Dark mode maps espresso lettering to cream through an SVG filter while preserving the original alpha and terracotta symbol. No second redrawn silhouette is used for dark mode.

Assets: `assets/table-wordmark-v1.png` (640×265); opaque `table-icon-{32,180,192,512,1024}-v1.png` for favicon, Apple touch, Android and downloads. Android's cream artwork fits within the maskable 80%-diameter safe circle (radius 199.4px versus 204.8px at 512px). Manifest name and short name are Table; start URL, scope and storage stay unchanged.

Shell URLs and cache version are bumped to identity-1/table-identity-v1. New asset filenames avoid reusing old icon URLs. The legacy app.js and icon files are retained for old cached HTML. Unpublished brand-previews drafts are not shipped.

Design review: at 320px and 393px the complete mark is visible, the appearance and language buttons remain separate and there is no horizontal overflow. The cream lettering is readable in dark mode, and the plate/napkin remain visible. Checked logo → Recipes navigation and EN/TL. Existing six catalogue tests pass; recipe content and navigation logic are unchanged. Physical Home Screen icon refresh timing is controlled by the device and is not claimed as tested.

Before/after: `preview/branding.html`.
