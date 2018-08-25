const alphafeedback = require('../../controllers/alphafeedback');
const middlewares = require('../../middlewares');

const tokenAuth = middlewares.auth.tokenAuth;

module.exports = (app) => {
    app.post('/api/alpha/feedback', tokenAuth, alphafeedback.create);
    app.get('/api/alpha/feedback', tokenAuth, alphafeedback.list);
};
