const passport = require("passport");
const Notification = require("../models/notifications.model");
const User = require("../models/user.model");

async function checkAuthStatus(req, res, next) {
  const uid = req.session.uid;
  const passport = req.session.passport;

  if (!uid && !passport) {
    // console.log('not auth!!!!');
    return next();
  }

  const notifications = await Notification.findByUserId(uid);
  const user = await User.findById(uid);
  
  if (notifications) {
    res.locals.notifications = notifications;
  }

  if (user) {
    res.locals.isVerified = user.isVerified;
    res.locals.jPoints = user.points;
    res.locals.balance = user.balance;
  }

  res.locals.uid = uid;
  res.locals.passport = passport;
  res.locals.isAuth = true;
  // console.log('is auth!!!!');
  next();
}

module.exports = checkAuthStatus;
