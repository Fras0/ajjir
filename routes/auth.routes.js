const epxress = require("express");
const authController = require("../controllers/auth.controller");
const router = epxress.Router();

router.get("/signup", authController.getSignUp);
router.get("/login", authController.getLogIn);

module.exports = router;
