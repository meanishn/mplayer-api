const reviewsController = require('../../controllers/reviews');
const middlewares = require('../../middlewares');

const tokenAuth = middlewares.auth.tokenAuth;
const urlIdHasher = middlewares.urlIdHasher;
const validateSignee = middlewares.validateSignee;

module.exports = (app) => {
    app.patch({ url        : '/api/business/document/:id/review/comment/:comment_id/position',
        validation : {
            resources : {
                id         : { isRequired : true },
                comment_id : { isRequired : true }
            },
            content : {
                id         : { isRequired : true },
                comment_id : { isRequired : true },
                col        : { isRequired : true, isNumeric : true },
                row        : { isRequired : true, isNumeric : true }
            }
        } }, tokenAuth, urlIdHasher, validateSignee, reviewsController.updateCommentPosition);

    app.patch({ url        : '/api/business/document/:id/review/comment/:comment_id',
        validation : {
            resources : {
                id         : { isRequired : true },
                comment_id : { isRequired : true }
            },
            content : {
                comment : { isRequired : true }
            }
        } }, tokenAuth, urlIdHasher, validateSignee, reviewsController.updateComment);

    app.post({ url        : '/api/business/document/:id/review/comment/',
        validation : {
            resources : {
                id : { isRequired : true }
            },
            content : {
                comment : { isRequired : true },
                column  : { isRequired : true, isNumeric : true },
                row     : { isRequired : true, isNumeric : true },
                length  : { isRequired : true, isNumeric : true }
            }
        } }, tokenAuth, urlIdHasher, validateSignee, reviewsController.addComment);

    app.del('/api/business/document/:id/review/comment/:comment_id', tokenAuth, urlIdHasher, validateSignee, reviewsController.deleteComment);

    app.post({ url        : '/api/business/document/:id/review/comment/:comment_id/resolve',
        validation : {

        } }, tokenAuth, urlIdHasher, validateSignee, reviewsController.resolveComment);

    app.get('/api/business/document/:id/review/comment/', tokenAuth, urlIdHasher, validateSignee, reviewsController.readAll);
    app.get('/api/business/document/:id/review/', tokenAuth, urlIdHasher, validateSignee, reviewsController.readAll);
    // returns template body for commenting
    app.get('/api/business/review/document/:docId/', tokenAuth, urlIdHasher, validateSignee, reviewsController.readDocumentBody);
    app.patch('/api/business/review/document/:docId/', tokenAuth, urlIdHasher, validateSignee, reviewsController.noDispute);
};
