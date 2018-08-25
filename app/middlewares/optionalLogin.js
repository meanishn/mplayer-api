const passport = require('passport');

module.exports = (req, res, next) => {
    if (req.cookies.token) {
        return passport.authenticate('jwt', {
            session : false
        })(req, res, next);
    }
    req.user = null;
    next();
};
