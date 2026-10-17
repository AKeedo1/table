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
