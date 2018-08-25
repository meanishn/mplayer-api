const Hashids = require('hashids');
const cheerio = require('cheerio');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const exec = require('child_process').exec;
const nodeUtil = require('util');
const shortid = require('shortid');
const salt = require('../config/authConfig').idHashSecret;

const config = require('../config/config');

const encytKey = 8;


module.exports = {
  generateHash(id) {
    const hashids = new Hashids(salt, 10);
    return hashids.encode(id);
  },
  decodeHash(hash) {
    const hashids = new Hashids(salt, 10);
    return hashids.decode(hash);
  },

  generateToken() {
    return uuidv4();
  },
  getOrCreateDir(path) {
    return new Promise((resolve, reject) => {
      mkdirp(path, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve(path);
      });
    });
  },

  getUserGeoLocation(req) {
    const { geoip_country_code, geoip_country_name, geoip_city } = req.headers;
    return {
      code: geoip_country_code,
      country: geoip_country_name,
      city: geoip_city,
    };
  },
};

