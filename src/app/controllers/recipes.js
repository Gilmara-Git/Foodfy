const Recipe = require("../models/Recipe");
const File = require("../models/File");
const File_Recipe = require("../models/File_Recipe");

module.exports = {
  //Website Controllers
  async home(req, res) {
    const { filter } = req.query;
   
    let results = await Recipe.all(filter);

    if (results.rows == "") return res.render("not-found");

    return res.render("main/home", { foundRecipes: results.rows });
  },

  async showRecipeDetails(req, res) {
    const recipeIndex = req.params.index;
    
    await Recipe.find(recipeIndex);
    return res.render("main/receita_detalhes", { details: recipeIndex });
  },

  sobre(req, res) {
    return res.render("main/sobre");
  },

  //Admin Controllers
  async index(req, res) {
    let { filter, page, limit } = req.query;
   
    page = page || 1;
    limit = limit || 2;
    let offset = limit * (page - 1);

    const params = {
      filter,
      limit,
      offset,
    };

    let results = await Recipe.paginate(params);
    if (results.rows == "") return res.render("Recipe not-found");
    console.log(results.rows)
    
    pagination = {
      page,
      total: Math.ceil(results.rows[0].total / limit),
    };

    res.render("admin/recipes/index_admin", {
      recipes: results.rows,
      filter,
      pagination,
    });
  },

  async create(req, res) {
    let results = await Recipe.allChefsSelectOne();
   

    return res.render("admin/recipes/create_recipe", {
      listOfChefs: results.rows,
    });
  },

  async show(req, res) {
    const { index } = req.params;
    console.log(index)

    let results = await Recipe.find(index);
    if (!results.rows) return res.send("Recipe not found.");
    const recipe = results.rows[0];
    //console.log(recipe)

    results =  await File.all(index);
    let  images = results.rows.map(image =>({

      ...image,
      src:`${req.protocol}://${req.headers.host}${image.path.replace(/\public/g, "")}`

    }))
    console.log(images)

    return res.render("admin/recipes/show_admin", { recipe, images })
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

    let results = await Recipe.create(req.body);
    const recipe_id = results.rows[0].id
    //console.log(recipe_id)

    const filesPromise = req.files.map((file) => File.create({ ...file, path: file.path.replace(/\\/g, "/") })
    );

  

    await Promise.all(filesPromise).then((files) => {

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
    console.log(req.files)
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
  const lastIndex = removedImagesIds.length - 1;
  removedImagesIds.splice(lastIndex, 1); // array of recipe_files ids [ '22', '23']
  //console.log(removedImagesIds)
  const removedImagesIdsPromise = removedImagesIds.map(id =>{
    File_Recipe.delete(id)
  })
 
  await Promise.all(removedImagesIdsPromise);


   res.redirect(`/admin/receitas/${req.body.id}`);

  },

  async delete(req, res) {
    const { id } = req.body;
   

   let results = await File_Recipe.find(id) 
   const isThereFiles = results.rows
      if(isThereFiles==""){        
        await Recipe.delete(id)

      }else {
      return res.send('If you are sure you want to remove this recipe, you need to delete its images before deleting the recipe.Click the left arrow to return. Delete the image and click SAVE. Then you can delete the recipe.')

      }

   
   return res.redirect("/admin/receitas")
    
  },

  not_found(req, res) {
    return res.status(404).render("not-found");
  },
};
