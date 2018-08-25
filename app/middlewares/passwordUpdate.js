const models = require('../models');
const passport = require('passport');

const User = models.user;

function passwordResetToken(req, res, next) {
    User.find({
        where : {
            password_reset_token      : req.params.token,
            password_token_expires_at : {
                $gt : Date.now()
            }
        }
    })
    .then((user) => {
        if (user) {
            req.user = user;
            req.fromPasswordReset = true;
            return next();
        }
        return Promise.reject('Unauthorized');
    })
    .catch((err) => {
        res.send(401, 'UnAuthorized');
    });
}

module.exports = (req, res, next) => {
    const { token, source } = req.params;
    if (source && token && source === 'reset') {
        return passwordResetToken(req, res, next);
    }
    return passport.authenticate('jwt', {
        session : false
    })(req, res, next);
};
