const _ = require('lodash');
const ClientError = require('../../errors').ClientError;
const errorTypes = require('../../errors/types');

function stripeErrors(err) {
    let option = {
        message : 'Payment failed',
        type    : errorTypes.ERR_PAYMENT_FAILED
    };
    switch (err.type) {
    case 'StripeCardError':
        // A declined card error
        // => e.g. "Your card's expiration year is invalid."
        option = _.extend(option, {
            message : err.message,
            type    : errorTypes.ERR_PAYMENT_CARD_DECLINED
        });
        break;
    case 'RateLimitError':
        // Too many requests made to the API too quickly
        break;
    case 'StripeInvalidRequestError':
        // Invalid parameters were supplied to Stripe's API
        break;
    case 'StripeAPIError':
        // An error occurred internally with Stripe's API
        break;
    case 'StripeConnectionError':
        // Some kind of error occurred during the HTTPS communication
        break;
    case 'StripeAuthenticationError':
        // You probably used an incorrect API key
        break;
    default:
        // Handle any other types of unexpected errors
        break;
    }

    return new ClientError(option);
}

const providers = {
    stripe : stripeErrors
};

module.exports = function getErrorMessage(providerStr, err = {}) {
    const provider = providers[providerStr];
    return provider(err);
};
