const errors = require('restify-errors');
const _ = require('lodash');
const errorTypes = require('./types');


class BaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DoctualBaseError';
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}

exports.BaseError = BaseError;

class GeneralError extends BaseError {
    constructor(option, message) {
        super(option);
        this.message = message || 'Api Error';
        this.stack = option.stack;
    }
}
exports.GeneralError = GeneralError;

class ChargeError extends BaseError {
    constructor(options, message) {
        super(options);
        this.name = 'DoctualChargeError';
        this.message = message;
    }
}

exports.ChargeError = ChargeError;


class ClientError extends errors.InternalServerError {
    constructor(option = {}) {
        super(option);
        this.message = option.message || this.message;
        this.type = option.type || this.type;
        this.body = _.extend(this.body, option);
    }
}

exports.ClientError = ClientError;

class VersionError extends errors.InvalidVersionError {
    constructor(option = {}) {
        super(option);
        this.message = option.message || this.message;
        this.type = option.type || errorTypes.ERR_VERSION_NOT_ALLOWED;
    }
}

exports.VersionError = VersionError;
