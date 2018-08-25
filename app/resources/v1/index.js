// Routes initialization
const modules = [
    './companies',
    './auth',
    './bookmarks',
    './documentRequests',
    './documents',
    './feedbacks',
    './lawyers',
    './payments',
    './reviews',
    './signatureDocuments',
    './signatures',
    './signees',
    './users'
];
const VERSION = '2.0.0';

function requireAndInit(handlers, app) {
    handlers.forEach((handler) => {
        /*eslint-disable*/
        const module = require(handler);
        /*eslint-enable*/
        module(app, VERSION);
    });
}
module.exports = (app) => {
    requireAndInit(modules, app);
};
