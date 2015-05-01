'use strict';

var path    = require('path'),
    nconf = require('nconf'),
    env = (process.env.NODE_ENV || 'development');
 
nconf.argv()
     .env({ separator: '__' })
     .file({ file: 'config.json' });

nconf.overrides({
    'rootPath': path.normalize(__dirname),
    'env': env,
    'apiVersion': require('./package.json').version
});

nconf.set('db:name', nconf.get('db:name') + '-' + nconf.get('env'));

module.exports = nconf;
