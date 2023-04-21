const inputElements = document.querySelectorAll("form p input");
const formElement = document.querySelector("form");
const googleBtnElement = document.querySelector(".google-btn");

function loginWithGoogle() {
  for (const inputElement of inputElements) {
    inputElement.removeAttribute("required");
  }
  formElement.setAttribute("action", "/google");
  formElement.setAttribute("method", "GET");
}

googleBtnElement.addEventListener("click", loginWithGoogle);
