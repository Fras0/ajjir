const db = require("../data/database");
const mongodb = require("mongodb");

const Product = require("../models/product.model");

const User = require("../models/user.model");

const sessionFlash = require("../util/session-flash");

const authController = require("./auth.controller");

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll(req);
    res.render("products/all-products", { products: products });
    // res.json({message:'all products', products: products });
  } catch (error) {
    next(error);
    return;
  }
}

async function getNewProduct(req, res) {
  const user = await User.findById(res.locals.uid);

  if (!res.locals.isAuth) {
    // return res.json({ message: "not authenticated" });
    let sessionData = sessionFlash.getSessionData(req);
    if (!sessionData) {
      sessionData = {
        email: "",
        password: "",
      };
    }

    res.redirect("/login");
    return;
  }

  if (!user.isVerified) {
    res.redirect(`/users/edit-profile/${res.locals.uid}`);
    return;
  }

  res.render("products/new-product");
}

async function createNewProduct(req, res, next) {
  // console.log(req.session.uid);
  // console.log(req.user);

  const productObj = { ...req.body };

  productObj.category = productObj.category.toLowerCase();

  const product = new Product({
    ...productObj,
    image: req.file.filename,
    owner: req.session.passport.user.email,
  });

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/products");
  // res.json({ message: "product added", product: product });
}

async function getProductDetails(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    const category = product.category;
    const similarProducts = await Product.findBySameCategory(category);
    const user = await User.findByEmail(product.owner);
    // res.json({ message: "product page", product: product });
    res.render("products/show-product", {
      product: product,
      user: user,
      similarProducts: similarProducts,
    });
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
