function getAllProducts(req, res) {
  res.render("products/all-products");
}

module.exports = {
  getAllProducts: getAllProducts,
};
