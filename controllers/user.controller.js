const User = require("../models/user.model");

async function getProfile(req, res) {
  const user = await User.findById(res.locals.uid);
  res.render("users/show-profile", { user: user, id: res.locals.uid });
}

async function getEditProfile(req, res, next) {
  const user = await User.findById(res.locals.uid);
  res.render("users/edit-profile", { user: user, id: res.locals.uid });
}

async function editProfile(req, res) {
  const user = new User({
    ...req.body,
    _id: req.params.id,
  });

  try {
    await user.save();
  } catch (error) {
    next(error);
    return;
  }

  user.verify();

  res.redirect(`/profile/${res.locals.uid}`);
}

module.exports = {
  getProfile: getProfile,
  getEditProfile: getEditProfile,
  editProfile: editProfile,
};
