const passport = require("passport");
const Notification = require("../models/notifications.model");

async function checkAuthStatus(req, res, next) {
  const uid = req.session.uid;
  const passport = req.session.passport;

  if (!uid && !passport) {
    // console.log('not auth!!!!');
    return next();
  }

  const notifications = await Notification.findByUserId(uid);
  
  if (notifications) {
    res.locals.notifications = notifications;
  }

  res.locals.uid = uid;
  res.locals.passport = passport;
  res.locals.isAuth = true;
  // console.log('is auth!!!!');
  next();
}

module.exports = checkAuthStatus;
