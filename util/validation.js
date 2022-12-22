function isEmpty(value) {
  return !value || value.trim() === "";
}

// SENDING TEST EMAIL?
function userCredentialsAreValid(email, password) {
  return (email && email.includes("@") && password && password.trim().length > 5);
}

function userDetailsAreValid(
  email,
  password,
  name,
  street,
  city,
  country,
  postal
) {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(street) &&
    !isEmpty(city) &&
    !isEmpty(country) &&
    !isEmpty(postal)
  );
}

function emailIsConfirmed(email, confirmEmail) {
    return email === confirmEmail;
}

module.exports = {
    userDetailsAreValid: userDetailsAreValid,
    emailIsConfirmed: emailIsConfirmed
}
