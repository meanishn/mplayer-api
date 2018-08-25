const handler = require('./errors/handler');

module.exports = {
    handle(err, provider = 'stripe') {
        global.log.error(err);
        return handler(provider, err);
    }
};
