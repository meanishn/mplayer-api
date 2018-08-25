/* jslint node: true */

const path = require('path');

const rootPath = path.normalize(path.join(__dirname, '/..'));

const NODE_ENV = process.env.NODE_ENV || 'development';
const NODE_HOST = '127.0.0.1';
const NODE_PORT = process.env.NODE_PORT || 4000;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const ELASTIC_ADDRESS = process.env.ELASTIC_ADDRESS || 'http://localhost:9200';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const APP_NAME = 'doctual-api ';
const IMAGE_ROOT = process.env.IMAGE_ROOT || '/srv/assets/profileImage';
const DOCUMENT_ROOT = process.env.DOCUMENT_ROOT || '/srv/documentStore';
const USER_FILES = process.env.USER_FILES_ROOT || '/srv/user_files';

global.isDev = NODE_ENV === 'development';
global.isStaging = NODE_ENV === 'staging';
global.isTest = NODE_ENV === 'test';

const config = {
    development : {
        root          : rootPath,
        imageRoot     : IMAGE_ROOT,
        documentRoot  : DOCUMENT_ROOT,
        userFilesRoot : USER_FILES,
        app           : {
            name    : APP_NAME + NODE_ENV,
            address : NODE_HOST,
            port    : NODE_PORT
        },
        log : {
            name  : APP_NAME + NODE_ENV,
            level : LOG_LEVEL
        },
        elastic : ELASTIC_ADDRESS,
        redis   : {
            address : NODE_HOST,
            port    : REDIS_PORT
        }
    },
    staging : {
        root          : rootPath,
        imageRoot     : IMAGE_ROOT,
        documentRoot  : DOCUMENT_ROOT,
        userFilesRoot : USER_FILES,
        app           : {
            name    : APP_NAME + NODE_ENV,
            address : NODE_HOST,
            port    : NODE_PORT
        },
        log : {
            name  : APP_NAME + NODE_ENV,
            level : LOG_LEVEL
        },
        elastic : ELASTIC_ADDRESS,
        redis   : {
            address : NODE_HOST,
            port    : REDIS_PORT
        }
    },
    test : {
        root         : rootPath,
        imageRoot    : '/tmp/assets/profileImage',
        documentRoot : DOCUMENT_ROOT,
        app          : {
            name    : APP_NAME + NODE_ENV,
            address : NODE_HOST,
            port    : NODE_PORT
        },
        log : {
            name  : APP_NAME + NODE_ENV,
            level : LOG_LEVEL
        },
        elastic : ELASTIC_ADDRESS,
        redis   : {
            address : NODE_HOST,
            port    : REDIS_PORT
        }
    },
    production : {
        root          : rootPath,
        imageRoot     : IMAGE_ROOT,
        documentRoot  : DOCUMENT_ROOT,
        userFilesRoot : USER_FILES,
        app           : {
            name    : APP_NAME + NODE_ENV,
            address : NODE_HOST,
            port    : NODE_PORT
        },
        log : {
            name  : APP_NAME + NODE_ENV,
            level : LOG_LEVEL
        },
        elastic : ELASTIC_ADDRESS,
        redis   : {
            address : NODE_HOST,
            port    : REDIS_PORT
        }
    }
};

module.exports = config[NODE_ENV];
