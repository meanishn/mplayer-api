const passport = require('passport');
const middlewares = require('../../middlewares');
const usersController = require('../../controllers/users');

const auth = middlewares.auth;
module.exports = (app, version) => {
// google authentication
    app.get({ url : '/api/auth/google', version }, auth.googleAuth);
    app.get({ url : '/api/auth/google/callback', version }, passport.authenticate('google', {
        failureRedirect : '/',
        session         : false
    }), usersController.googleAuthCallback);
};
