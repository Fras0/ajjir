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

async function getVerification(req, res) {
  // const user = await User.findById(res.locals.uid);

  res.render("users/verification", { id: res.locals.uid });
}

async function verification(req, res, next) {
  const id_image = req.files[0].filename;
  const user_image = req.files[1].filename;
  // console.log(req.files[0].filename);
  const url = `http://127.0.0.1:4000/predict?id_image=${id_image}&person_image=${user_image}`;

  let response;
  let responseObject;
  try {
    response = await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    responseObject = new Object(await response.json());
  } catch (error) {
    return next(error);
  }

  if (responseObject.prediction.similarity) {
    const user = await User.findById(res.locals.uid);
    const newUser = new User(user)
    try{
      await newUser.verify();
    } catch (error) {
      next(error);
      return;
    }
  }

  res.redirect(`/users/edit-profile/${res.locals.uid}`);
}

module.exports = {
  getProfile: getProfile,
  getEditProfile: getEditProfile,
  editProfile: editProfile,
  getVerification: getVerification,
  verification: verification,
};
