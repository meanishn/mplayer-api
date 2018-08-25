const passport = require('passport');

const tokenAuth = passport.authenticate('jwt', {
    session : false
    // failureFlash: true
});
// localAuth can be used to make a local authentication like in login route
// This is only for the case when the token has expired or user making a new login

const localAuth = passport.authenticate('local', {
    session : false
    // failureFlash: true this needs some flash lib
    // failureRedurect: '/api/fail' probably not for SPA
});
const googleAuth = passport.authenticate('google', {
    session : false,
    scope   : ['profile', 'email']
});

module.exports = {
    tokenAuth,
    localAuth,
    googleAuth
};
