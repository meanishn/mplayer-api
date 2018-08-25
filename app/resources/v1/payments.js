const paymentController = require('../../controllers/payments');
const middlewares = require('../../middlewares');

const tokenAuth = middlewares.auth.tokenAuth;
const urlIdHasher = middlewares.urlIdHasher;

module.exports = (app) => {
    app.post({ url        : '/api/payments/cards',
        validation : {
            content : {
                token : { isRequired : true }
            }
        } }, tokenAuth, paymentController.cards);
    app.get('/api/payments/cards', tokenAuth, paymentController.allCards);
    app.del({ url        : '/api/payments/cards/:cardId',
        validation : {
            resources : {
                cardId : { isRequired : true }
            }
        } }, tokenAuth, paymentController.deleteCard);
    app.post({ url        : '/api/payments/defaultcard',
        validation : {
            content : {
                card : { isRequired : true }
            }
        } }, tokenAuth, paymentController.setDefaultCard);
    app.post({ url        : '/api/payments/orders',
        validation : {
            content : {
                documents : { isRequired : true }
            }
        } }, tokenAuth, urlIdHasher, paymentController.orders);
    app.get('/api/payments/transactions', tokenAuth, paymentController.transactions);
};
