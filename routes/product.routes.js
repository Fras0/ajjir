const epxress = require("express");
const productController = require("../controllers/product.controller");
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = epxress.Router();


router.get('/products', productController.getProducts);

router.post('/products', imageUploadMiddleware, productController.createNewProduct);

router.get('/products/:id', productController.getProductDetails);

router.get('/products/:id/edit', productController.getProductDetails);



module.exports = router;
