'use strict';

var config = require('./config');

module.exports = {
    server: {
        app: config
    },
    connections: [{
        host: config.get('host'),
        port: config.get('port'),
        labels: ['api']
    }],
    plugins: {
        './api/lib/database': config.get('db'),
        './api/BaseBrick': {},
        './api/UserBrick': {},
        'good': {
            reporters: [{
                reporter: require('good-console'),
                logRequestHeaders: true,
                logRequestPayload: true,
                logResponsePayload: true,
                args:[{ log: '*', response: '*' }]
            }]
        },
        'hapi-mailer': {
            transport: config.get('mailer'),
            views: {
                engines: {
                    html: {
                        module: require('handlebars').create(),
                        path: config.get('rootPath')
                    }
                }
            }
        }
    }
};
