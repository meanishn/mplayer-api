const bookmarksController = require('../../controllers/bookmarks');
const middlewares = require('../../middlewares');

const tokenAuth = middlewares.auth.tokenAuth;
const roleBusiness = middlewares.userRoles.isBusiness;
const urlIdHasher = middlewares.urlIdHasher;

module.exports = (app, version) => {
    // bookmarks
    app.get({ url : '/api/business/bookmark', version }, tokenAuth, roleBusiness, bookmarksController.readAll);

    app.post({ url        : '/api/business/bookmark',
        validation : {
            document_id : { isRequired : true }
        },
        version }, tokenAuth, urlIdHasher, roleBusiness, bookmarksController.create);

    app.del({ url : '/api/business/bookmark/:id', version }, tokenAuth, urlIdHasher, roleBusiness, bookmarksController.delete);
};
