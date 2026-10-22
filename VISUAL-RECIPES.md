# Visual dinners

Current release — 19 October 2026: all 15 active dinners use the approved visual recipe format. Five existing dinners remain unchanged; the ten selected older dishes are rebuilt. The six rejected dishes are removed from the active catalogue. Original IDs are retained for the keepers.

The updated dishes are Black Pepper Chicken & Greens, Kra Pao Gai, Bulgogi Chicken Lettuce Wraps, Braised Chicken Thighs, Sichuan Dry-Fried Chicken, Ají de Gallina, Tender Greek Lamb Souvlaki, Korean Beef Bibimbap, Salmon Teriyaki Bowl and Miso-Glazed Salmon. Lamb now specifies trimmed boneless loin, a refrigerated yogurt marinade, controlled searing and a thermometer/rest endpoint. The previous interchangeable shoulder option and guaranteed overnight-marinade claim are removed.

- Each dinner has measured ingredients in a collapsible Dinner section, concise EN/TL action bullets, three labelled generated guides, review notes and one-step Cook Mode. The 30 new WebP assets are under `assets/dinners/` with the `-v1.webp` suffix.
- Complete-dinner nutrition includes all sauces, oils, sides, eggs and toppings. Raw/dry weights and cooked exceptions are explicit. Generic USDA composition and brand-dependent estimates are recorded in `visual.nutritionCalculation`. Freekeh is an estimate; broccolini uses a broccoli proxy; discarded marinade is conservatively counted. Estimates are not brand-specific analysis or a complete-day plan. Recipes have not been kitchen-tested.
- Illustrations show cuts, browning and serving arrangement; they do not establish exact portion weights or doneness. Use measured ingredients and a thermometer.
- `recipes.json` contains the ten rebuilt keepers. `dinner-trials.json` contains the five earlier visual dinners. Both load into the catalogue. Legacy-format support remains available.
- Keep/remove selection is complete. The old-review invitation hides when no legacy dishes remain; existing `#/recipe-review` links display completion and a return to Recipes. Local review choices remain stored; no automatic messaging or sync.
- Stable recipe IDs preserve favourites, ratings, notes and shopping selections. `checkRevision` invalidates only old ingredient/cooking/shopping ticks once, because reordered steps and ingredients must not inherit unrelated completed marks. Later ticks persist normally.
- HTML query versions and service-worker cache are bumped together. All 30 new guides are precached. Bookmarks and feedback stay device-local.

Validation: `node --test tests/*.test.cjs` covers the explicit keep/remove set, translated quantities and keys, nutrition arithmetic, cooking endpoints, all photo assets, offline JSON fallback and preservation of notes/favourites across tick migration. Mobile checks cover recipe viewing, scaling, EN/TL, Cook Mode and shopping. The five prior dinners are unchanged. No independent panel or kitchen testing is claimed.


## 21 October: tasted portions and goal review

Curry: 75% of the curry ingredients, unchanged rice; scant quarter-teaspoon is the practical measure for 3/16 tsp. Halal-cart: smaller non-rice components, broth rice, explicit component salt, no-mayo garlic-herb sauce, properly roasted chickpea/carrot side. Three new photo assets, including the side browning guide. Ajiaco and the other twelve recipes are unchanged.

22 October correction: recipe scores and the goal-fit assessment belong in chat only. Removed the public assessment page, card scores and dinner breakdowns. The private assessment generator must not publish data into Table. Recipe quantities, instructions, photos and nutrition remain unchanged. The recipe revision resets only obsolete cooking/shopping ticks for the two changed meals; notes and bookmarks remain intact.
