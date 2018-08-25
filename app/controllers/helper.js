const semver = require('semver');
const salt = require('../../config/authConfig').idHashSecret;
const Hashids = require('hashids');
const ClientError = require('../errors').ClientError;

const hashPadding = 10;

module.exports = {
  basicJsonResponse(res, val, next) {
    const hashableAttrs = [
      'id',
      'document_id',
      'business_doc_id',
      'signatureDocId',
      'businessDocId',
    ];

    const hashids = new Hashids(salt, hashPadding);

    encodeIds(val);

    function encodeIds(theObject) {
      if (theObject instanceof Array) {
        for (let i = 0; i < theObject.length; i++) {
          const data = theObject[i];
          if (data && data.dataValues) {
            encodeIds(data.dataValues);
          } else {
            encodeIds(data);
          }
        }
      } else {
        if (theObject && theObject.dataValues) {
          theObject = theObject.dataValues;
        }
        for (const prop in theObject) {
          if (hashableAttrs.includes(prop)) {
            theObject[prop] = hashids.encode(theObject[prop]);
          }
          if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
            encodeIds(theObject[prop]);
          }
        }
      }
    }
    let responseSent = false;
    const usedVersion = semver.maxSatisfying(res.req.route.versions, res.req.version());
        // TODO: Refactor to have more generic version based handling function if needed in future
        // This check is only for backward compatibility, once existing client update their
        // response handler with the new structure(signature) as the following versions , the check can be removed and
        // more generic version based response function can be implemented if needed.
    if (semver.gt(usedVersion, '1.0.0')) {
      const apiStartTime = res.apiStartTime || Date.now();
      const response = {
        version: usedVersion,
        processedIn: `${(Date.now() - apiStartTime) / 1000}s`,
        data: {},
      };

      if (val && val.dataValues) {
        response.data = val.dataValues;
      } else {
        response.data = val;
      }
      res.json(response);
      responseSent = true;
    }

    if (!responseSent) {
      if (!val || val.length === 0) {
        res.send(204);
        return;
      }

      if (val.dataValues) {
        res.json(val.dataValues);
      } else {
        res.json(val);
                // response.data = val;
      }
    }
    if (next) next();
  },
  basicErrorHandle(res, error, next) {
    global.log.error('Api error:', error);
        // ClientError is handled error, which means the error should be exposed to the consumer
    if (global.isDev || global.isStaging || error instanceof ClientError) {
      if (next) {
        return next(error);
      }
      return res.json(500, error);
    }

        // send custom error for other type of error
        // These are unexpected errors and most likely should never happen
        // except that Sequelize related errors and any other known error that can occur should be handled properly.
        /* TODO: Add wrapper for sequelize db related error, It is to not expose db errors
            eg. if (error instance of Sequelize.ValidationError) {
                next(new DBError({
                    message: 'Application Error',
                    type: 'ERR_VALIDATION',
                    code: 'ApplicationError'
                }))
            }
        */

        // HOT FIX for stripe card error. Add proper error class for handling card errors
    let errorMessage = 'Api Error';
    if (error.type === 'StripeCardError') {
      errorMessage = error.message;
    }
    if (next) {
      return next(new Error(errorMessage));
    }
    return res.send(500, errorMessage);
  },
};
