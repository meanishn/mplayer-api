const signatureDocumentsController = require('../../controllers/signatureDocuments');
const middlewares = require('../../middlewares');

const tokenAuth = middlewares.auth.tokenAuth;
const urlIdHasher = middlewares.urlIdHasher;
const validateSignee = middlewares.validateSignee;
const isDocumentOwner = middlewares.isDocumentOwner;

module.exports = (app) => {
    app.post({ url        : '/api/doc/upload',
        validation : {
            files : {
                file : { isRequired : true }
            }
        } }, middlewares.optionalLogin, signatureDocumentsController.uploadDoc);

    app.get({ url        : '/api/doc/snapshots/tmp/:docId',
        validation : {

        } }, urlIdHasher, signatureDocumentsController.getTempSnapshots);
// set the currently logged in user as the document owner passed valid token
    app.post({ url        : '/api/doc/setowner',
        validation : {
            content : {
                token : { isRequired : true }
            }
        } }, tokenAuth, signatureDocumentsController.setDocumentOwner);
    app.get({ url        : '/api/doc/snapshots/:docId',
        validation : {

        } }, tokenAuth, urlIdHasher, signatureDocumentsController.snapshots);
    app.post({ url        : '/api/doc/signatureDocuments/reset',
        validation : {
            content : {
                docId : { isRequired : true }
            }
        } }, tokenAuth, urlIdHasher, isDocumentOwner, signatureDocumentsController.resetSigningProcess);
    app.get({ url        : '/api/doc/signee/signatureDocuments',
        validation : {
        // No param validation
        } }, tokenAuth, urlIdHasher, signatureDocumentsController.signeeReadAll);

    app.get({ url        : '/api/doc/user/signatureDocuments',
        validation : {
        // No param validation
        } }, tokenAuth, urlIdHasher, signatureDocumentsController.userReadAll);

    app.get({ url        : '/api/doc/signatureDocuments/ready',
        validation : {
        // No param validation
        } }, tokenAuth, urlIdHasher, signatureDocumentsController.getReadyDocuments);
    app.patch({ url        : '/api/doc/signatureDocuments/:id/start',
        validation : {
            resources : {
                id : { isRequired : true }
            }
        } }, tokenAuth, urlIdHasher, isDocumentOwner, signatureDocumentsController.startSigningProcess);
    app.get({ url        : '/api/doc/signatureDocuments/:id',
        validation : {
            resources : {
                id : { isRequired : true }
            }
        } }, tokenAuth, urlIdHasher, validateSignee, signatureDocumentsController.read);
    app.patch('/api/doc/signatureDocuments/:id', tokenAuth, urlIdHasher, isDocumentOwner, signatureDocumentsController.updateDocument);
    app.get('/api/doc/signatureDocuments/:docId/download', tokenAuth, urlIdHasher, validateSignee, signatureDocumentsController.download);
    app.post('/api/doc/signatureDocuments/:docId/share', tokenAuth, urlIdHasher, validateSignee, signatureDocumentsController.share);
    app.get('/api/doc/signatureDocuments/:docId/check', tokenAuth, urlIdHasher, validateSignee, signatureDocumentsController.checkExistsPDF);
};
