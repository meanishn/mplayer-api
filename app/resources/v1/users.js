const middlewares = require('../../middlewares');
const usersController = require('../../controllers/users');

const auth = middlewares.auth;

module.exports = (app, version) => {
    app.post({ url        : '/api/register',
        validation : {
            content : {
                email    : { isRequired : true, isEmail : true },
                password : { isRequired : true }
            }
        },
        version }, usersController.register);
    app.post({ url        : '/api/login',
        validation : {
            content : {
                email    : { isRequired : true, isEmail : true },
                password : { isRequired : true }
            }
        },
        version }, auth.localAuth, (usersController.login));

    app.get({ url : '/api/logout', version }, usersController.logout);
    app.post({ url : '/api/refresh', version }, auth.tokenAuth, usersController.refresh);
    app.get({ url        : '/api/user/verify/:hash',
        validation : {
            resources : {
                hash : { isRequired : true }
            }
        },
        version }, usersController.verifyUser);
// app.post('/api/logout', usersController.logout);
    app.post({ url        : '/api/profile/update',
        validation : {
            content : {
                fullName    : { isRequired : true },
                firmName    : { isRequired : false },
                location    : { isRequired : false },
                address     : { isRequired : false },
                postcode    : { isRequired : false, isAlphaNumeric : true },
                city        : { isRequired : false },
                country     : { isRequired : false },
                vatId       : { isRequired : false },
                designation : { isRequired : false },
                phoneNumber : { isRequired : false },
                industry    : { isRequired : false }

            }
        },
        version }, auth.tokenAuth, usersController.update);
    app.get({ url : '/api/profile/islogin', version }, auth.tokenAuth, usersController.isLogin);
    app.post({ url        : '/api/profile/image',
        validation : {
            files : {
                file : { isRequired : true }
            }
        },
        version }, auth.tokenAuth, usersController.uploadImage);
    app.del({ url : '/api/profile', version }, auth.tokenAuth, usersController.deleteAccount);
    app.post({ url        : '/api/changepassword',
        validation : {
            content : {
                password        : { isRequired : true },
                confirmPassword : { isRequired : true }
            }
        },
        version }, middlewares.passwordUpdate, usersController.changePassword);

    app.post({ url        : '/api/forgotpassword',
        validation : {
            content : {
                email : { isRequired : true, isEmail : true }
            }
        },
        version }, usersController.forgotPassword);
    app.get({ url        : '/api/resetpassword',
        validation : {
            queries : {
                token : { isRequired : true }
            }
        },
        version }, usersController.resetpassword);
    app.patch({ url        : '/api/user/resend-email',
        validation : {

        },
        version }, auth.tokenAuth, usersController.resendToken);
    app.get({ url : '/api/user/companies', version }, auth.tokenAuth, usersController.getCompanies);
    app.post({ url        : '/api/redeem',
        validation : {
            content : {
                code : { isRequired : true }
            }
        },
        version }, auth.tokenAuth, usersController.redeemCode);
};
