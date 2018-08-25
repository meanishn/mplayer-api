const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const uuid = require('uuid-v4');
const shortid = require('shortid');
const User = require('../models').user;
const models = require('../models');
const authConfig = require('../../config/authConfig');
const helper = require('./helper');
const _ = require('lodash');
const utils = require('../utils');
const nodeUtil = require('util');
const bcrypt = require('bcrypt-nodejs');
const ClientError = require('../errors').ClientError;
const errorTypes = require('../errors/types');

const sequelize = models.sequelize;

const exposedAttrs = ['email', 'role', 'fullName', 'firmName', 'location', 'image', 'vatId', 'address', 'postcode', 'city', 'state', 'country', 'designation', 'industry', 'phoneNumber'];

function formatUserData(user) {
  const allowedKeys = _.intersection(Object.keys(user.dataValues), exposedAttrs);
  const values = allowedKeys.map(key => ({
    [key]: user[key],
  })).reduce((acc, cur) => Object.assign(acc, cur));
  values.isNewUser = user.isNewUser();
  values.isVerified = user.hash === null;
  values.googleLogin = user.password === null && user.googleOAuthId !== null;
    // set all document free to all user
  values.free_offer = global.doc_free_offer;
  return values;
}

function sendUserData(res, user, next) {
  const values = formatUserData(user);
  res.send(200, {
    user: values,
  });
  next();
}

function getExpirationDate() {
  return new Date(Date.now() + 1000 * 24 * 60 * 60);
}

function generateToken(user) {
  return jwt.sign(user, authConfig.secret, {
    expiresIn: '24h',
  });
}

function generateRefreshToken() {
  return uuid();
}

function setUserInfo(request) {
  return {
    id: request.id,
    email: request.email,
  };
}

function setCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production';
  const cookieExpirationDate = getExpirationDate();
  res.setCookie('token', token, {
    path: '/',
    expires: cookieExpirationDate,
    httpOnly: true,
    secure,
  });
}

function setUserObjectCookie(res, user) {
  const formatted = formatUserData(user);
  res.setCookie('userCredentials', utils.encodeString(JSON.stringify(formatted)), {
    path: '/',
    expires: getExpirationDate(),
  });
}

const generateHash = () => crypto.randomBytes(16).toString('hex');

module.exports = {
    // registering should be more multi-process to support image and profile additions
    // register as user by default
  async register(req, res, next) {
    let response;
    try {
      const email = req.body.email;
      const password = req.body.password;
      const fullName = req.body.fullName;
      const existingUser = await User.findOne({
        where: {
          email,
        },
        attributes: ['email'],
      });
      if (existingUser) {
        return helper.basicErrorHandle(res, new ClientError({
          message: 'Email already in use',
          type: errorTypes.ERR_DUPLICATE_ENTRY,
        }), next);
      }
      const hash = shortid.generate();
      const user = await User.create({
        email,
        password,
        hash,
        fullName,
        role: 'user',
      });

      const userInfo = setUserInfo(user);
            // emailHandler.notifyEmailConfirmation({
            //     email : user.email,
            //     name  : user.fullName || '',
            //     token : user.hash
            // });

            // const campaignData = campaign.get('signup');
            // emitter.emit('signup', { user : user.dataValues });

      const token = generateToken(userInfo);
      setCookie(res, token);
      response = {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isNewUser: user.isNewUser(),
        free_offer: global.doc_free_offer,
      };
    } catch (e) {
      return helper.basicErrorHandle(res, e, next);
    }
    return helper.basicJsonResponse(res, { user: response }, next);
  },
  update(req, res, next) {
    const fullName = req.params.fullName;
    const firmName = req.params.firmName;
    const location = req.params.location;
    const industry = req.params.industry;
    const phoneNumber = req.params.phoneNumber;
    const {
            vatId,
            addressLine,
            postalCode,
            state,
            city,
            country,
        } = req.params.billingInfo;

        // const roleKeys = {
            // 1 : 'lawyer',
            // 2 : 'user'
        // };

        // const role = roleKeys[req.params.role];
    const attrs = {
      fullName,
      firmName,
      location,
            // role,
      address: addressLine,
      postcode: postalCode,
      state,
      city,
      country,
      vatId,
      phoneNumber,
      industry,
    };
    const updateParams = {};

    Object.keys(attrs).forEach((attr) => {
      const val = attrs[attr];
      if (val) {
        updateParams[attr] = val;
      }
    });

    if (Object.keys(updateParams).length) {
      req.user.update(updateParams).then(user =>
                helper.basicJsonResponse(res, _.pick(user, exposedAttrs))).catch(helper.basicErrorHandle.bind(this, res)).then(next);
    } else {
      const error = 'No valid params supplied!';
      req.log.warn(error, req.url);
      helper.basicErrorHandle(res, error, next);
    }
  },
  async deleteAccount(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      await req.user.destroy({
        transaction,
      });
      res.clearCookie('token', {
        path: '/',
      });

      await transaction.commit();

      helper.basicJsonResponse(res, { ok: true }, next);
    } catch (e) {
      await transaction.rollback();
      helper.basicErrorHandle(res, e, next);
    }
  },

  login(req, res, next) {
    const userInfo = setUserInfo(req.user);
    const token = generateToken(userInfo);
    setCookie(res, token);
    sendUserData(res, req.user, next);
  },

  logout(req, res, next) {
    res.clearCookie('token', {
      path: '/',
    });
        // TODO: Invalidate JWT.... ???

    res.redirect('/', next);
  },
  googleAuthCallback(req, res, next) {
    const userInfo = setUserInfo(req.user);
    const token = generateToken(userInfo);
    setCookie(res, token);
    setUserObjectCookie(res, req.user);
    const redirectUrl = req.query.state || '/business/dashboard/min/recents';
    res.redirect(301, redirectUrl, next);
  },
  refresh(req, res, next) {
    const THRESHOLD = 60 * 60; // 1 hour
    const token = req.cookies.token;
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err && err.name === 'TokenExpiredError') {
        return res.send(401, 'Unauthorized');
      }
      const now = Math.floor(Date.now() / 1000);
      const left = decoded.exp - now;
      if (left < THRESHOLD) {
        const newToken = generateToken(setUserInfo(req.user));
                // res.setCookie('token', newToken, {
                //     path: '/',
                //     expires: cookieExpirationDate,
                //     secure: false
                // });
        setCookie(res, newToken);
        return res.send({
          refreshed: true,
          user: formatUserData(req.user),
        });
      }
      return res.send({
        refreshed: false,
        left,
        user: formatUserData(req.user),
      });
    });
  },
  isLogin(req, res, next) {
    sendUserData(res, req.user, next);
  },

  async changePassword(req, res, next) {
    let user;
    try {
      const currentPassword = req.params.currentPassword;
      const password = req.params.password;
      const confirmPassword = req.params.confirmPassword;

      if (!password && !confirmPassword) {
        return helper.basicErrorHandle(res, 'require password and confirm password', next);
      }
      if (password !== confirmPassword) {
        return helper.basicErrorHandle(res, 'password mismatch', next);
      }
      let dbParams = { password };
      if (req.fromPasswordReset) {
        dbParams = _.extend(dbParams, {
          password_reset_token: null,
          password_token_expires_at: null,
        });
        user = await req.user.update(dbParams);
        return sendUserData(res, user, next);
      }
            // bcrypt.compare(pwd, password, (err, matched) => {
            //     if (err) {
            //         return cb(err);
            //     }
            //     cb(null, matched);
            //     return undefined;
            // });
      const checkPassword = nodeUtil.promisify(bcrypt.compare);
      const match = await checkPassword(currentPassword, req.user.password);
      if (!match) {
        return helper.basicErrorHandle(res, 'Incorrect password', next);
      }
      user = await req.user.update(dbParams);
    } catch (e) {
      return helper.basicErrorHandle(res, e, next);
    }
    return sendUserData(res, user, next);
  },

  verifySignee(req, res, next) {
    const hash = req.params.hash;
    const action = req.params.action;

    if (action && action === 'pass') {
      const decoded = utils.decodeHash(hash)[0];
      return User.find({
        where: {
          id: decoded,
          role: 'signee',
          require_password_change: true,
        },
      }).then((user) => {
        if (!user) {
          return res.redirect('/', next);
        }
        const userInfo = setUserInfo(user);
                // const token = `JWT ${generateToken(userInfo)}`;
        const token = generateToken(userInfo);
        const refreshToken = generateRefreshToken();
                // set cookie on each login
                // res.setCookie('token', token, {
                //     path: '/',
                //     expires: cookieExpirationDate,
                //     httpOnly: true,
                //     secure: false // set this to true when in HTTPS
                // });
        setCookie(res, token);
        return res.redirect('/update-password', next);
      }).catch(err => res.redirect('/', next)).then(next);
    }
    return res.redirect('/', next);
  },

  forgotPassword(req, res, next) {
    const email = req.params.email;
    User.find({
      where: {
        email,
      },
    })
    .then((user) => {
      if (!user) {
        res.send(200, {
          success: true,
          message: 'password reset link will be sent to the email address',
        });
        return Promise.resolve(null);
      }
      return user.update({
        password_reset_token: uuid(),
        password_token_expires_at: Date.now() + 1000 * 60 * 60 * 24,
      }, { returning: true });
    })
    .then((updatedUser) => {
      if (updatedUser) {
        return res.send(200, {
          success: true,
        });
      }
    })
    .catch(helper.basicErrorHandle.bind(this, res))
    .then(next);
  },

  resetpassword(req, res, next) {
    const token = req.params.token;
    User.find({
      where: {
        password_reset_token: token,
        password_token_expires_at: {
          $gt: new Date(),
        },
      },
    })
            .then((user) => {
              if (!user) {
                return res.redirect('/', next);
              }
              return res.redirect(`/update-password?source=reset&token=${token}`, next);
            });
  },

  async verifyUser(req, res, next) {
    try {
      const hash = req.params.hash;
      const user = await User.find({
        where: {
          hash,
        },
      });
      if (!user) {
        return res.redirect('/', next);
      }
      await user.update({
        hash: null,
      });
      return res.redirect('/business/dashboard/min/recents', next);
    } catch (e) {
      return helper.basicErrorHandle(res, e, next);
    }
  },

  async resendToken(req, res, next) {
    try {
      const hash = shortid.generate();
      await req.user.update({
        hash,
      });
    } catch (e) {
      return helper.basicErrorHandle(res, e, next);
    }

    return helper.basicJsonResponse(res, { ok: true }, next);
  },

    // Obselete, not in use after 30.11.2017
  async redeemCode(req, res, next) {
    const BASE_CODE = 'DXY2K11X';
    try {
      const code = req.params.code;
      if (code !== BASE_CODE) {
        return helper.basicErrorHandle(res, 'Invalid Code', next);
      }
      await req.user.update({
        november_offer: true,
      });
      helper.basicJsonResponse(res, { ok: true }, next);
    } catch (e) {
      helper.basicErrorHandle(res, e, next);
    }
  },

  async getCompanies(req, res, next) {
    try {
      const companies = await req.user.getCompanies();
      helper.basicJsonResponse(res, companies, next);
    } catch (e) {
      helper.basicErrorHandle(res, e, next);
    }
  },

  async getOffers(req, res, next) {
    try {
      const offers = await req.user.getOffers('BIZCAMP');
      helper.basicJsonResponse(res, offers, next);
    } catch (e) {
      helper.basicErrorHandle(res, e, next);
    }
  },
};
