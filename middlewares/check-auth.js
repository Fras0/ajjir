const passport = require("passport");

function checkAuthStatus(req, res, next) {
    const uid = req.session.uid;
    const passport = req.session.passport;
  
    if (!uid && !passport) {
      return next();
    }
  
    res.locals.uid = uid;
    res.locals.passport = passport;
    res.locals.isAuth = true;
    // res.locals.isAdmin = req.session.isAdmin;
    next();
  }
  
  module.exports = checkAuthStatus;
  