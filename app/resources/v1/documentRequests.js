const DocumentRequestController = require('../../controllers/documentRequest');

module.exports = (app) => {
    app.post({ url        : '/api/doc/request',
        validation : {
            content : {
                title   : { isRequired : true },
                email   : { isRequired : true, isEmail : true },
                context : { isRequired : true }
            }
        } }, DocumentRequestController.create);
};
