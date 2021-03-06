const Recipe = require("../models/Recipe");
const File = require("../models/File");
const File_Recipe = require("../models/File_Recipe");
const User = require('../models/User')
const fs = require('fs')

module.exports = {
  //Website Controllers
  async home(req, res) {
    //const { filter } = req.query;
   
    let results = await Recipe.lastCreated();
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

    return res.render("main/home", { recipes: mostRecentRecipes});
  },

  async showRecipeDetails(req, res) {
    const {id} = req.params;
    let results = await Recipe.find(id);
    if (!results.rows) return res.send("Recipe not found.");
    const recipe = results.rows[0];
    
    results =  await File.all(id);
    let  image = results.rows.map(image =>({
      ...image,
      path:`${req.protocol}://${req.headers.host}${image.path.replace(/\public/g, "")}`

    }))

    //console.log(image[0].path)
    return res.render("main/receita_detalhes", {recipe, image});
  },

  sobre(req, res) {
    return res.render("main/sobre");
  },

  //Admin Controllers
  async index(req, res) {

    const user = await User.findOne({ where: { id: req.session.userId }})
 

    let { filter, page, limit } = req.query;
   
    page = page || 1;
    limit = limit || 4;
    let offset = limit * (page - 1);

    const params = {  filter,limit,offset };

    let results = await Recipe.paginate(params);
    if (results.rows == "") return res.render("admin/recipes/index_admin", {       
      error: "Recipe not found within your search."});
  
      pagination = {
      page,
      total: Math.ceil(results.rows[0].total / limit),
    };
    
    async function getRecipeImage(recipeId){      
      let results = await Recipe.file(recipeId)
      const files =  results.rows.map(file =>`${req.protocol}://${req.headers.host}${file.path.replace(/\public/g,"")}`)
      
      return files[0]
    }
    const recipesPromise = results.rows.map(async(recipe)=>{
        recipe.path = await getRecipeImage(recipe.id)
        return recipe
    })
    
    const recipes =  await Promise.all(recipesPromise)
    
    
    

    res.render("admin/recipes/index_admin", {
      recipes,
      filter,
      pagination,
      user
    });
  },

  async create(req, res) {
   
 //console.log('userId no recipe create controller',req.session.userId)
    //procurar if user is admin, if not redirect user
    const userId = req.session.userId    
    
    let results = await Recipe.allChefsSelectOne();   

    return res.render("admin/recipes/create_recipe", {
      listOfChefs: results.rows,
      userId
    });
  },

  async show(req, res) {
  
    const user = await User.findOne({ where: {id: req.session.userId}})
   
    const { id } = req.params;
    
    let results = await Recipe.find(id);
    if (!results.rows) return res.send("Recipe not found.");
    const recipe = results.rows[0];
    //console.log(recipe)

    results =  await File.all(id);
    let  images = results.rows.map(image =>({

      ...image,
      src:`${req.protocol}://${req.headers.host}${image.path.replace(/\public/g, "")}`

    }))
    //console.log(images)

    return res.render("admin/recipes/show_admin", { recipe, images, user })
  },

  async edit(req, res) {
    const { id } = req.params;   

    let results = await Recipe.find(id);
    if (!results) return res.send("Recipe not found.");
    const recipe = results.rows[0];

   

    let allChefs = await Recipe.allChefsSelectOne();

    results =  await File.all(id);    
    let images = results.rows.map(image=> ({
        ...image,
        src:`${req.protocol}://${req.headers.host}${image.path.replace(/\public/g, "")}`
                
     }))

     //console.log('req.session', req.session.userId)
     //console.log('recipe user id', recipe.user_id)
     const user = await User.findOne( { where: {id: req.session.userId}})
     
     if(recipe.user_id !== req.session.userId && user.is_admin !== true) return res.render("admin/recipes/show_admin", { 
       recipe, 
       images,
       error: 'You can only edit your recipes!'})

    return res.render("admin/recipes/edit_admin", {
      recipe,
      listOfChefs: allChefs.rows,
      images
    });
  },

  async post(req, res) {
    const keys = Object.keys(req.body);
    for (let key of keys) {
      if (req.body[key] == "") return res.send("Please fill out all fields");
     
    }

    if (req.files.length == "")
      return res.send("Please send at least one image.");
    //console.log(req.files)

    
    //console.log(req.body)
    let results = await Recipe.create(req.body);
    const recipe_id = results.rows[0].id
    //console.log('id de receita', recipe_id)

    const filesPromise = req.files.map((file) => File.create({ ...file, path: file.path.replace(/\\/g, "/") })
    );
   
    
   results =  Promise.all(filesPromise).then((files) => {

        for(n=0; n < files.length; n++ ){
            let filesArray = files[n].rows
            for (let file of filesArray){
                //.log(file.id)
                File_Recipe.create(file.id, recipe_id)
            }
        }    
    });


   return res.redirect("/admin/receitas");
  },

  async put(req, res) {
    const keys = Object.keys(req.body);
    for (let key of keys) {
      if (req.body[key] == "" && key != "removed_images_ids") {
        return res.send("Please fill in all the fields!");
      }
    }

  if(req.files.length != ""){
     //console.log(req.files)
    const filesPromise = req.files.map((file) => 
    File.create({
      ...file, 
      path: file.path.replace(/\\/g, "/") })
    );
    
    
    await Promise.all(filesPromise).then((files)=>{
      for(n=0; n < files.length; n++ ){
        let filesArray = files[n].rows
        console.log(filesArray)
        for (let file of filesArray){
            console.log(file.id)
            console.log(req.body.id)
            File_Recipe.create(file.id, req.body.id)
        }
    }    

    })

  }
  await Recipe.update(req.body);

  //Removing images from Db

  let removedImagesIds = req.body.removed_images_ids.split(",");
  console.log('removed images Ids', removedImagesIds)
  const lastIndex = removedImagesIds.length - 1;
  removedImagesIds.splice(lastIndex, 1); // array of recipe_files ids [ '22', '23'] // removing the comma ',' on the last position
  //console.log(removedImagesIds)
  const removedImagesIdsPromise = removedImagesIds.map(id =>{
    File_Recipe.delete(id)
  })
 
  await Promise.all(removedImagesIdsPromise);


   res.redirect(`/admin/receitas/${req.body.id}`);

  },

  async delete(req, res) {

    const { id } = req.body;     
     
    const allFilesPromise = await File.all(id)
    console.log(allFilesPromise)
    
    allFilesPromise.rows.map(file=>
      File.delete(file.file_id))

    allFilesPromise.rows.map(file=>
      fs.unlinkSync(file.path))
 
    await Recipe.delete(id)
   
   return res.redirect("/admin/receitas")
    
  },

  async userRecipes(req, res){

    const id = req.session.userId
    const user = await User.findOne({ where: {id}})
    
    let results = await Recipe.findIfUserRecipes(id)
    const userRecipes = results.rows
    //console.log('userRecipes', userRecipes)
    

    async function getRecipeImage(recipeId){      
      let results = await Recipe.file(recipeId)
      const files =  results.rows.map(file =>`${req.protocol}://${req.headers.host}${file.path.replace(/\public/g,"")}`)
      return files[0]
    }

    async function getRecipeChef(recipeId){       
      let results = await Recipe.recipesChef(recipeId)
      return results.rows[0].recipe_author
    }

    // pegando o resultado de userRecipes e adicionado recipe.path e recipe.recipe_author
   const resultsPromise =  userRecipes.map(async(recipe) => {      
      recipe.path = await getRecipeImage(recipe.id),
      recipe.recipe_author = await getRecipeChef(recipe.id)
      return recipe
    })
   
    const recipes = await Promise.all(resultsPromise)
    //console.log('linha 308', recipes)
       
    return res.render('admin/recipes/myrecipes_admin', {user, recipes})

  },

  not_found(req, res) {
    return res.status(404).render("not-found");
  },
};
