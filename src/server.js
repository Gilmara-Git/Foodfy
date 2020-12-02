const express = require("express")
const server = express()
const routes = require("./routes")
const nunjucks =  require("nunjucks")
const methodOverride = require("method-override")
const session = require('./config/session')


server.use(session)
server.use(express.urlencoded({extended:true} ))
server.use(express.static("public"))
server.use(methodOverride("_method"))
server.use(routes)

nunjucks.configure("src/app/views", { 
    express: server,
    autoescape:false,
    noCache:true
 })

server.set("view engine", "njk")

server.listen(5500, function(){  console.log("Foodfy server is UP") })




