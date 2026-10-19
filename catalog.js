/* Small, shared catalogue rules; no storage or UI side effects. */
(function(root){
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  function ingredientRows(ingredients){
    return (ingredients || []).flatMap((group,g) => (group && Array.isArray(group.items) ? group.items : [group]).map((text,i) => ({text:String(text || ''), key:g+':'+i})));
  }
  function matches(recipe, query){
    const words=normalize(query).split(' ').filter(Boolean);
    const haystack=normalize([recipe.title,recipe.subtitle,recipe.cuisine,recipe.category,
      ...ingredientRows(recipe.ingredients).map(x=>x.text), ...ingredientRows(recipe.tl?.ingredients).map(x=>x.text)].join(' '));
    return words.every(word=>haystack.includes(word));
  }
  function filter(recipes, options={}, saved=[]){
    return recipes.filter(r => (!options.saved || saved.includes(r.id))
      && (!options.category || r.category===options.category)
      && (!options.cuisine || r.cuisine===options.cuisine)
      && matches(r, options.query));
  }
  function aisle(text){
    const s=normalize(text).split(/\bfor\b/)[0].trim();
    if(/\b(sauce|oil|vinegar|stock|paste|powder|salt|sugar|rice|honey|cornstarch)\b/.test(s)) return 'pantry';
    if(/\b(chicken|beef|lamb|salmon|fish|hammour|bass|grouper|cod|egg|eggs|tofu|sirloin|shrimp|prawn|prawns)\b/.test(s)) return 'protein';
    if(/onion|garlic|ginger|tomato|cucumber|spinach|cabbage|carrot|eggplant|broccoli|bean|sprout|lemon|lime|parsley|cilantro|coriander|mint|dill|basil|chili|scallion|avocado|cauliflower|zucchini|courgette|celery|sweetcorn|pomegranate|lettuce|mushroom|potato|pear|apple|shallot|leaves|herb|lemongrass/.test(s)) return 'produce';
    return 'pantry';
  }
  function shopping(recipes, ids, lang='en'){
    // Preserve each recipe's exact quantities. Similar lines are not silently deduplicated.
    return recipes.filter(r=>ids.includes(r.id)).flatMap(r=>{
      const english=ingredientRows(r.ingredients);
      const translated=lang==='tl' && r.tl?.ingredients ? ingredientRows(r.tl.ingredients) : english;
      return translated.flatMap((row,i)=>{
        const source=english[i]?.text || row.text;
        // These are preparation notes in the existing ingredient blocks, not things to buy.
        if(/^(Pat completely dry|Split in half|Marinate overnight|Pink peppercorns are|You'll lose)/i.test(source)) return [];
        return [{key:r.id+':'+row.key,recipeId:r.id,title:r.title,text:row.text,aisle:aisle(source)}];
      });
    });
  }
  function reconcileChecks(state,recipes){
    // Reordered instructions must not inherit ticks for different steps/ingredients.
    state.recipeCheckRevisions=state.recipeCheckRevisions||{};
    for(const r of recipes){
      if(!r.checkRevision||state.recipeCheckRevisions[r.id]===r.checkRevision)continue;
      if(state.checks)delete state.checks[r.id];
      for(const key of Object.keys(state.shop||{}))if(key.startsWith('recipe:'+r.id+':'))delete state.shop[key];
      state.recipeCheckRevisions[r.id]=r.checkRevision;
    }
  }
  const api={normalize,matches,filter,ingredientRows,shopping,reconcileChecks};
  root.TableCatalog=api;
  if(typeof module!=='undefined') module.exports=api;
})(globalThis);
