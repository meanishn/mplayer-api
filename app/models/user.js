const bcrypt = require('bcrypt-nodejs');

function bcrptHash(value) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(value, salt, null, (error, hashed) => {
          if (error) {
            reject(error);
          } else {
            resolve(hashed);
          }
        });
      }
    });
  });
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    role: {
      type: DataTypes.ENUM,
      values: ['none', 'user', 'lawyer', 'admin', 'signee'],
      defaultValue: 'none',
    },
    hash: {
      type: DataTypes.STRING(32),
      defaultValue: null,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  }, {
    validate: {
      localOrTokenAuth() {
        if (this.googleOAuthId === null && this.password === null) {
          throw new Error('password cannot be null');
        }
      },
    },
  });

  User.beforeCreate((user, options) => new Promise((resolve, reject) => {
    const currentUser = user;
    if (!user.password && user.googleOAuthId) {
      return resolve(options);
    }
    return bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      const password = user.password;
      bcrypt.hash(password, salt, null, (error, hash) => {
        if (error) {
          reject(error);
        }
        currentUser.password = hash;
        resolve(options);
      });
    });
  }));


  User.beforeUpdate((instance) => {
    if (instance.changed('password')) {
      return bcrptHash(instance.password)
                .then((hashedPassword) => {
                  instance.password = hashedPassword;
                });
    }
  });


  User.prototype.checkPassword = function (pwd, cb) {
    if (this.googleOAuthId) {
      cb(null, null);
      return;
    }
    const password = this.password || '';
    bcrypt.compare(pwd, password, (err, matched) => {
      if (err) {
        return cb(err);
      }
      cb(null, matched);
      return undefined;
    });
  };
  User.prototype.isNewUser = function () {
    const THRESOLD_TIME = 24 * 60 * 60 * 1000; // 24 hours
    if (new Date() - this.createdAt < THRESOLD_TIME) {
      return true;
    }
    return false;
  };

  return User;
};
