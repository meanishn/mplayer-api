const signingController = require('../../controllers/signing');
const middlewares = require('../../middlewares');

const tokenAuth = middlewares.auth.tokenAuth;
const roleBusiness = middlewares.userRoles.isBusiness;
const urlIdHasher = middlewares.urlIdHasher;

module.exports = (app) => {
    app.post({ url        : '/api/signature',
        validation : {
            content : {
                url : { isRequired : true }
            }
        } }, tokenAuth, roleBusiness, signingController.addUserSignature);

    app.del('/api/signature/:id', tokenAuth, urlIdHasher, roleBusiness, signingController.deleteUserSignature);
    app.get('/api/signature', tokenAuth, roleBusiness, signingController.getUserSignatures);
    app.post('/api/signature/:id/default', tokenAuth, urlIdHasher, roleBusiness, signingController.setDefault);
    app.get('/api/signature/default', tokenAuth, roleBusiness, signingController.getDefault);
};
