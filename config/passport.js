const User = require('../app/models').user;
const authConfig = require('./authConfig');
const JwtStrategy = require('passport-jwt').Strategy;
const cookieParser = require('cookie');
// const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token;
  } else {
    const cookieIndex = req.rawHeaders.findIndex(i => i === 'cookie' || i === 'Cookie');
        // const cookieIndex = req.rawHeaders.indexOf('Cookie') || req.rawHeaders.indexOf('cookie');

    if (cookieIndex > -1) {
      const cookie = req.rawHeaders[cookieIndex + 1];
      token = cookieParser.parse(cookie).token;
    }
  }
  return token;
};

module.exports = (passport) => {
    // Json web token authentication
  const options = {};
  options.secretOrKey = authConfig.secret;
    // options.jwtFromRequest = ExtractJwt.fromAuthHeader();
  options.jwtFromRequest = cookieExtractor;
  passport.use(new JwtStrategy(options, (jwtPayload, done) => {
    User.findById(jwtPayload.id)
            .then((user) => {
                // disabled account
              if (user.disabled) {
                done(null, false);
              } else if (user) {
                done(null, user);
              } else {
                done(null, false);
              }
            })
            .catch((err) => {
              global.log.error(err);
              done(err, false);
            });
  }));


    // local authentication strategy for /login route, checks against username and password
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, done) => {
    User.findOne({
      where: {
        email,
      },
            // attributes: ['id', 'email', 'password']
    }).then((user) => {
      if (!user || user.disabled) {
        return done(null, false);
      }
      return user.checkPassword(password, (err, matched) => {
        if (err) {
          return done(err);
        }

        if (!matched) {
          return done(null, false, {
              error: 'Password did not match',
            });
        }

        return done(null, user);
      });
    })
            .catch((err) => {
              global.log.error(err);
              done(err);
            });
  }));

  passport.use(new GoogleStrategy({
    clientID: authConfig.google.client_id,
    clientSecret: authConfig.google.secret,
        // callbackURL: `http://${global.config.app.address}:4000/api/auth/google/callback`,
    callbackURL: process.env.CALLBACK_URL || 'http://localhost/api/auth/google/callback',
  }, (accessToken, refreshToken, profile, done) => {
    User.find({
      where: {
        googleOAuthId: profile.id,
      },
    }).then((user) => {
      if (user && user.disabled) {
        return false;
      } else if (user) {
        return done(null, user);
      }
      return User.findOrCreate({
        where: {
          email: profile.emails[0].value,
        },
        defaults: {
          fullName: `${profile.name.givenName} ${profile.name.familyName}`,
          role: 'user',
          googleOAuthId: profile.id,
          googleOAuthToken: accessToken,
        },
      }).spread((newUser, created) => {
        done(null, newUser);
      }).catch((err) => {
          done(err);
        });
    })
            .catch((err) => {
              global.log.error(err);
              done(err);
            });
  }));

    // return {
    //     initialize() {
    //         return passport.initialize();
    //     },
    //     tokenAuth() {
    //         return passport.authenticate('jwt', {
    //             session: false
    //         });
    //     },
    //     localAuth() {
    //         return passport.authenticate('local', {
    //             session: false
    //         });
    //     },
    //     // const googleAuth = passport.authenticate('google', { session: false, scope: ['profile', 'email'] });
    //     googleAuth() {
    //         return passport.authenticate('google', {
    //             session: false,
    //             scope: ['profile', 'email']
    //         });
    //     }
    // };
};
