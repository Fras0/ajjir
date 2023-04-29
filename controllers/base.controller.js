function getAllProducts(req, res) {
  res.render("products/home");
}

module.exports = {
  getAllProducts: getAllProducts,
};
