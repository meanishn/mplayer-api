/* jslint node: true */
const bunyan = require('bunyan');
const path = require('path');
// const serializers = require('bunyan-serializers');

const config = require('./config');

let streams = [{
    // level: 'error',
    // path: 'logs/error.log'
    level: 'info',
    stream: process.stdout
}, {
    level: 'warn',
    stream: process.stdout
}, {
    level: 'error',
    stream: process.stdout
}];

if (global.isDev) {
    const PrettyStream = require('bunyan-pretty-colors');
    const prettyStdOut = new PrettyStream();

    prettyStdOut.pipe(process.stdout);
    streams = [{
        name: 'default',
        type: 'raw',
        stream: prettyStdOut
    }];
}
const log = bunyan.createLogger({
    name: config.log.name,
    streams,
    // serializers
});

module.exports = log;
