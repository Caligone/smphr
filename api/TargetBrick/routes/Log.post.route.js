'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    _ = require('underscore'),
    async = require('async');
var mongoose = require('mongoose');

module.exports = [
    {
        method: 'POST',
        path: '/logs/{id_target}',
        handler: function (request, reply) {
            var TargetModel = request.server.plugins.TargetBrick.TargetModel,
                LogModel = request.server.plugins.TargetBrick.LogModel;

            async.auto({
                init: function (endInit) {
                    endInit(null, {
                        target: request.params.id_target
                    });
                },
                getTarget: ['init', function (endGetTarget, results) {
                    TargetModel.findById(results.init.target, function (err, target) {
                        if (err) {
                            return endGetTarget(Boom.badImplementation('DB Error', err));
                        }
                        return endGetTarget(null, {target: target});
                    });
                }],
                check: ['getTarget', function (endCheck, results) {
                    results.getTarget.target.check(function (err, response) {
                        LogModel.createFromRequest(results.getTarget.target._id, err, response, function (err, log) {
                            if (err) {
                                return server.log(Boom.badImplementation('DB Error', err));
                            }
                            endCheck(null, {log: log});
                        });
                    });
                }]
            }, function (err, results) {
                if (err) {
                    reply(err);
                }
                else {
                    reply({
                        target: results.getTarget.target,
                        log: results.check.log
                    });
                }
            });
        },
        config: {
            tags: ['api'],
            validate: {
                params: {
                    id_target: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
                }
            }
        }
    }
];
