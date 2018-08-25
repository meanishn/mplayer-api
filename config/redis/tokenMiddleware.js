const redis = require('../redis');

function createPurchaseTokenKey(user, token) {
    return `user:${user}:purchase:${token}`;
}
function documentPurchaseToken(req, res, next) {
    const token = req.params.token;
    const key = createPurchaseTokenKey(req.user.id, token);

    redis.lrange(key, 0, -1, (err, reply) => {
        if (err || !reply.length) {
            res.status(400);
            return res.end('Invalid request');
        }
        return next();
    });
}

module.exports = {
    documentPurchaseToken
};
