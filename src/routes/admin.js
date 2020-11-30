const express = require("express")
const routes = express.Router()
const recipes = require("../app/controllers/recipes")
const chefs =  require("../app/controllers/chefs")
const multer = require('../app/middlewares/multer')
 
//Admin routes - recipes
routes.get("/receitas", recipes.index )
routes.get("/receitas/create", recipes.create )
routes.get("/receitas/:id", recipes.show)
routes.get("/receitas/:id/edit", recipes.edit )
routes.post("/receitas", multer.array('photos', 5),  recipes.post )
routes.put("/receitas", multer.array('photos', 5), recipes.put )
routes.delete("/receitas", recipes.delete )

// // Admin routes - Chefs
routes.get("/chefs", chefs.index)
routes.get("/chefs/create", chefs.create)
routes.get("/chefs/:id", chefs.show)
routes.get("/chefs/:id/edit", chefs.edit)
routes.post("/chefs", multer.array('photos', 1), chefs.post)
routes.put("/chefs", multer.array('photos', 1), chefs.put)
routes.delete("/chefs", chefs.delete)

// User registration routes
// routes.post("/users", UserController.post) // Cadastrar um usuario
// routes.get("/users", UserController.list) // lista de usuarios cadastrados
// routes.put("/users", UserController.put) // editar usuarios
// routes.delete(/users", UserControlller.delete) // deletar usuarios


// rotas de perfil de um usuario Logado
// routes.get("/profile", ProfileController.index) //Mostrar formulario com dados do usuario Logado
// routes.put("/profile", ProfileController.put) // Editar o usuario logado

module.exports = routes