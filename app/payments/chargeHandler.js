const StripePayment = require('./providers/stripepayment');

const config = {
    stripe : StripePayment
};
module.exports = class ChargeHandler {
    constructor(provider, req) {
        const Identifier = config[provider];
        if (!Identifier) {
            throw new Error('Invalid payment provider');
        }
        this.paymentProvider = new Identifier(req);
    }

    charge(options) {
        return this.paymentProvider.charge(options);
    }
};
