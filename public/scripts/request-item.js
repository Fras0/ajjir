const userBalane = +document
  .querySelector("#add-money span")
  .innerText.split(" ")[0];
// const moneyOverlay = document.getElementById("money-overlay");
// const moneyInput = document.getElementById("money-input");

let submitButton = document.getElementById("submit-btn");
let daysElement = document.getElementById("days");
let totalElement = document.getElementById("total");
let startDateInputElement = document.getElementById("start-date-input");
let endDateInputElement = document.getElementById("end-date-input");

let pricesElements = document.querySelectorAll(".product-prices ul li");
let totalPrice;

let pricePerDay = +pricesElements[0].children[0].innerText;
let pricePerWeek = +pricesElements[1].children[0].innerText;
let pricePerMonth = +pricesElements[2].children[0].innerText;
let pricePerYear = +pricesElements[3].children[0].innerText;

let numberOfDays;
let numberOfWeeks;
let numberOfMonths;
let numberOfYears;

let startDateString = document.getElementById("start-date-string");
let endDateString = document.getElementById("end-date-string");

const dateString = new Date().toISOString().split("T")[0] + `T00:00`;
let startDateElement = document.querySelector("#start-date");
startDateElement.value = dateString;
let endDateElement = document.querySelector("#end-date");

let summaryElements = document.querySelectorAll("#price-summary div span");

function getDiff(event) {
  startDateString.innerText = "";
  endDateString.innerText = "";
  startDateString.innerText = startDateElement.value;
  endDateString.innerText = endDateElement.value;
  let dateDiff = Math.abs(
    new Date(endDateElement.value.split("T")[0].replaceAll("-", "/")) -
      new Date(startDateElement.value.split("T")[0].replaceAll("-", "/"))
  );
  numberOfDays = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
  numberOfWeeks = Math.floor(numberOfDays / 7);
  numberOfMonths = Math.floor(numberOfDays / 30);
  numberOfYears = Math.floor(numberOfDays / 365);

  totalPrice =
    numberOfYears * pricePerYear +
    numberOfMonths * pricePerMonth +
    numberOfWeeks * pricePerWeek +
    numberOfDays * pricePerDay +
    5 +
    5;
  summaryElements[0].innerText = totalPrice - 10;
  summaryElements[3].innerText = totalPrice;

  daysElement.value = numberOfDays;
  totalElement.value = totalPrice;
  startDateInputElement.value = startDateElement.value;
  endDateInputElement.value = endDateElement.value;
  // 5 * 0.1 * (numberOfDays - 1)
}

endDateElement.addEventListener("change", getDiff);
startDateElement.addEventListener("change", getDiff);

function togglePrices(event) {
  for (const pricesElement of pricesElements) {
    if (event.target.classList.value === "checked") {
      continue;
    }
    pricesElement.classList.remove("checked");
  }
  if (event.target.tagName.toLowerCase() === "li") {
    event.target.classList.toggle("checked");
    // totalPrice = event.target.firstElementChild.innerText;
    // console.log(event.target.lastElementChild.innerText);
  } else {
    event.target.parentElement.classList.toggle("checked");
    // totalPrice = event.target.parentElement.firstElementChild.innerText;
    // console.log(event.target.parentElement.lastElementChild.innerText);
  }
}

async function sendRequest(event) {
  if (userBalane < totalPrice) {
    event.preventDefault();
    moneyOverlay.style.display = "block";
    moneyOverlay.firstElementChild.insertBefore(
      document.createElement("p"),
      moneyOverlay.firstElementChild.firstElementChild
    ).innerText = "You don't have enough money";
    moneyInput.value = totalPrice - userBalane;
  }
}

for (const pricesElement of pricesElements) {
  pricesElement.addEventListener("click", togglePrices);
}

submitButton.addEventListener("click", sendRequest);
