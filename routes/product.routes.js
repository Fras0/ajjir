const epxress = require("express");
const productController = require("../controllers/product.controller");
const imageUploadMiddleware = require('../middlewares/image-upload');

const router = epxress.Router();


router.post('/products', imageUploadMiddleware, productController.createNewProduct);



module.exports = router;
