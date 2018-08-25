const utils = require('./app/utils');

// console.log(utils.generateHash(19));

const salt = require('./config/authConfig').idHashSecret;
const Hashids = require('hashids');

const hashPadding = 10;


const hashids = new Hashids(salt, hashPadding);

const num = process.argv[2];

const decode = process.argv[3] || false;

if (decode) {
    console.log(hashids.decode(num)[0]);
} else {
    console.log(hashids.encode(num));
}
