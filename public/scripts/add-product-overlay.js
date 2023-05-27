const addProductBtn = document.querySelector("#new-prod button");
const cancelBtns = document.querySelectorAll(".cancel-prod");
const proceedBtns = document.querySelectorAll(".proceed .btn");
const backBtns = document.querySelectorAll(".proceed .back-prod");

const addProductOverlay = document.querySelector("#add-product-overlay");

const steps = document.querySelectorAll(".steps");

function addProduct(event) {
  addProductOverlay.style.display = "block";
  steps[0].style.display = "flex";
}

addProductBtn.addEventListener("click", addProduct);

for (const cancelBtn of cancelBtns) {
  cancelBtn.addEventListener("click", (event) => {
    event.preventDefault();
    addProductOverlay.style.display = "none";
    steps[0].style.display = "none";
    steps[1].style.display = "none";
    steps[2].style.display = "none";
    steps[3].style.display = "none";
    steps[4].style.display = "none";
  });
}

for (const proceedBtn of proceedBtns) {
  proceedBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const currentStep = event.target.parentElement.parentElement;
    const nextStep = currentStep.nextElementSibling;
    currentStep.style.display = "none";
    nextStep.style.display = "flex";
  });
}

for (const backBtn of backBtns) {
  backBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const currentStep = event.target.parentElement.parentElement;
    const previousStep = currentStep.previousElementSibling;
    currentStep.style.display = "none";
    previousStep.style.display = "flex";
  });
}
