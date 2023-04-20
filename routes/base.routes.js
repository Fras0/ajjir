const epxress = require("express");
const baseController = require("../controllers/base.controller");
const router = epxress.Router();

router.get("/", baseController.getAllProducts);


module.exports = router;
