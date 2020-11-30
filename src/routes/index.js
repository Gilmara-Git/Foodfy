
const express = require("express")
const routes = express.Router()
const recipes = require("../app/controllers/recipes")
const searchRecipes = require("../app/controllers/searchRecipes")
const admin =  require("./admin")



//Main website routes
routes.get("/receitas/search", searchRecipes.index)
routes.get("/receitas", recipes.home)
routes.get("/", recipes.home )
routes.get("/sobre", recipes.sobre)
routes.get("/receitas/:id", recipes.showRecipeDetails)

// Admin routes - Recipes/Chefs/User
routes.use("/admin", admin)

//Route not found that redirects user to Home Page
routes.use(recipes.not_found)


module.exports = routes