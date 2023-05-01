const passport = require("passport");

function checkAuthStatus(req, res, next) {
    const uid = req.session.uid;
    const passport = req.session.passport;
  
    if (!uid && !passport) {
      // console.log('not auth!!!!');
      return next();
    }
  
    res.locals.uid = uid;
    res.locals.passport = passport;
    res.locals.isAuth = true;
    // console.log('is auth!!!!');
    next();
  }
  
  module.exports = checkAuthStatus;
  