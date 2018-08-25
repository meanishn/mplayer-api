module.exports = (shipit) => {
    require('shipit-deploy')(shipit);

    shipit.initConfig({
        default : {
            workspace        : '/tmp/github-monitor',
            deployTo         : '/srv/doctual-api',
            repositoryUrl    : 'git@bitbucket.org:iots09/doctual-back.git',
            ignores          : ['.git', 'node_modules'],
            keepReleases     : 4,
            deleteOnRollback : false,
            key              : '~/.ssh/dctl_id_rsa',
            shallowClone     : true
        },
        staging : {
            servers : 'app@dev.doctual.com',
            branch  : 'dev'
        },
        production : {
            servers : 'app@doctual.com',
            branch  : 'master'
        },
        development : {
            servers : 'anish@192.168.11.4',
            branch  : 'dev'
        }
    });

    shipit.on('published', () =>
        shipit.remote('~/restart_doc_api.sh'));
};
