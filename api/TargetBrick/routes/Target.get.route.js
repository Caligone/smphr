'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    _ = require('underscore'),
    async = require('async');
var mongoose = require('mongoose');

module.exports = [
    {
        method: 'GET',
        path: '/targets',
        handler: function (request, reply) {
            var TargetModel = request.server.plugins.TargetBrick.TargetModel;

            async.auto({
                init: function (endInit) {
                    endInit(null, {});
                },
                getTargets: ['init', function (endGetTargets, results) {
                    TargetModel.find({}, function (err, targets) {
                        if (err) {
                            return endGetTargets(Boom.badImplementation('DB Error', err));
                        }
                        return endGetTargets(null, {targets: targets});
                    });
                }]
            }, function (err, results) {
                if (err) {
                    reply(err);
                }
                else {
                    reply(results.getTargets.targets);
                }
            });
        },
        config: {
            tags: ['api']
        }
    }
];
