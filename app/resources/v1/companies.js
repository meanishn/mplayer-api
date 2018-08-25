const companyController = require('../../controllers/companies');
const middlewares = require('../../middlewares');

const tokenAuth = middlewares.auth.tokenAuth;
const roleAdmin = middlewares.userRoles.isAdmin;
const urlIdHasher = middlewares.urlIdHasher;

module.exports = (app) => {
    app.post({ url        : '/api/companies',
        validation : {
            content : {
                name : { isRequired : true }
            }
        } }, tokenAuth, roleAdmin, companyController.createCompany);
    app.get('/api/companies', tokenAuth, roleAdmin, companyController.listCompanies);
    app.get('/api/companies/:id/users', tokenAuth, roleAdmin, urlIdHasher, companyController.getUsers);
    app.get('/api/companies/:id/documents', tokenAuth, urlIdHasher, companyController.getDocuments);
    app.post({ url        : '/api/companies/:id/users',
        validation : {
            content : {
                userId : { isRequired : true }
            }
        } }, tokenAuth, roleAdmin, urlIdHasher, companyController.addUser);
};
