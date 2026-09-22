# Table navigation — 22 September 2026

## Brief and design review

Abdulla asked for a substantial wayfinding and categorization improvement while preserving the recipes, cards and cooking layout. The previous collection tabs mixed an archive week and a rating label with a second row of ingredient tabs. The shipped structure is Recipes, Saved and Shopping, with dish/ingredient/cuisine search and explicit ingredient/cuisine filters inside discovery. A bookmark means a personal favourite; it does not reinterpret old ratings or collection labels.

Coordinator scope: improve the find → choose → cook/shop paths on phone screens, including the cook's Tagalog option. No new content, account system, meal schedule or database migration. Saved recipes and shopping selections remain device-local.

Design-owner review (Zain's criteria, applied in direct execution mode): the three destinations describe distinct tasks, the duplicated All controls and dated archive labels are gone, bookmarks have an explicit Saved destination, and shopping starts with dish selection. Warm type, colours and recipe card styling are preserved. Phone screenshots at 393px and 320px and a 1280px desktop rendering were visually reviewed; no horizontal overflow was observed. This is an applied design review, not an independent agent or physical-device test.

## Maintenance

- `table.js` is the current application entry, with shared cooking, notes and theme behaviour.
- `navigation.js` contains discovery, bookmarks and dish-selective shopping UI.
- `catalog.js` contains pure search/filter/shopping rules.
- `wayfinding.css` contains navigation styles; original `styles.css` remains intact.
- `app.js` is retained unchanged solely for older cached HTML during the update. Do not use it as the active entry.
- Recipe data, original styles, icons and manifest are unchanged in this release.
- When updating shell files, change their `?v=` values in `index.html` and `sw.js`, and bump the worker cache version. Navigations request build-versioned HTML. Only Table-owned caches are removed.
- Storage keeps the existing `bah.kitchen.v1` key, ratings, notes and cooking checks. New fields are `savedRecipes` and `shoppingRecipes`; shopping check keys include the recipe and ingredient index so shared quantities are not lost.
- The local source worktree for this release is `outputs/Vita/table-wayfinding`, branch `table-wayfinding`. Unpublished Supabase/planning edits in `outputs/Vita/recipe-app` were preserved and are not part of this release. Reconcile those explicitly before developing from that older checkout.

## Verification

`node --test tests/catalog.test.cjs`: six passing tests covering combined discovery, Tagalog/accent search, bookmarks, selected-only shopping, repeated quantities and stable language-switch keys. Syntax checks passed for the current scripts and worker.

Browser checks passed for search + cuisine → recipe → back (filters retained), save → Saved → unsave (empty state/count), recipe → add shopping, two-dish picker, cancellation, removal, checkbox persistence after reload, EN/TL, light/dark, cooking-mode open/close and desktop layout. No runtime errors before the deliberate offline test.

With the local server stopped, a reload still showed all 16 recipes and shopping retained two dishes and its checked item. Physical iPhone/ATFLY installation and cross-device synchronization are not claimed.

Before/after comparison: `preview/navigation.html`.
