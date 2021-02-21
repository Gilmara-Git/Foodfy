const faker = require("faker");
const { hash } = require("bcryptjs");
const Chef = require("./src/app/models/Chef");
const User = require("./src/app/models/User");
const Recipe = require("./src/app/models/Recipe");
const File = require("./src/app/models/File");
const File_Recipe = require("./src/app/models/File_Recipe");

//users
let users = [],
  userIds = [];

const totalUsers = 3;
const is_admin = ["true", "false"];

//chefs

let chefFiles = [],
  chefsIds = [];
const totalChefs = 3;

//Recipes
let recipeFiles = [],
  recipes = [];
const totalRecipes = 3;

async function createUsersChefsRecipes() {
  while (users.length < totalUsers) {
    let password = await hash("111", 8);

    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
      is_admin: is_admin[Math.floor(Math.random() * is_admin.length)],
    });
  }
  const usersPromise = users.map((user) => User.create(user));
  userIds = await Promise.all(usersPromise);

  //creating chef
  while (chefFiles.length < totalChefs) {
    chefFiles.push({
      filename: faker.image.image(),
      path: "public/images/placeholder.png",
    });
  }

  let filesPromise = chefFiles.map((file) => File.create(file));

  let results = await Promise.all(filesPromise);
  //console.log('filedId tentando ver o id',JSON.stringify(results, null, 2))
  const fileIds = results.map((file) => {
    return {
      file_id: file.rows[0].id,
    };
  });

  const chefsPromise = fileIds.map((fileId) =>
    Chef.create(
      {
        chef_name: faker.name.firstName(),
      },
      fileId.file_id
    )
  );

  results = await Promise.all(chefsPromise);

  chefsIds = results.map((chef) => chef.rows[0].id);

  //creating recipes
  //create fileRecipes
  while (recipeFiles.length < totalRecipes) {
    recipeFiles.push({
      filename: faker.image.image(),
      path: "public/images/placeholder.png",
    });
  }

  filesPromise = recipeFiles.map((file) => File.create(file));

  results = await Promise.all(filesPromise);

  recipeFiles = results.map((file) => file.rows[0].id);
  //console.log("images receitas", recipeFiles);

  //create Recipes
  while (recipes.length < totalRecipes) {
    recipes.push({
      user_id: userIds[Math.floor(Math.random() * totalUsers)],
      recipe_title: faker.name.title() || "qualquer nome",
      add_information: faker.lorem.paragraph(Math.ceil(Math.random() * 1)),
      recipe_author_id: chefsIds[Math.floor(Math.random() * totalChefs)],
      steps: [faker.lorem.paragraph(Math.ceil(Math.random() * 1))],
      ingredients: [faker.lorem.paragraph(Math.ceil(Math.random() * 1))],
    });
  }

  const recipesPromise = recipes.map((recipe) => Recipe.create(recipe));
  results = await Promise.all(recipesPromise);
  const recipeIds = results.map((recipe) => recipe.rows[0].id);

  //console.log("Ver os Ids de receitas", recipeIds);

  // created recipe_files

  const recipe_filesPromise = recipeFiles.map((fileId) => {
    recipeIds.map((recipeId) => {
      File_Recipe.create(fileId, recipeId);
    });
  });

  const recipe_filesId = await Promise.all(recipe_filesPromise);
}

function init() {
  createUsersChefsRecipes();
  // createChefs()
  // createRecipes()
}

init();
