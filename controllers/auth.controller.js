const User = require("../models/user.model");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
    };
  }

  res.render("auth/signup" , {inputData : sessionData});
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body["confirm-password"],
    name: req.body.name,
    phone: req.body.phone,
  };
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body["confirm-password"],
      req.body.name,
      req.body.phone
    ) ||
    !validation.passwordIsConfirmed(
      req.body.password,
      req.body["confirm-password"]
    )
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Please check your inputs again",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );

    console.log("Please check your inputs again");
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.phone,
    req.body.name,
    req.body.country,
    req.body.street,
    req.body.city
  );

  try {
    const existsAllready = await user.existsAllready();

    if (existsAllready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User exists allready!",
          ...enteredData,
        },
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect("/login");
}

function getLogIn(req, res) {
  res.render("auth/login");
}

function getAllProducts(req, res) {
  res.render("products/all-products");
}

module.exports = {
  getSignup: getSignup,
  signup: signup,
  getLogIn: getLogIn,
  getAllProducts: getAllProducts,
};
