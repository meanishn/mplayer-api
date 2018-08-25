// controllers
const passport = require('passport');

const usersController = require('./controllers/users');
const artistController = require('./controllers/artists');
const middlewares = require('./middlewares');

const urlIdHasher = middlewares.urlIdHasher;


function errorHandle(fn) {
  return function () {
    const [req, res, next] = arguments;
    try {
      fn.apply(this, arguments);
    } catch (err) {
      global.log.error(err);
            // next(new errors.GeneralError(err, 'Api error'));
      next();
    }
  };
}


const tokenAuth = passport.authenticate('jwt', {
  session: false,
    // failureFlash: true
});
// localAuth can be used to make a local authentication like in login route
// This is only for the case when the token has expired or user making a new login

const localAuth = passport.authenticate('local', {
  session: false,
    // failureFlash: true this needs some flash lib
    // failureRedurect: '/api/fail' probably not for SPA
});
const googleAuth = function (req, res, next) {
  return passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    state: req.query.next,
  })(req, res, next);
};

const passwordUpdate = middlewares.passwordUpdate;

module.exports = (app) => {
  app.post({
    url: '/api/register',
    validation: {
      content: {
        fullName: { isRequired: true },
        email: { isRequired: true, isEmail: true },
        password: { isRequired: true },
      },
    },
  }, usersController.register);
  app.post({
    url: '/api/login',
    validation: {
      content: {
        email: { isRequired: true, isEmail: true },
        password: { isRequired: true },
      },
    },
  }, localAuth, (usersController.login));

  app.get('/api/logout', usersController.logout);
  app.post('/api/refresh', tokenAuth, usersController.refresh);
  app.get({
    url: '/api/user/verify/:hash',
    validation: {
      resources: {
        hash: { isRequired: true },
      },
    },
  }, usersController.verifyUser);
        // app.post('/api/logout', usersController.logout);
  app.post({
    url: '/api/profile/update',
    validation: {
      content: {
        fullName: { isRequired: false },
        firmName: { isRequired: false },
        location: { isRequired: false },
        address: { isRequired: false },
        postcode: { isRequired: false, isAlphaNumeric: true },
        city: { isRequired: false },
        country: { isRequired: false },
        vatId: { isRequired: false },
        designation: { isRequired: false },
        phoneNumber: { isRequired: false },
        industry: { isRequired: false },

      },
    },
  }, tokenAuth, usersController.update);
  app.get('/api/profile/islogin', tokenAuth, usersController.isLogin);
  app.del('/api/profile', tokenAuth, usersController.deleteAccount);
  app.post({
    url: '/api/changepassword',
    validation: {
      content: {
        password: { isRequired: true },
        confirmPassword: { isRequired: true },
      },
    },
  }, middlewares.passwordUpdate, usersController.changePassword);

  app.post({
    url: '/api/forgotpassword',
    validation: {
      content: {
        email: { isRequired: true, isEmail: true },
      },
    },
  }, usersController.forgotPassword);
  app.get({
    url: '/api/resetpassword',
    validation: {
      queries: {
        token: { isRequired: true },
      },
    },
  }, usersController.resetpassword);
  app.patch({
    url: '/api/user/resend-email',
    validation: {

    },
  }, tokenAuth, usersController.resendToken);


// google authentication
  app.get('/api/auth/google', googleAuth);
  app.get('/api/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }), usersController.googleAuthCallback);


  // Artist Api
  app.get('/api/artists', artistController.readAll);
  app.get('/api/artists/:id', urlIdHasher, artistController.read);
  app.get('/api/tags', artistController.trackFromTags);
};
