'use strict';

var Glue = require('glue');
var Manifest = require('./manifest');
var RequestTool = require('request');
var _ = require('underscore');

var composeOptions = {
    relativeTo: __dirname
};

var Composer = Glue.compose(Manifest, composeOptions, function (err, server) {
    if (err) {
        throw err;
    }

    server.start(function () {
        console.log('Server is running on ' + server.info.host + ':' + server.info.port);
        server.plugins.TargetBrick.TargetModel.find({}, function (err, targets) {
            _.each(targets, function (target) {
                setInterval(function() {
                    var currentTarget = target;
                    RequestTool({
                        uri: server.settings.app.get('url') + '/logs/' + target._id,
                        method: 'POST'
                    }, function (err, response) {
                        server.log(currentTarget.url + " checked !", err);
                    });
                }, 1000 * 60);
            });
        });
    });
});