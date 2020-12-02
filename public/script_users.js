// Actions if user wants to cancel user cretion
function cancelUserCreation(event){

    const confirmCancelation = confirm('Do you want to cancel this user creation ?')
    if(confirmCancelation)
    event.preventDefault();
    const nameField = document.getElementById('name')
    const emailField = document.getElementById('email')
    const is_adminField = document.getElementById('is_admin')

    nameField.value =""
    emailField.value = ""
    is_adminField.checked = false

    // console.log(nameField.value)
    // console.log(emailField.value)
    // console.log(is_adminField.value)
}


// Email format validation
const Validate = {
  apply(input, func) {

    Validate.clearErrorMessage(input)

    let results = Validate[func](input.value);
    input.value = results.value;

    if (results.error) Validate.displayError(input, results.error);
    //console.log(results.error)
    
  },

  clearErrorMessage(input){
    // this does not permit the error message to repeat on front end
    const errorMessageDiv  = input.parentNode.querySelector('.error')

    if(errorMessageDiv){
        errorMessageDiv.remove()
    }

  },

  emailFormat(value) {
    let error = null;
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    //console.log(value);

    if (!value.match(mailFormat)) error = " Invalid Email format!";

    return {
      error,
      value,
    };
  },

  displayError(input, error) {
    const div = document.createElement("div");
    div.classList.add("error");
    div.innerHTML = error;
    input.parentNode.appendChild(div);
    //console.log(input.parentNode)
    input.focus()
  },
};
