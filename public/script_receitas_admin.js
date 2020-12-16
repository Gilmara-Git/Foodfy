

// logoImgAdmin = document.querySelector(".header-foodfy-admin img#logo-foodfy-admin")
// logoImgAdmin.onclick = function goToHomePage() {
//   window.location.href = "/"
// }

//Show link active as GREEN

const verifyCurrentPageActive = window.location.pathname
menuLinks = document.querySelectorAll(".menu-links a")
console.log(menuLinks)
for (let menu of menuLinks) {
pageHref = menu.getAttribute("href")

  if(verifyCurrentPageActive.includes(pageHref)) { 
    menu.classList.add("active")
    console.log(pageHref)
  }

}

// Adding new fields for ingredients (Form)
addIngredButton = document.querySelector("#new-ingredients")
addIngredButton.onclick = function addIngredient() {
  const ingredients = document.querySelector("#ingredients-fields")
  const ingredientsfield = document.querySelectorAll(".ingredient-field")
  const newIngredField = ingredientsfield[ingredientsfield.length - 1].cloneNode(true)

  if (newIngredField.children[0].value == "") return false;

  newIngredField.children[0].value = "";
  ingredients.appendChild(newIngredField);

}


//Adding new fields for Steps (Form)
addStepsButton = document.querySelector("#new-steps")
addStepsButton.onclick = function () {

  const steps = document.querySelector("#steps-fields")
  const stepsfield = document.querySelectorAll(".step-field")
  const newstepfield = stepsfield[stepsfield.length - 1].cloneNode(true) //getting the last class with input

  if (newstepfield.children[0].value == "") return false; //adding a newstefield only if value != 0

  newstepfield.children[0].value = ""; // clearing newstepfield field before appending it to the steps
  steps.appendChild(newstepfield)

}






// Direct user to home page when clicking on Foodfy logo in the header




