const Chef = require("../models/Chef")
const File = require('../models/File')
const User = require('../models/User')
const fs = require('fs')
const File_Recipe = require("../models/File_Recipe")
const { allFromFiles } = require("../models/File")

module.exports = {
  async home(req, res) {
    const { filter } = req.query;

    let results = await Chef.all(filter);
    let chefs = results.rows.map((chef) => ({
      ...chef,
      path: `${req.protocol}://${req.headers.host}${chef.path.replace(
        /\public/g,
        ""
      )}`,
    }));

    return res.render("main/chefs", { chefs, filter });
  },

  async index(req, res) {

    const user = await User.findOne({ where: { id: req.session.userId }})
    

    const { filter } = req.query;

    let results = await Chef.all(filter);
    let chefs = results.rows.map((chef) => ({
      ...chef,
      path: `${req.protocol}://${req.headers.host}${chef.path.replace(
        /\public/g,
        ""
      )}`,
    }));

    return res.render("admin/chefs/index_admin", { chefs, filter, user });
  },

  async create(req, res) {
    console.log("userId no chef create controller", req.session.userId);
    //procurar if user is admin, if not redirect user
    const user = await User.findOne({ where: { id: req.session.userId } });
    console.log(user);
    // This is only for the admininstrator to create a users.
    if (user.is_admin !== true)
      return res.render("admin/profile/show-logged-user", {
        user: user,
        error: "You do not have permission to take this action!",
      });

    res.render("admin/chefs/create_chef");
  },

  async post(req, res) {
    console.log("req body ", req.body);

    try {
      const keys = Object.keys(req.body);
      for (let key of keys) {
        if (req.body[key] == "" && key != "removed_image_id")
          return res.send("Fill out all fields");
      }

      if (req.files.length == "") return res.send("Please send 1 photo.");

      const filesPromise = req.files.map((file) =>
        File.create({
          ...file,
          path: file.path.replace(/\\/g, "/"),
        })
      );

      const creatingChefImage = await Promise.all(filesPromise);
      //console.log('Linha 49', JSON.stringify(creatingChefImage, null, 2))
      const fileId = creatingChefImage.map((item) => {
        return {
          id: item.rows[0].id,
        };
      });

      console.log("linha 53 chef create", fileId[0].id);
      results = await Chef.create(req.body, fileId[0].id);
      //console.log('linha 65' , results.rows)

      return res.redirect("/admin/chefs");
    } catch (err) {
      console.error(err);
    }
  },

  async show(req, res) {
    const { id } = req.params;
    let results = await Chef.findChefsData(id); // chefs, qty_recipes, files.path
    let chef = results.rows[0];

    if (!chef) return res.send("Chef not found.");
    chef = {
      ...chef,
      path: `${req.protocol}://${req.headers.host}${chef.path.replace(
        /\public/g,
        ""
      )}`,
    };

    results = await Chef.recipesIds(id);
    const chefIdRecipeIds = results.rows.map((chefIdRecipeId) =>
      Chef.recipeJustOneImage(chefIdRecipeId)
    );

    const recipesInfo = await Promise.all(chefIdRecipeIds);
    // Este trecho de codigo abaixo, Moura Braz me ajudou
    // O resultado vem dois array e precisava pegar os valores na posicao[0] de cada array
    const recipeNameIdImage = recipesInfo.map((item) => {
      return {
        ...item.rows[0],
        path: `${req.protocol}://${req.headers.host}${item.rows[0].path.replace(
          "public",
          ""
        )}`,
      };
    });

    return res.render("admin/chefs/show_admin", {
      chef,
      recipes: recipeNameIdImage,
    });
  },

  async edit(req, res) {
    const user = await User.findOne({ where: { id: req.session.userId } });
    console.log(user);
    // This is only for the admininstrator to create a users.
    if (user.is_admin !== true)
      return res.render("admin/profile/show-logged-user", {
        user: user,
        error: "You do not have permission to take this action!",
      });

    const { id } = req.params;
    const results = await Chef.findChefsData(id);

    let chefToBeEdited = results.rows[0];
    chefToBeEdited = {
      ...chefToBeEdited,
      path: `${req.protocol}://${req.headers.host}${chefToBeEdited.path.replace(
        /\public/g,
        ""
      )}`,
    };

    console.log(chefToBeEdited);
    res.render("admin/chefs/edit_admin", { chef: chefToBeEdited });
  },

  async put(req, res) {
    const keys = Object.keys(req.body);
    for (let key of keys) {
      if (req.body[key] == "" && key !== "removed_image_id")
        return res.send("Fill out all fields");
    }

    if (req.files.length !== "") {
      const newChefImagePromise = req.files.map((file) =>
        File.update(
          {
            ...file,
            path: file.path.replace(/\\/g, "/"),
          },
          req.body.removed_image_id
        )
      );

      await Promise.all(newChefImagePromise);
      //console.log('Linha 126', JSON.stringify(updateChefImage, null, 2))
    }
    await Chef.update(req.body);

    return res.redirect("/admin/chefs");
  },

  async delete(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.session.userId } });
      //console.log(user)
      // This is only for the admininstrator to create a users.
      if (user.is_admin !== true)
        return res.render("admin/profile/show-logged-user", {
          user: user,
          error: "You do not have permission to take this action!",
        });

      const { id } = req.body;

      //verify if chef has recipes
      let results = await Chef.verifyIfChefHasRecipes(id);
      const chefIdRecipes = results.rows;
      console.log("chefs recipes", chefIdRecipes);

      const filePromise = chefIdRecipes.map((recipe) => {
        return File.all(recipe.id);
      });

      let promiseResults = await Promise.all(filePromise);
      console.log(JSON.stringify(promiseResults, null, 2))

      promiseResults.map(results =>
        results.rows.map(file => File.delete(file.file_id))
      );

      promiseResults.map(results =>
        results.rows.map(file => fs.unlinkSync(file.path))
      );


      let result = await File.getChefImageId(id);
      const chefImage = result.rows[0];

      result = await File.allFromFiles(chefImage.file_id);

      const imagePath = result.rows[0].path;

      await File.delete(chefImage.file_id); // This deletes chefs in CASCADE/ Which deletes recipes in CASCADE
      fs.unlinkSync(imagePath);

      
      return res.redirect("/admin/chefs");
      
    } catch (err) {
      console.error(err);
    }
  },
};