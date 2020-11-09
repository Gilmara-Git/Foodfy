const { findChefsRecipes } = require("../models/Chef")
const Chef = require("../models/Chef")
const File = require('../models/File')

module.exports = { 

async index(req, res){
    
    const  {  filter } = req.query
    //console.log(filter)

   let results = await Chef.all(filter)
   let chefs = results.rows.map((chef) => ({

        ...chef,
        path: `${req.protocol}://${req.headers.host}${chef.path.replace(/\public/g, "")}`
   }))
        //console.log(chefs)
    
    return res.render('admin/chefs/index_admin', {chefs, filter})

 },

create(req,res) {

    res.render("admin/chefs/create_chef")
}, 

async post(req, res) {
    
    const keys = Object.keys(req.body)
    for(let key of keys) {
        if (req.body[key] == "") return res.send("Fill out all fields")
      
    }
 
    if(req.files.length == "") return res.send('Please send at least 1 photo.') 

     const filesPromise = req.files.map((file) => File.create({
         ...file,
         path: file.path.replace(/\\/g, "/")

     }))

      await Promise.all(filesPromise).then((files)=>{

        for(n=0; n< files.length; n++){
            const fileIdsArray = files[n].rows
            for (file of fileIdsArray){
                console.log(file.id)
             Chef.create(req.body, file.id)
            }
        }
     })
     
         
    return res.redirect("/admin/chefs")

   
}, 

async show(req, res) {

const{ id } = req.params

let results = await Chef.findChefsData(id) // chefs, qty_recipes, files.path
let chef =  results.rows[0]

if(!chef) return res.send('Recipe not found.')

chef = {
    ...chef,
    image: `${req.protocol}://${req.headers.host}${chef.path.replace(/\public/g, "")}`
}

results =  await Chef.findAllChefRecipes(id)
const recipes = results.rows
//console.log(recipes)

results = await Chef.findChefRecipesData(id)


let chefRecipesImages = results.rows.map(chefRecipesImage=>({

    ...chefRecipesImage,
    image: `${req.protocol}://${req.headers.host}${chefRecipesImage.path.replace(/\public/g, "")}`

}))

console.log(chefRecipesImages)
console.log(chefRecipesImages[0].image)
console.log(chefRecipesImages.image)


// for (x=0; x < chefRecipesImages.length; x++){

//     if(x == 0 ) {
//     const images   = chefRecipesImages[0].image 
//     const recipeId = chefRecipesImages[0].recipe_id
//     const index  =  chefRecipesImages.indexOf(images)
//     console.log(recipeId)
//     console.log(images)
//     console.log(index)
//     }

    

    
// }

   

return res.render("admin/chefs/show_admin", { chef, recipes, chefRecipesImages })
    
},

edit(req, res) {
    
    const { id } = req.params
  
    Chef.find(id, function(chef){

        res.render("admin/chefs/edit_admin", { chef })

    })
}, 

put(req, res) {
    const key = Object.keys(req.body)
        if(req.body[key]=="") res.send("Please fill out the fields.")  

        //console.log(req.body)
        Chef.update(req.body, function(){

           return res.redirect("/admin/chefs")

        })
    }, 

   delete(req, res) {

    console.log(req.body.id)

    Chef.verifyIfChefHasRecipes(req.body.id, function(chefIdRecipes){
         console.log(chefIdRecipes)
                 

         if(!chefIdRecipes)   
        
         Chef.delete(req.body.id, function(){

             return  res.redirect("/admin/chefs")
         
    
          })

        if(chefIdRecipes) { 
            
            return res.send("Chef cannot be deleted as there is recipes tied to his record.")      
        }
        })
    
        }
    
    
}
  
