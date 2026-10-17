# Visual dinners

The first visual dinner is `#/r/halal-cart-chicken`. It is a trial for review, not a taste-tested recipe or a full daily meal plan.

- `dinner-trials.json` is the maintained source for new dinners. The generated legacy `recipes.json` remains unchanged. Both load into the existing catalog.
- `visual-recipes.js` and `.css` provide the meal overview, measured ingredients, visual stages, before-cooking review and one-step cooking mode. Recipes without `visual` retain their old presentation.
- Three generated WebP illustrations live in `assets/dinners/`. They show cut shapes, browning and plating, not guaranteed portion weights. The UI labels them accordingly. No private health records or treatment details are published.
- Nutrition includes the whole recipe, all sauce, oil and side. Generic composition and arithmetic are recorded in `visual.nutritionCalculation`; these are estimates, not verified brand labels. The recipe remains untested in a kitchen.
- English and Tagalog recipe content share ingredient and step keys. Existing bookmarks, shopping selections, checks and ratings remain in `bah.kitchen.v1`. Pre-cooking review is an additive `reviews[recipeId]` field. It saves immediately and can be copied into a chat; it is not automatically sent anywhere or synced across devices.
- The service-worker shell includes the new data, code and images. Bump the HTML query versions and cache name together for later releases.

Validation: `node --test tests/*.test.cjs`; browser inspection of mobile/desktop views, photo enlargement, review persistence, ingredient scaling, translated cooking instructions and legacy recipes. Visual review applies the existing Table identity and Zain's criteria; no separate independent reviewer is claimed.

Revision 2: fresh portion increased to140g tomato/60g finely cross-chopped lettuce. Sauce uses45–60ml water with120g Greek yogurt. Estimated totals recalculated. Both photo guides edited together. Instructions use structured action bullets in EN/TL and Cook Mode. Ingredients moved to a native, initially collapsed details element in The dinner; serving scaling and saved ingredient keys retained.
# Six-dinner release — 17 October 2026

Halal-cart chicken and rice is approved. Five additional visual dinners are ready for review: chicken curry, tender kofta, roast chicken, pesto chicken pasta and ajiaco. Each has EN/TL action bullets, measured ingredients, full-dinner nutrition estimates, three distinct photo guides, review and Cook Mode. Approval is recipe approval, not a recorded kitchen taste test.

Recipe source remains `dinner-trials.json`; the original 16 recipes and their IDs are preserved. Editorial `approved` state distinguishes the approved dinner from the five new reviews without replacing device-local notes. `visual.time` and `visual.number` supply accurate per-recipe metadata. Images are labelled AI guides; weights and thermometer checks govern portions and doneness.

Release checks: all eleven catalog/data tests pass, including all six nutrition calculations, matching EN/TL checks/shopping rows, correct poultry/beef temperatures and every referenced offline photo. Mobile browser review covers all five new methods, ingredient scaling, cooking step advancement, translations and shopping. The curry's reading anchor moved less than half a pixel during a direct language tap; active tab, expanded ingredients and two-serving selection remained. Desktop layout inspected. No kitchen testing claimed.

The service-worker JSON fallback now looks up the requested resource rather than passing multiple unrelated filenames as cache options. New assets are precached for offline use after a successful online load.
