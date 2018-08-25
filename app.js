const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');
const passport = require('passport');
const errors = require('restify-errors');
const semver = require('semver');
const restifyValidation = require('node-restify-validation');
const config = require('./config/config');
// const sequelizeConfig = require('./config/sequelizeConfig.json');
const log = require('./config/log');
const { VersionError } = require('./app/errors');
const errorTypes = require('./app/errors/types');

global.config = config;
global.log = log;
// All documents free for all users
// global.doc_free_offer = true;

const routes = require('./app/routes');

const passportHandler = require('./config/passport');
const cookieParser = require('restify-cookies');

const server = restify.createServer({
  name: config.app.name,
    // set default api version to 1.0.0
  version: ['1.0.0', '2.0.0'],
  log,
});
// const io = require('socket.io').listen(server.server, {
//   path: '/api/socket.io',
// });
// const websocket = require('./app/controllers/websocket');


server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restifyValidation.validationPlugin({
    // Shows errors as an array
  errorsAsArray: false,
    // Not exclude incoming variables not specified in validator rules
  forbidUndefinedVariables: false,
  errorHandler: errors.InvalidArgumentError,
}));

server.use(cookieParser.parse);
server.pre(restify.pre.sanitizePath());

// updated along with restify >v5.0,
// CORS handling is moved to separate repository
// For more secured cross domain control check https://github.com/Tabcorp/restify-cors-middleware
const cors = corsMiddleware({});
// using preflight to accept OPTION request made by browsers or clients / before the actual request
server.pre(cors.preflight);
server.use(cors.actual);

passportHandler(passport);
server.use(passport.initialize());

// websocket stuff
// websocket(io, passport);

// Default error handler
server.on('uncaughtException', (req, res, route, err) => {
  log.error('Uncaught Exception:', err.stack);
  if (!res.headersSent) {
    let response = {};
    if (global.isDev) {
      response = err;
    }

    return res.send(500, response);
  }
});

routes(server);
// const resources = require('./app/resources');
// resources(server);

server.pre((req, res, next) => {
  const versionInUrl = /^\/api\/v\d{1}/.test(req.url);
  const versionInHeader = req.headers['accept-version'];
    // By default restify chooses the highest matching version if no version is specified
    // Currently, the front end clients do not send any version header so, we have to
    // override the default behaviour by explicitly assigning the accept-header to default older version
    // which is 1.0.0 in order to prevent breaking changes for time being.
    // Though in the future we want to change this to default behaviour.
  if (!versionInUrl && !versionInHeader) {
    req.headers['accept-version'] = '1.0.0';
    return next();
  }
  if (!versionInUrl && versionInHeader) {
    return next();
  }
    // if version not sent as header, its assumed that
    // its the part of url such that /api/v1/....
  const pieces = req.url.replace(/^\/+/, '').split('/');
  let version = pieces[1];
  if (!semver.valid(version)) {
    version = version.replace(/v(\d{1})\.(\d{1})\.(\d{1})/, '$1.$2.$3');
    version = version.replace(/v(\d{1})\.(\d{1})/, '$1.$2.0');
    version = version.replace(/v(\d{1})/, '$1.0.0');
  }
  if (semver.valid(version) && server.versions.indexOf(version) > -1) {
    req.url = req.url.replace(`${pieces[1]}/`, '');
    req.headers['accept-version'] = version;
  } else {
    return next(new VersionError('This is an invalid version'));
  }

  return next();
});

server.on('VersionNotAllowed', (req, res, err, cb) => {
    // version error here
  err.type = errorTypes.ERR_VERSION_NOT_ALLOWED;
  err.code = err.body ? err.body.code : err.code;
  return cb();
});

server.on('restifyError', (req, res, err, cb) => {
    // global error signature
  if (!err.handled) {
    err.toJSON = function toJSON() {
      return {
        message: err.message,
        type: err.type || errorTypes.ERR_UNKNOWN,
        code: err.code || 'InternalError',
      };
    };
  }
  return cb();
});

server.listen(config.app.port, () => {
  log.info('Application %s listening at %s:%s', config.app.name, config.app.address, config.app.port);
});
