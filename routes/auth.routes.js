const epxress = require("express");
const passport = require("passport");
const User = require("../models/user.model");
const authController = require("../controllers/auth.controller");
const authUtil = require("../util/authentication");
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
  async function (req, res, next) {
    // Successful authentication, redirect home.
    // console.log(req.user);
    const userData = {
      email: req.user.email,
      password: "000",
      name: req.user.displayName,
    };

    let user = new User(userData);
    const existsAllready = await user.existsAllready();
    if (!existsAllready) {
      await user.signup();
      console.log('if statement')
    }

    let existingUser;
    try {
      existingUser = await user.getUserWithSameEmail();
    } catch (error) {
      next(error);
      return;
    }

    authUtil.createUserSession(req, existingUser, function () {
      res.redirect("/");
    });
  }
);

module.exports = router;
