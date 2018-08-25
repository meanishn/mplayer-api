const lawyerDocumentsController = require('../../controllers/lawyerDocuments');
const middlewares = require('../../middlewares');

const tokenAuth = middlewares.auth.tokenAuth;
const roleLawyer = middlewares.userRoles.isLawyer;
const urlIdHasher = middlewares.urlIdHasher;

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

module.exports = (app) => {
    app.get('/api/lawyer/document/categories', lawyerDocumentsController.getCategories);

        // own resources
    app.get('/api/lawyer/document', tokenAuth, roleLawyer, errorHandle(lawyerDocumentsController.userReadAll));
    app.get('/api/lawyer/document/:id', tokenAuth, roleLawyer, urlIdHasher, errorHandle(lawyerDocumentsController.userRead));
    app.post('/api/lawyer/document', tokenAuth, roleLawyer, errorHandle(lawyerDocumentsController.userCreate));
    app.patch({ url        : '/api/lawyer/document/:id',
        validation : {
            content : {
                template   : { isRequired : true },
                questions  : { isRequired : false },
                answers    : { isRequired : false },
                categories : { isRequired : false },
                tags       : { isRequired : false }
            }
        } }, tokenAuth, roleLawyer, urlIdHasher, errorHandle(lawyerDocumentsController.userUpdate));
    app.patch('/api/lawyer/document/:id/recover', tokenAuth, roleLawyer, urlIdHasher, errorHandle(lawyerDocumentsController.userRecover));
    app.del('/api/lawyer/document/:id', tokenAuth, roleLawyer, urlIdHasher, errorHandle(lawyerDocumentsController.userDelete));
    app.post('/api/lawyer/document/:id/publish', tokenAuth, roleLawyer, urlIdHasher, errorHandle(lawyerDocumentsController.publish));
    app.post('/api/lawyer/document/:id/unpublish', tokenAuth, roleLawyer, urlIdHasher, errorHandle(lawyerDocumentsController.unpublish));
};
