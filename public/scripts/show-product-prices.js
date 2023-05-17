let pricesElements = document.querySelectorAll(".product-prices ul li");

function togglePrices(event) {
  for (const pricesElement of pricesElements) {
    if (event.target.classList.value === "checked") {
      continue;
    }
    pricesElement.classList.remove("checked");
  }
  if (event.target.tagName.toLowerCase() === 'li') {
    event.target.classList.toggle("checked"); 
  } else {
    event.target.parentElement.classList.toggle("checked");
  }
}

for (const pricesElement of pricesElements) {
  pricesElement.addEventListener("click", togglePrices);
}


const scrollContainer = document.querySelector("#products-grid");

scrollContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
});

