
const express = require("express")
const routes = express.Router()
const recipes = require("./app/controllers/recipes")
const searchRecipes = require("./app/controllers/searchRecipes")
const chefs =  require("./app/controllers/chefs")
const multer = require('./app/middlewares/multer')


//website routes
routes.get("/receitas/search", searchRecipes.index)
routes.get("/receitas", recipes.home)
routes.get("/", recipes.home )
routes.get("/sobre", recipes.sobre)
routes.get("/receitas/:id", recipes.showRecipeDetails)
 
//Admin routes - recipes
routes.get("/admin/receitas", recipes.index )
routes.get("/admin/receitas/create", recipes.create )
routes.get("/admin/receitas/:id", recipes.show)
routes.get("/admin/receitas/:id/edit", recipes.edit )

routes.post("/admin/receitas", multer.array('photos', 5),  recipes.post )
routes.put("/admin/receitas", multer.array('photos', 5), recipes.put )

routes.delete("/admin/receitas", recipes.delete )

// Admin routes - Chefs
routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:id", chefs.show)
routes.get("/admin/chefs/:id/edit", chefs.edit)

routes.post("/admin/chefs", multer.array('photos', 1), chefs.post)
routes.put("/admin/chefs", multer.array('photos', 1), chefs.put)

routes.delete("/admin/chefs", chefs.delete)


//Route not found that redirects user to Home Page
routes.use(recipes.not_found)


module.exports = routes