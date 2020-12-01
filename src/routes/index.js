
const express = require("express")
const routes = express.Router()
const RecipeController = require("../app/controllers/recipes")
const searchRecipesController = require("../app/controllers/searchRecipes")
const admin =  require("./admin")



//Main website routes
routes.get("/receitas/search", searchRecipesController.index)
routes.get("/receitas", RecipeController.home)
routes.get("/", RecipeController.home )
routes.get("/sobre", RecipeController.sobre)
routes.get("/receitas/:id", RecipeController.showRecipeDetails)

// Admin routes - Recipes/Chefs/User
routes.use("/admin", admin)

//Route not found that redirects user to Home Page
routes.use(RecipeController.not_found)


module.exports = routes