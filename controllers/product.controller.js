const Product = require("../models/product.model");

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("products/all-products", { products: products });
    // res.json({message:'all products', products: products });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct(req, res) {
  if (!res.locals.isAuth) {
    return res.json({ message: "not authenticated"});
  }
  res.render("products/new-product");
}

async function createNewProduct(req, res, next) {
  // console.log(req.session.uid);
  // console.log(req.user);
  
  const product = new Product({
    ...req.body,
    image: req.file.filename,
    // owner: req.session.email,
  });

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  //   res.redirect("/admin/products");
  res.json({ message: "product added", product: product });
}

async function getProductDetails(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.json({ message: "product page", product: product });
    // res.render("products/update-product", { product: product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    _id: req.params.id,
  });

  if (req.file) {
    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
}

async function deleteProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    await product.remove();
  } catch (error) {
    return next(error);
  }

  res.json({ message: "Deleted product!" });
}

module.exports = {
  createNewProduct: createNewProduct,
  getNewProduct: getNewProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getProductDetails: getProductDetails,
  getProducts: getProducts,
};
