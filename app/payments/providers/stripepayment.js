const authConfig = require('../../../config/authConfig');
const stripe = require('stripe')(authConfig.stripe.authKey);

const errors = require('../../errors');

module.exports = class StripePayment {
    constructor(req) {
        this.request = req;
    }
    getToken() {
        return this.request.user.stripeId;
    }
    getCurrency() {
        return this.request.user.currency || 'eur';
    }
    charge(options) {
        const customer = this.getToken();
        const currency = this.getCurrency();
        let amount = 0.00;

        try {
            amount = parseFloat(options.amount).toFixed(2);
        } catch (e) {
            amount = options.amount;
        }
        // convert to lowest unit
        amount = Math.round(+amount * 100);
        if (!amount) {
            return Promise.resolve({
                amount : 0
            });
        }
        return stripe.charges.create(Object.assign(options, {
            amount,
            customer,
            currency,
            metadata : options.metadata
        }));
    }
};
