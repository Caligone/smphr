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
    },
    {
        method: 'GET',
        path: '/js/{param*}',
        handler: {
            directory: {
                path: './public/js'
            }
        }
    },
    {
        method: 'GET',
        path: '/css/{param*}',
        handler: {
            directory: {
                path: './public/css'
            }
        }
    },
    {
        method: 'GET',
        path: '/fonts/{param*}',
        handler: {
            directory: {
                path: './public/fonts'
            }
        }
    },
    {
        method: 'GET',
        path: '/demo/{param*}',
        handler: {
            file: './public/demo.html'
        }
    }
];