'use strict';

var Glue = require('glue');
var Manifest = require('./manifest');

var composeOptions = {
    relativeTo: __dirname
};

var Composer = Glue.compose(Manifest, composeOptions, function (err, server) {
    if (err) {
        throw err;
    }

    server.start(function () {
        console.log('Server is running on ' + server.info.host + ':' + server.info.port);
    });
});