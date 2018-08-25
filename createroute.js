const fs = require('fs');
const mustache = require('mustache');

const template = `
    // import the controller module
    const {{module}} = require('../controllers/{{module}}');
    const middlewares = require('../middlewares');

    const auth = middlewares.auth;

    module.exports = (app) => {
        app.post({ url        : '/api/{{namespace}}',
            validation : {
                content : {
                    // request body validation
                }
            } }, {{module}}.create);
        app.get({ url        : '/api/{{namespace}}',
            validation : {
                // empty validation for get requests
            } }, {{module}}.readAll);
        app.patch({ url        : '/api/{{namespace}}/:id',
            validation : {
                content : {
                    // request body validation
                }
            } }, {{module}}.update);
        app.del({ url        : '/api/{{namespace}}/:id',
            validation : {
                // empty validation
            } }, {{module}}.update);
    };
`;
const args = process.argv.slice(2);
const context = {
    module    : args[0],
    namespace : args[1]
};

if (!context.module) {
    console.error('Module must be defined');
    return;
}
context.namespace = context.namespace || context.module;

const content = mustache.render(template, context);
const filePath = `app/resources/${context.module}.js`;

function writeToFile(fd) {
    fd.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            return console.error(err);
        }

        return console.log('New resource created!!');
    });
}

fs.open(filePath, 'wx', (err, fd) => {
    if (err) {
        if (err.code === 'EEXIST') {
            console.error('File already exists');
            return;
        }

        throw err;
    }
    writeToFile(fd);
});

