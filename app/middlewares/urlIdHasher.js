const salt = require('../../config/authConfig').idHashSecret;
const Hashids = require('hashids');

const hashPadding = 10;

module.exports = (req, res, next) => {
    const hashids = new Hashids(salt, hashPadding);

    const hashableFields = [
        'id',
        'tokenId',
        'comment_id',
        'docId',
        'document_id',
        'signeeId'
    ];

    hashableFields.forEach((field) => {
        if (req.params[field]) {
            req.params[field] = hashids.decode(req.params[field])[0];
        }
    });

    if (req.body && req.body.ids) {
        req.params.ids = req.params.ids.map(d => hashids.decode(d)[0]);
    }

    if (req.body && req.body.documents) {
        req.body.documents.forEach(d => d.id = hashids.decode(d.id)[0]);
    }

    next();
};
