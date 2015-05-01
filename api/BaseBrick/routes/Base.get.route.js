'use strict';

var config = require('../../../config');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: {
            file: './public/index.html'
        }
    },
    {
        method: 'GET',
        path: '/images/{param*}',
        handler: {
            directory: {
                path: './public/images'
            }
        }
    }
];