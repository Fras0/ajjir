const addMoneyElement = document.getElementById("add-money");
const moneyOverlay = document.getElementById("money-overlay");
const closeMoneyOverlay = document.getElementById("cancel-overlay");
const addMoneyBtn = document.getElementById("add-money-btn");
const formElement = document.querySelector(".money-container");
const moneyInput = document.getElementById("money-input");

addMoneyElement.addEventListener("click", (event) => {
  event.preventDefault();
  moneyOverlay.style.display = "block";
});

closeMoneyOverlay.addEventListener("click", (event) => {
  event.preventDefault();
  moneyOverlay.style.display = "none";
});

addMoneyBtn.addEventListener("click", (event) => {
  console.log(moneyInput.value);
  formElement.setAttribute("action", `/add-money/${moneyInput.value}`);
})
