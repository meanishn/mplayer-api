const versions = {
    v2 : require('./v1')
};
module.exports = (app) => {
    Object.keys(versions).forEach((v) => {
        const version = versions[v];
        version(app);
    });
};
