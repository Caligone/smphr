'use strict';

var path = require('path'),
    async = require('async'),
    glob = require('glob'),
    _ = require('underscore');

module.exports = function Brick (dirname, opts) {
    // Check the use of new
    if (!(this instanceof Brick)) {
        throw new Error('You have to use ’new’ to create an instance of Brick');
    }

    // Check the dirname
    if(!(dirname)) {
        throw new Error('dirname must be defined');
    }

    // Check the name of the brick
    if(!(opts.attributes) || !(opts.attributes.name)) {
        throw new Error('‘options.attributes.name‘ must be defined');
    }

    this.register = function (server, options, next) {
        async.auto({
            // Load the routes
            routes: function (endLoadRoutes) {
                glob(dirname + "/**/*.route.js", options, function (err, files) {
                    var routes = []
                    _.each(files, function (f) {
                        routes = routes.concat(require(f));
                    });
                    server.route(routes);
                    endLoadRoutes(null);
                });
            },

            // Load the models
            models: function (endLoadModels) {
                glob(dirname + "/**/*.model.js", options, function (err, files) {
                    _.each(files, function (f) {
                        server.expose(path.basename(f, '.model.js') + 'Model', require(f)(server.plugins.mongoose.db));
                    });
                    endLoadModels(null);
                });
            }
        }, function (err, results) {
            next();
        });
    };

    this.register.attributes = opts.attributes;

    return this.register;
};
