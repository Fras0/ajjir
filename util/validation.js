const emailValidator = require("deep-email-validator");
function isEmpty(value) {
  return !value || value.trim() == "";
}

function userCredentialsAreValid(email ,password) {
  return email && email.includes("@") && password && password.trim().length > 6;
}

// async function isEmailValid(email) {
//   return (await emailValidator.validate(email)).validators.mx.valid;
// }

function userDetailsAreValid(
  email,
  password,
  confirmPassword,
  name,
  phone
) {
  return (
    userCredentialsAreValid(email ,password) &&
    // isEmailValid(email)== true&&
    !isEmpty(name) &&
    !isEmpty(phone) &&
    !isEmpty(password) &&
    !isEmpty(confirmPassword)
  );
}

function passwordIsConfirmed(password, confirmPassword) {
  return password === confirmPassword;
}

module.exports = {
  userDetailsAreValid: userDetailsAreValid,
  passwordIsConfirmed: passwordIsConfirmed,
};
