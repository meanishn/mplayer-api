const businessDocumentsController = require('../../controllers/businessDocuments');
const middlewares = require('../../middlewares');

const tokenAuth = middlewares.auth.tokenAuth;
const roleBusiness = middlewares.userRoles.isBusiness;
const urlIdHasher = middlewares.urlIdHasher;
const validateSignee = middlewares.validateSignee;

function errorHandle(fn) {
    return function inner(...args) {
        try {
            fn.apply(this, args);
        } catch (err) {
            global.log.error(err);
            // next(new errors.GeneralError(err, 'Api error'));
            args[2]();
        }
    };
}

module.exports = (app, version) => {
    // purchase
    app.post({
        url        : '/api/business/purchase',
        validation : {
            content : {
                token : { isRequired : true }
            }
        },
        version
    }, tokenAuth, roleBusiness, middlewares.DocPaymentTokenMiddleWare, errorHandle(businessDocumentsController.purchase));
    // duplicate purchased
    app.post({ url : '/api/business/document/:id/reuse', version }, tokenAuth, roleBusiness, urlIdHasher, errorHandle(businessDocumentsController.reuse));


    // groups
    app.get({ url : '/api/business/document/group', version }, tokenAuth, roleBusiness, errorHandle(businessDocumentsController.readAllTags));
    app.post({ url : '/api/business/document/:id/group', version }, tokenAuth, roleBusiness, urlIdHasher, errorHandle(businessDocumentsController.saveGroup));
    app.del({ url : '/api/business/document/:docId/group/:id', version }, tokenAuth, roleBusiness, urlIdHasher, errorHandle(businessDocumentsController.deleteGroup));
    // view
    app.get({ url : '/api/business/document', version }, tokenAuth, roleBusiness, errorHandle(businessDocumentsController.readAll));
    app.get({ url : '/api/business/document/:id', version }, tokenAuth, roleBusiness, urlIdHasher, errorHandle(businessDocumentsController.read));
    app.patch({
        url        : '/api/business/document/:id',
        validation : {
            content : {
                dynamicTemplate : { required : true }
            }
        },
        version
    }, tokenAuth, roleBusiness, urlIdHasher, errorHandle(businessDocumentsController.updateBoughtDoc));

    app.get({ url : '/api/business/tmp/document', version }, tokenAuth, roleBusiness, urlIdHasher, errorHandle(businessDocumentsController.getAllTempAnswers));
    app.get({ url : '/api/business/tmp/document/:id', version }, tokenAuth, roleBusiness, urlIdHasher, errorHandle(businessDocumentsController.getTemp));

    app.patch({
        url        : '/api/business/tmp/document/:id',
        validation : {
            resources : {
                id : { isRequired : true }
            },
            content : {
                answers : { isRequired : true }
            }
        },
        version
    }, tokenAuth, roleBusiness, urlIdHasher, errorHandle(businessDocumentsController.updateTemp));

    app.del({ url : '/api/business/tmp/document/:id', version }, tokenAuth, roleBusiness, urlIdHasher, errorHandle(businessDocumentsController.deleteTemp));

    // get businessdocument data that is not your own, but you can review it
    app.get({ url : '/api/business/document/signee/:id', version }, tokenAuth, urlIdHasher, businessDocumentsController.getReviewDocument);

    app.get({ url : '/api/signee/documents/:docId', version }, tokenAuth, urlIdHasher, validateSignee, errorHandle(businessDocumentsController.docSignatures));
    app.get({ url : '/api/signee/documents/:docId', version }, tokenAuth, urlIdHasher, validateSignee, errorHandle(businessDocumentsController.docSignatures));
    app.patch({ url : '/api/signee/documents/:docId', version }, tokenAuth, urlIdHasher, validateSignee, errorHandle(businessDocumentsController.addSignature));

    app.get({ url : '/api/signee/documents', version }, tokenAuth, errorHandle(businessDocumentsController.signeeDocuments));
};
