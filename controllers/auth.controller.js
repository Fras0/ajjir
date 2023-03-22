function getSignUp(req, res) {
  res.render("auth/signup");
}
function getLogIn(req, res) {
  res.render("auth/login");
}

module.exports = {
  getSignUp: getSignUp,
  getLogIn: getLogIn,
};
