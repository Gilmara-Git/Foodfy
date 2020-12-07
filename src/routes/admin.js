const express = require("express")
const routes = express.Router()
const RecipeController = require("../app/controllers/recipes")
const ChefController =  require("../app/controllers/chefs")
const UserController = require("../app/controllers/users")
const UserValidator = require('../app/validators/user')
const ProfileController = require("../app/controllers/profile")
const ProfileValidator = require('../app/validators/profile')
const { hasSessionUserId } = require('../app/middlewares/allowedUsers')
const SessionController = require("../app/controllers/session")
const SessionValidator = require('../app/validators/session')
const multer = require('../app/middlewares/multer')
 
//Admin routes - recipes
routes.get("/receitas", RecipeController.index )
routes.get("/receitas/create", RecipeController.create )
routes.get("/receitas/:id", RecipeController.show)
routes.get("/receitas/:id/edit", RecipeController.edit )
routes.post("/receitas", multer.array('photos', 5),  RecipeController.post )
routes.put("/receitas", multer.array('photos', 5), RecipeController.put )
routes.delete("/receitas", RecipeController.delete )

// // Admin routes - Chefs
routes.get("/chefs", ChefController.index)
routes.get("/chefs/create", ChefController.create)
routes.get("/chefs/:id", ChefController.show)
routes.get("/chefs/:id/edit", ChefController.edit)
routes.post("/chefs", multer.array('photos', 1), ChefController.post)
routes.put("/chefs", multer.array('photos', 1), ChefController.put)
routes.delete("/chefs", ChefController.delete)

// Admin routes - User registration
routes.get("/users/create", hasSessionUserId, UserController.create)
routes.post("/users",  UserValidator.post, UserController.post) // Cadastrar um usuario
routes.get("/users", UserController.list) // lista de usuarios cadastrados
routes.get("/users/edit", UserController.edit)
routes.put("/users", UserValidator.put, UserController.put) // editar usuarios
routes.delete("/users", UserController.delete) // deletar usuarios


//rotas de login 
routes.get("/users/login", SessionController.loginForm)
routes.post("/users/login", SessionValidator.login, SessionController.login)
routes.post("/users/logout", SessionController.logout)

//rotas de forgot password and reset password
routes.get("/users/forgot-password", SessionController.forgotForm)
routes.post("/users/forgot-password", SessionValidator.forgotPassword, SessionController.forgotPassword)
routes.get("/users/reset-password", SessionController.resetForm)
routes.post("/users/reset-password", SessionValidator.resetPassword, SessionController.resetPassword)

// rotas de perfil usuario - usuario logado
routes.get("/users/profile",hasSessionUserId, ProfileController.index) //Mostrar formulario com dados do usuario Logado
routes.put("/users/profile", hasSessionUserId, ProfileValidator.put, ProfileController.put) // Editar o usuario logado


module.exports = routes