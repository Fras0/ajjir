const epxress = require("express");
const productController = require("../controllers/product.controller");
const imageUploadMiddleware = require("../middlewares/image-upload");

const router = epxress.Router();

router.get("/products", productController.getProducts);

router.get("/products/new", productController.getNewProduct);

router.post(
  "/products",
  imageUploadMiddleware.configuredMulterMiddleware,
  productController.createNewProduct
);

router.get("/products/:id", productController.getProductDetails);

router.get("/products/:id/edit", productController.getProductDetails);

module.exports = router;
