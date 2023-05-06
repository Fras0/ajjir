let search = "";
const categories = [];
const stats = [];
let price;
// var url = new URL("http://localhost:3000/products?categories=&status=&search=");

let formForSearchElement = document.getElementById("search-form");
let categoriesElements = document.querySelectorAll("#categories ul li");
let pricesElements = document.querySelectorAll("#price ul li");
let statusElements = document.querySelectorAll("#status label input");

const queryString = window.location.search;

if (queryString) {
  let oldcategories;
  let oldstats;
  let oldPrice;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.get("search")) {
    // formForSearchElement.firstElementChild.value = urlParams.get("search");
  }

  if (urlParams.get("categories")) {
    oldcategories = urlParams.get("categories").toString().split(",");

    for (const catElement of categoriesElements) {
      categoryTextContent = catElement.textContent.toLowerCase();
      if (oldcategories.includes(categoryTextContent)) {
        catElement.classList.add("checked");
        categories.push(categoryTextContent);
      }
    }
  }

  if (urlParams.get("status")) {
    oldstats = urlParams.get("status").toString().split(",");
    for (const statElement of statusElements) {
      statTextContent = statElement.parentElement.textContent
        .trim()
        .toLowerCase();
      if (oldstats.includes(statTextContent)) {
        statElement.checked = true;
        stats.push(statTextContent);
      }
    }
  }

  if (urlParams.get("price")) {
    oldPrice = urlParams.get("price").toString();

    for (const priceElement of pricesElements) {
      priceTextContent = priceElement.textContent.trim().toLowerCase();
      console.log(priceTextContent);
      if (oldPrice.toLowerCase() === priceTextContent) {
        priceElement.classList.add("checked");
        price = priceTextContent;
      }
    }
  }

  // console.log(oldcategories);
  // console.log(oldstats);
  // console.log(oldPrice);
  // document.location.search = params;
}

async function submitsearch(event) {
  event.preventDefault();

  search = formForSearchElement.firstElementChild.value;
  
  insertParam("search", search);
}

function toggleCategories(event) {
  event.target.classList.toggle("checked");
  let category = event.target.textContent.toString().toLowerCase();
  if (categories.includes(category)) {
    let index = categories.indexOf(category);
    categories.splice(index, 1);
  } else {
    categories.push(category.toString());
  }
  // console.log(categories)
  insertParam("categories", categories);
}

function togglePrices(event) {
  for (const pricesElement of pricesElements) {
    if (event.target.classList.value === "checked") {
      continue;
    }
    pricesElement.classList.remove("checked");
  }
  event.target.classList.toggle("checked");

  if (event.target.classList.value === "checked") {
    price = event.target.textContent;
  } else {
    price = "";
  }
  // console.log(price);
  insertParam("price", price);
}

function toggleStatus(event) {
  let statValue = event.target.parentElement.textContent.trim().toLowerCase();
  if (this.checked && !stats.includes(statValue)) {
    stats.push(statValue);
  } else if (stats.includes(statValue)) {
    let index = stats.indexOf(statValue);
    stats.splice(index, 1);
  }

  // console.log(stats);
  insertParam("status", stats);
}

formForSearchElement.addEventListener("submit", submitsearch);

for (const categoriesElement of categoriesElements) {
  categoriesElement.addEventListener("click", toggleCategories);
}

for (const pricesElement of pricesElements) {
  pricesElement.addEventListener("click", togglePrices);
}

for (const statusElement of statusElements) {
  statusElement.addEventListener("change", toggleStatus);
}

async function insertParam(key, value) {
  // value = value.join(',');
  // key = encodeURIComponent(key);
  value = encodeURIComponent(value);

  // kvp looks like ['key1=value1', 'key2=value2', ...]
  var kvp = document.location.search.substr(1).split("&");
  let i = 0;

  for (; i < kvp.length; i++) {
    if (kvp[i].startsWith(key + "=")) {
      let pair = kvp[i].split("=");
      pair[1] = value;
      kvp[i] = pair.join("=");
      break;
    }
  }

  if (i >= kvp.length) {
    kvp[kvp.length] = [key, value].join("=");
  }

  var newKvp = [];
  for (let index = 0; index < kvp.length; index++) {
    let pair = kvp[index].split("=");
    if (pair[1] !== "" && pair[1] !== []) {
      newKvp[index] = pair.join("=");
    }
  }

  // can return this or...
  let params = newKvp.join("&");
  if (params[0] === "&") {
    params = params.substring(1);
  }

  // reload page with new params
  window.history.replaceState(null, null, "?" + params);
  document.location.search = params;
}
