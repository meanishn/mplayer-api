const signeeController = require('../../controllers/signees');
const middlewares = require('../../middlewares');

const tokenAuth = middlewares.auth.tokenAuth;
const urlIdHasher = middlewares.urlIdHasher;
const isDocumentOwner = middlewares.isDocumentOwner;
const inSigningProcess = middlewares.inSigningProcess;

module.exports = (app) => {
    app.del('/api/signees/token/:tokenId/document/:docId/', tokenAuth, urlIdHasher, signeeController.revokeSigneeToken);
    // after email invitation click (NO AUTH)
    app.get('/api/signees/token/', signeeController.readTokenData);
    app.del('/api/signees/:signeeId/document/:docId/', tokenAuth, urlIdHasher, signeeController.revokeSignee);
    app.post({ url        : '/api/signees/invite',
        validation : {
            content : {
                signees : { isRequired : false },
                docId   : { isRequired : true }
            }
        } }, tokenAuth, urlIdHasher, isDocumentOwner, signeeController.createToken);
    app.get('/api/signees/token/:hash', tokenAuth, signeeController.readToken);
    app.post({ url        : '/api/signees',
        validation : {
            content : {
                hash : { isRequired : true }
            }
        } }, tokenAuth, signeeController.create);
    // get signee signature objects, fullname and email
    app.get('/api/signees/:docId', tokenAuth, urlIdHasher, signeeController.readAll);
    // signing object update
    app.patch({ url        : '/api/signees/:docId',
        validation : {
            resources : {
                docId : { isRequired : true }
            },
            content : {
                objects : { isRequired : true }
            }
        } }, tokenAuth, urlIdHasher, inSigningProcess, signeeController.updateSignatureObjects);
    app.get('/api/document/:docId/signees/', tokenAuth, urlIdHasher, signeeController.readSigneeData);
};
