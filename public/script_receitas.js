
const cards = document.querySelectorAll(".card")

for (let card of cards) {
    card.addEventListener("click", function () {
        const recipeId = card.getAttribute("id")
        window.location.href = `/receitas/${recipeId}`;


    })
}


logoImgWebPage = document.querySelector(".links-top img#logo")
logoImgWebPage.onclick = function goToHomePage() {
    window.location.href = "/"
}





//Buttons show and hide on page recipe details - Ingredients

document.querySelector("div#ingredients .button-hide").addEventListener("click", function () {

    document.querySelector("div#ingredients .button-hide").classList.add("active")
    document.querySelector("div#ingredients .button-show").classList.add("active")
    document.querySelector(".more-details-ing").classList.add("active")
})

document.querySelector("div#ingredients .button-show").addEventListener("click", function () {

    document.querySelector("div#ingredients .button-show").classList.remove("active")
    document.querySelector("div#ingredients .button-hide").classList.remove("active")
    document.querySelector(".more-details-ing").classList.remove("active")
})


//Buttons show and hide on page recipe details - Preparation

document.querySelector("div#preparation .button-hide").addEventListener("click", function () {

    document.querySelector("div#preparation .button-hide").classList.add("active")
    document.querySelector("div#preparation .button-show").classList.add("active")
    document.querySelector(".more-details-prep").classList.add("active")

})

document.querySelector("div#preparation .button-show").addEventListener("click", function () {

    document.querySelector("div#preparation .button-show").classList.remove("active")
    document.querySelector("div#preparation .button-hide").classList.remove("active")
    document.querySelector(".more-details-prep").classList.remove("active")

})


//Buttons show and hide on page recipe details - Additional information 
document.querySelector("div#add-info .button-hide").addEventListener("click", function () {

    document.querySelector("div#add-info .button-hide").classList.add("active")
    document.querySelector(".more-details-info").classList.add("active")
    document.querySelector("div#add-info .button-show").classList.add("active")
})

document.querySelector("div#add-info .button-show").addEventListener("click", function () {

    document.querySelector("div#add-info .button-show").classList.remove("active")
    document.querySelector("div#add-info .button-hide").classList.remove("active")
    document.querySelector(".more-details-info").classList.remove("active")

})








