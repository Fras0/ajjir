const epxress = require("express");
const passport = require("passport");
const User = require('../models/user.model');
const authController = require("../controllers/auth.controller");
const router = epxress.Router();

router.get("/signup", authController.getSignup);

router.post("/signup", authController.signup);

router.get("/login", authController.getLogIn);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async function (req, res) {
    // Successful authentication, redirect home.
    // console.log(req.user);
    user = new User(req.user.email,'0000',null,req.user.displayName);
    const existsAllready = await user.existsAllready();
    if(!existsAllready){
      user.signup();
    }
    res.redirect("/");
  }
);

module.exports = router;
