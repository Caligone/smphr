'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    _ = require('underscore'),
    async = require('async');
var mongoose = require('mongoose');

module.exports = [
    {
        method: 'GET',
        path: '/logs/{id_target}',
        handler: function (request, reply) {
            var LogModel = request.server.plugins.TargetBrick.LogModel;

            async.auto({
                init: function (endInit) {
                    endInit(null, {id_target: request.params.id_target});
                },
                getLogs: ['init', function (endGetLogs, results) {
                    LogModel.find({target: results.init.id_target}, function (err, logs) {
                        if (err) {
                            return endGetLogs(Boom.badImplementation('DB Error', err));
                        }
                        return endGetLogs(null, {logs: logs});
                    });
                }]
            }, function (err, results) {
                if (err) {
                    reply(err);
                }
                else {
                    reply(results.getLogs.logs);
                }
            });
        },
        config: {
            tags: ['api'],
            validate: {
                params: {
                    id_target: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
                }
            },
            cache: {
                expiresIn: 1
            }
        }
    }
];
