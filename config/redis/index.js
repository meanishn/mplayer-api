const config = require('../config');
const redis = require('redis');

const redisConfig = config.redis;
module.exports = redis.createClient(redisConfig);
