const Recipe = require("../models/Recipe")
module.exports = {

   async index(req,res) {
    const { filter } = req.query;

    if(!filter) return res.redirect("/")
    let results = await Recipe.mostUpdated(filter);
   
    if (results.rows == "") return res.render("not-found");

    //console.log('linha 13', results.rows)
    // this functions is to get only one image
    
 
    async function getRecipeImage(recipeId){
        let results = await Recipe.file(recipeId)
        const files =  results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace(/\public/g, "")}` )
        return files[0]
    }

  const recipesPromise = results.rows.map(async recipe=>{
    
    recipe.image = await getRecipeImage(recipe.id)
    return recipe
  })
  const mostRecentRecipes = await Promise.all(recipesPromise)
  //console.log(mostRecentRecipes.length)

  const search = { 

    term: req.query.filter,
    total: mostRecentRecipes.length
}


    return res.render("search/index", { recipes : mostRecentRecipes, search})

    }
}