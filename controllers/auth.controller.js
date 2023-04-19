function getSignUp(req, res) {
  res.render("auth/signup");
}
function getLogIn(req, res) {
  res.render("auth/login");
}

function getAllProducts(req, res) {
  res.render("products/all-products");
}

module.exports = {
  getSignUp: getSignUp,
  getLogIn: getLogIn,
  getAllProducts: getAllProducts,
};
