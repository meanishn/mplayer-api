const lawyerDocumentsController = require('../../controllers/lawyerDocuments');
const middlewares = require('../../middlewares');

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
    app.get('/api/document/search/title', errorHandle(lawyerDocumentsController.titleQuery));
    app.get('/api/document/cat/recommendation/', lawyerDocumentsController.readAllByCategories);
    app.get('/api/document/:id', urlIdHasher, errorHandle(lawyerDocumentsController.read));
};
