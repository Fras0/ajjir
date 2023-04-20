const epxress = require("express");
const authController = require("../controllers/auth.controller");
const router = epxress.Router();


router.get("/signup", authController.getSignup);

router.post("/signup", authController.signup);

router.get("/login", authController.getLogIn);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

module.exports = router;
