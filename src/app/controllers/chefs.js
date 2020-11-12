const Chef = require("../models/Chef")
const File = require('../models/File')

module.exports = { 

async index(req, res){
    
    const  {  filter } = req.query
    
   let results = await Chef.all(filter)
   let chefs = results.rows.map((chef) => ({

        ...chef,
        path: `${req.protocol}://${req.headers.host}${chef.path.replace(/\public/g, "")}`
   }))
            
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


    const creatingChefImage = await Promise.all(filesPromise)  
    //console.log('Linha 49', JSON.stringify(creatingChefImage, null, 2))
    const fileId = creatingChefImage.map((item)=>{
               return  {
                   
               id: item.rows[0].id 

               }
    });   
    
results = await Chef.create(req.body, fileId[0].id)
//console.log('linha 65' , results.rows)

         
    return res.redirect("/admin/chefs")

   
}, 

async show(req, res) {

const{ id } = req.params
let results = await Chef.findChefsData(id) // chefs, qty_recipes, files.path
let chef =  results.rows[0]

if(!chef) return res.send('Chef not found.')
chef = {
    ...chef,
    path: `${req.protocol}://${req.headers.host}${chef.path.replace(/\public/g, "")}`
}

results = await Chef.recipesIds(id)
const chefIdRecipeIds =  results.rows.map(chefIdRecipeId => Chef.recipeJustOneImage(chefIdRecipeId))

const recipesInfo = await Promise.all(chefIdRecipeIds)
const recipeNameIdImage = recipesInfo.map(item=>{
    return {
        ...item.rows[0], 
        path:  `${req.protocol}://${req.headers.host}${item.rows[0].path.replace('public', '')}`,
        
}
});

return res.render("admin/chefs/show_admin", { chef, recipes:recipeNameIdImage})
    
},

async edit(req, res) {
    
const { id } = req.params;  
const results = await Chef.findChefsData(id);

let chefToBeEdited = results.rows[0];
chefToBeEdited = {
    ...chefToBeEdited,
    path: `${req.protocol}://${req.headers.host}${chefToBeEdited.path.replace(/\public/g, "")}`
}

res.render("admin/chefs/edit_admin", { chefToBeEdited })
    
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
  
