const User = require('../models/user-model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      name: '',
      street: '',
      city: '',
      country: '',
      postal: '',
    }
  }
  res.render('customer/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    name: req.body.fullname,
    street: req.body.street,
    city: req.body.city,
    country: req.body.country,
    postal: req.body.postal,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.city,
      req.body.country,
      req.body.postal
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: 'Please check your input!',
        ...enteredData,
      },
      function () {
        res.redirect('/signup');
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.city,
    req.body.country,
    req.body.postal
  );

  try {
    const existsAlready = await user.existsAlready();
    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: 'User exists already! Try logging in instead!',
          ...enteredData,
        },
        function () {
          res.redirect('/signup');
        }
      );
      return;
    }
    await user.signup();
  } catch (error) {
    return next(error);
  }

  res.redirect('/login');
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: '',
      password: ''
    }
  }
  res.render("customer/auth/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage: 'Invalid credentials!',
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/login');
    });
    return;
  }

  const passwordIsCorrect = await user.comparePassword(existingUser.password);

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/login');
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect('/');
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/login');
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
