function getProfile(req, res) {
  res.render("users/show-profile");
}

module.exports = {
  getProfile: getProfile,
};
