const User = require("../models/user.model");
const validation = require("../util/validation");
const authUtil = require("../util/authentication");
const sessionFlash = require("../util/session-flash");
const passport = require("passport");

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

  res.render("auth/signup", { inputData: sessionData });
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
    return;
  }

  const user = new User({...req.body});

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
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  res.render("auth/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User({...req.body});
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage: "Invalid credentials - please check entered data",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });

    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  signup: signup,
  getLogIn: getLogIn,
  login: login,
  logout: logout,
};
