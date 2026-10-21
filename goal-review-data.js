/* Editorial recipe assessment, 21 October 2026. Not a clinical score. */
const GOAL_REVIEW = {
  "halal-cart-chicken": {
    "score": 8,
    "points": [
      2,
      2,
      2,
      1,
      1
    ],
    "status": "Rebuilt bowl; needs a taste test.",
    "good": "Smaller chicken and extras; broth rice, explicit seasoning and a concentrated no-mayo sauce. Chickpeas now roast from the start.",
    "watch": "The old version failed on flavour, sauce, balance and the side. This score assesses the revision, not a proven result. Fibre still needs support elsewhere.",
    "tl": {
      "status": "Binagong bowl; kailangan pang tikman.",
      "good": "Mas kaunting manok at extras; kanin sa sabaw, malinaw na timpla at mas malasang sarsa na walang mayo. Mula umpisa nang ini-roast ang chickpeas.",
      "watch": "Hindi nagustuhan ang dating lasa, sarsa, balanse at side. Para sa bagong recipe ang score; hindi pa ito napatutunayan sa pagtikim. Kailangan pa ng fibre sa ibang pagkain."
    },
    "totals": [
      610.868,
      49.5475,
      57.0721,
      20.75674,
      7.951
    ]
  },
  "curry-chicken": {
    "score": 8,
    "points": [
      2,
      1,
      2,
      1,
      2
    ],
    "status": "Loved flavour; smaller portion to try.",
    "good": "Every curry ingredient is reduced by 25%; rice is unchanged. Same spices, oil-to-sauce ratios and cooking sequence.",
    "watch": "Original flavour is taste-tested. The smaller serving is not yet tested and supplies less energy, protein and fibre. Keep the gravy loose.",
    "tl": {
      "status": "Paboritong timpla; susubukan ang mas maliit na serving.",
      "good": "Bawat sangkap ng curry ay binawasan ng 25%; hindi binago ang kanin. Pareho ang spices, ratio ng mantika at sarsa, at paraan.",
      "watch": "Natitikman na ang orihinal na timpla. Hindi pa nasusubukan ang mas maliit na serving; mas kaunti ang energy, protein at fibre. Panatilihing malabnaw ang gravy."
    },
    "totals": [
      516.2825,
      45.739775,
      56.678525,
      12.1455,
      7.3945
    ]
  },
  "kofta-tomato": {
    "score": 6,
    "points": [
      2,
      2,
      1,
      0,
      1
    ],
    "status": "Good ingredients; bulky plate.",
    "good": "Lean mince, oats, skin-on potatoes and fresh salad give strong protein and fibre. Gentle mixing and a simmer should protect tenderness.",
    "watch": "180 g beef, 250 g potatoes and substantial sauce/salad may be too much solid food. Keep this as a red-meat-day choice; portion review next, not automatically changed.",
    "tl": {
      "status": "Magandang sangkap; malaking plato.",
      "good": "Lean mince, oats, patatas na may balat at salad para sa protein at fibre. Marahang paghahalo at pagpapakulo para sa lambot.",
      "watch": "Maaaring sobra ang 180 g beef, 250 g patatas at maraming sarsa/salad. Para sa araw ng red meat; kailangan pang i-review ang dami, hindi awtomatikong binawasan."
    },
    "totals": [
      658.06,
      49.625099999999996,
      74.4641,
      19.1145,
      12.861
    ]
  },
  "pesto-chicken": {
    "score": 7,
    "points": [
      2,
      2,
      1,
      1,
      1
    ],
    "status": "Flavourful on paper; portion to test.",
    "good": "Basil, toasted almonds, garlic and sun-dried tomatoes give a clear flavour base; courgette is seared, not boiled.",
    "watch": "180 g chicken plus 330 g vegetables can still be bulky. Cheese and sun-dried tomatoes add salt; the actual brands matter. Taste is not yet confirmed.",
    "tl": {
      "status": "Malasa sa recipe; subukan ang dami.",
      "good": "Basil, toasted almonds, bawang at sun-dried tomatoes para sa lasa; sini-sear ang courgette, hindi pinapakuluan.",
      "watch": "Maaari pa ring marami ang 180 g manok at 330 g gulay. May asin ang cheese at sun-dried tomatoes; mahalaga ang brand. Hindi pa kumpirmado ang lasa."
    },
    "totals": [
      699.0,
      60.5704,
      63.5219,
      23.7645,
      9.443999999999999
    ]
  },
  "ajiaco-chicken": {
    "score": 9,
    "points": [
      2,
      2,
      1,
      2,
      2
    ],
    "status": "Enjoyed and finished. Keep it.",
    "good": "The soup format worked in practice. Strong protein, vegetables and the requested separate rice, lettuce and sour cream.",
    "watch": "Rice, potato and corn make this one of the higher-carbohydrate dinners. Stock sodium varies; sour cream contributes saturated fat. Fibre remains provisional because the potato reference includes skin.",
    "tl": {
      "status": "Nagustuhan at naubos. Panatilihin.",
      "good": "Bumagay ang sopas sa aktuwal na pagkain. Maraming protein at gulay; hiwalay ang kanin, lettuce at sour cream ayon sa gusto.",
      "watch": "Mas mataas ang carbohydrate dahil sa kanin, patatas at mais. Depende sa brand ang sodium ng stock; may saturated fat ang sour cream. Pansamantala ang fibre estimate dahil may balat ang potato reference."
    },
    "totals": [
      749.52,
      61.4489,
      87.4714,
      19.22,
      8.759
    ]
  },
  "week9-thu": {
    "score": 7,
    "points": [
      2,
      2,
      1,
      1,
      1
    ],
    "status": "Promising; watch sauce salt and bulk.",
    "good": "Pepper, ginger, garlic and browned greens supply flavour and texture without a bland boiled side.",
    "watch": "Soy plus oyster sauce contributes sodium even with low-sodium soy. 200 g chicken and a large vegetable/cucumber portion may need shrinking after tasting.",
    "tl": {
      "status": "Mukhang bagay; bantayan ang asin at dami.",
      "good": "Pepper, luya, bawang at browned greens para sa lasa at texture, walang bland na pinakuluang side.",
      "watch": "May sodium ang soy at oyster sauce kahit low-sodium ang soy. Maaaring kailangang bawasan ang 200 g manok at maraming gulay/cucumber matapos subukan."
    },
    "totals": [
      709.11,
      58.0817,
      81.7648,
      16.9525,
      8.247
    ]
  },
  "win-krapao": {
    "score": 5,
    "points": [
      2,
      0,
      1,
      1,
      1
    ],
    "status": "Protein strong; fibre is the weak spot.",
    "good": "Basil, chilli and garlic have a clear culinary role. Chicken and egg provide ample protein; no plain boiled vegetable side.",
    "watch": "Only about 3 g fibre. Oyster, fish and soy sauces stack sodium. Chicken plus egg is a sizeable topping; fruit/nuts elsewhere help fibre but are not included in these totals.",
    "tl": {
      "status": "Malakas sa protein; kulang sa fibre.",
      "good": "Basil, chilli at bawang ang lasa. Sapat ang protein mula sa manok at itlog; walang plain na pinakuluang gulay.",
      "watch": "Mga 3 g fibre lamang. Nagsasama ang sodium ng oyster, fish at soy sauces. Marami ang manok at itlog; makatutulong sa fibre ang prutas/nuts sa ibang oras, hindi kasama sa totals."
    },
    "totals": [
      725.76,
      59.4199,
      68.565,
      22.822400000000002,
      3.178
    ]
  },
  "win-bulgogi": {
    "score": 6,
    "points": [
      2,
      1,
      1,
      1,
      1
    ],
    "status": "Fresh wraps; oversized chicken risk.",
    "good": "Pear, ginger, garlic and a properly seared glaze balance fresh lettuce and cucumber. Includes all glaze and chilli drizzle in nutrition.",
    "watch": "220 g chicken plus lettuce and cucumber is substantial. Fibre is modest and soy/gochujang need a sodium-label check. Current recipe uses slices; confirm the cut is enjoyable.",
    "tl": {
      "status": "Fresh wraps; maaaring sobra ang manok.",
      "good": "Pear, luya, bawang at seared glaze kasama ang sariwang lettuce at cucumber. Kasama lahat ng glaze at chilli sauce sa nutrisyon.",
      "watch": "Marami ang 220 g manok kasama ang lettuce at cucumber. Katamtaman ang fibre; tingnan ang sodium sa soy/gochujang. Slices ang hiwa; subukan kung gusto ito."
    },
    "totals": [
      672.48,
      59.0235,
      70.88250000000001,
      16.403,
      4.8790000000000004
    ]
  },
  "win-braised": {
    "score": 7,
    "points": [
      2,
      2,
      1,
      1,
      1
    ],
    "status": "Strong fibre; a large, salty-sauce risk.",
    "good": "Bulgur contributes fibre. Gentle braising, saffron, lemon and browned chicken are a coherent flavour/tenderness approach.",
    "watch": "240 g thighs is a large meat portion. Preserved lemon, olives and broth all contribute salt; rinsing is not a measured sodium reduction. Portion not taste-tested.",
    "tl": {
      "status": "Maraming fibre; malaking serving at maalat na sarsa ang posibleng problema.",
      "good": "May fibre ang bulgur. Marahang braise, saffron, lemon at browned chicken para sa lasa at lambot.",
      "watch": "Malaki ang 240 g thighs. May asin ang preserved lemon, olives at broth; hindi tiyak ang bawas sodium sa pagbabanlaw. Hindi pa nasusubukan ang serving."
    },
    "totals": [
      696.7624999999999,
      60.8526,
      66.3251,
      23.1075,
      13.286
    ]
  },
  "win-sichuan": {
    "score": 7,
    "points": [
      2,
      2,
      1,
      1,
      1
    ],
    "status": "Texture fits; rich and heat-forward.",
    "good": "Blistered beans and sautéed spinach match the preference for browned, seasoned vegetables. Good protein and fibre.",
    "watch": "20 g added oils and 200 g chicken make a rich dinner. Soy contributes salt. Heat tolerance is personal; spice is not automatically a gut problem or a gut benefit.",
    "tl": {
      "status": "Bagay ang texture; rich at maanghang.",
      "good": "Blistered beans at ginisang spinach ayon sa gustong browned at malasang gulay. Magandang protein at fibre.",
      "watch": "Rich ang hapunan dahil sa 20 g dagdag na mantika at 200 g manok. May asin ang soy. Depende sa tao ang anghang; hindi awtomatikong masama o mabuti sa tiyan."
    },
    "totals": [
      766.77,
      58.0317,
      74.1377,
      27.054,
      9.307
    ]
  },
  "win-aji": {
    "score": 5,
    "points": [
      2,
      1,
      1,
      0,
      1
    ],
    "status": "First in line for a portion rethink.",
    "good": "Ají sauce has flavour and richness from measured chilli paste, milk, bread and walnuts. All toppings and oils are counted.",
    "watch": "About 960 kcal: chicken, rice, potato, bread, dairy sauce, egg, olives and nuts stack up. Fibre is modest for that energy. No automatic removal; this needs simplification before calling it an easy regular.",
    "tl": {
      "status": "Unang dapat i-review ang dami.",
      "good": "May lasa at richness ang ají sauce mula sa chilli paste, gatas, tinapay at walnuts. Kasama ang toppings at mantika sa bilang.",
      "watch": "Mga 960 kcal: nagsasama ang manok, kanin, patatas, tinapay, dairy sauce, itlog, olives at nuts. Katamtaman ang fibre para sa energy nito. Hindi inalis; kailangan pang pasimplehin."
    },
    "totals": [
      955.66,
      68.501,
      95.3142,
      32.6157,
      6.414
    ]
  },
  "win-souvlaki": {
    "score": 5,
    "points": [
      2,
      2,
      0,
      0,
      1
    ],
    "status": "Tenderness addressed; plate still too large.",
    "good": "Trimmed loin, a yogurt marinade, controlled searing and resting are better suited to tenderness than tough stewing cuts. Whole-grain freekeh adds fibre.",
    "watch": "220 g lamb, grain, pita, large salad, feta and 120 g tzatziki stack bulk and saturated-fat sources. Full marinade is counted even though excess is discarded, so nutrition is conservative. Red-meat-day option; next portion review.",
    "tl": {
      "status": "Inayos ang lambot; malaki pa rin ang plato.",
      "good": "Trimmed loin, yogurt marinade, maingat na sear at pahinga para sa lambot. May fibre ang whole-grain freekeh.",
      "watch": "Marami ang 220 g lamb, grain, pita, malaking salad, feta at 120 g tzatziki; may saturated fat din. Binilang ang buong marinade kahit itinatapon ang sobra. Para sa red-meat day; susunod na i-review ang dami."
    },
    "totals": [
      895.5,
      76.5383,
      70.3892,
      34.099,
      9.9
    ]
  },
  "win-bibimbap": {
    "score": 6,
    "points": [
      2,
      2,
      1,
      0,
      1
    ],
    "status": "Good variety; too many large components.",
    "good": "Separately seared vegetables, lean beef and a measured sauce preserve texture and variety. Protein and fibre are substantial.",
    "watch": "About 950 kcal with 200 g beef, egg, rice and many toppings. Soy, gochujang and kimchi stack sodium. Strong candidate for the same non-rice portion review; keep for a red-meat day.",
    "tl": {
      "status": "Magandang variety; maraming malalaking bahagi.",
      "good": "Hiwalay na seared na gulay, lean beef at nakasukat na sarsa para sa texture at variety. Maraming protein at fibre.",
      "watch": "Mga 950 kcal, may 200 g beef, itlog, kanin at maraming toppings. Nagsasama ang sodium ng soy, gochujang at kimchi. Dapat i-review ang non-rice portions; para sa red-meat day."
    },
    "totals": [
      947.3,
      67.5053,
      91.7548,
      35.505,
      9.797
    ]
  },
  "win-teriyaki": {
    "score": 7,
    "points": [
      2,
      2,
      1,
      1,
      1
    ],
    "status": "Useful fish dinner; glaze needs watching.",
    "good": "Salmon contributes omega-3 fats; edamame and browned greens add fibre. The current glaze is miso-soy rather than classic teriyaki.",
    "watch": "200 g salmon plus extra oils makes this energy-dense. Miso, soy and pickled ginger add sodium. Fish variety is useful, but portions and taste still need a real trial.",
    "tl": {
      "status": "Magandang fish dinner; bantayan ang glaze.",
      "good": "May omega-3 fats ang salmon; may fibre ang edamame at browned greens. Miso-soy ang glaze, hindi classic teriyaki.",
      "watch": "Energy-dense dahil sa 200 g salmon at dagdag na mantika. May sodium ang miso, soy at pickled ginger. Maganda ang fish variety, pero kailangan pang subukan ang dami at lasa."
    },
    "totals": [
      890.23,
      57.843999999999994,
      69.0148,
      42.7828,
      9.264
    ]
  },
  "win-miso": {
    "score": 6,
    "points": [
      2,
      1,
      1,
      1,
      1
    ],
    "status": "Good fish option; generous sides.",
    "good": "Salmon, roasted broccolini and a fresh cucumber side cover protein, fat quality and vegetable texture.",
    "watch": "200 g salmon plus 150 g broccolini and 180 g cucumber may feel large. Miso and soy add sodium; fibre is moderate. Do not automatically restrict healthy fish fats to chase a low-fat score.",
    "tl": {
      "status": "Magandang fish option; maraming side.",
      "good": "Salmon, roasted broccolini at fresh cucumber para sa protein, fat quality at texture ng gulay.",
      "watch": "Maaaring marami ang 200 g salmon, 150 g broccolini at 180 g cucumber. May sodium ang miso at soy; katamtaman ang fibre. Hindi awtomatikong kailangang bawasan ang fish fats para lang maging low-fat."
    },
    "totals": [
      860.9,
      54.1076,
      70.9386,
      40.685,
      7.374
    ]
  }
};
