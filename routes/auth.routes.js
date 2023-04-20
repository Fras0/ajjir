const epxress = require("express");
const authController = require("../controllers/auth.controller");
const router = epxress.Router();

router.get("/", authController.getAllProducts);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.signup);

router.get("/login", authController.getLogIn);

module.exports = router;
