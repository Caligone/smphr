'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    _ = require('underscore'),
    async = require('async');
var mongoose = require('mongoose');

module.exports = [
    {
        method: 'POST',
        path: '/targets',
        handler: function (request, reply) {
            var TargetModel = request.server.plugins.TargetBrick.TargetModel,
                LogModel = request.server.plugins.TargetBrick.LogModel;

            async.auto({
                init: function (endInit) {
                    endInit(null, {
                        url: request.payload.url,
                        method: request.payload.method,
                        parameters: request.payload.parameters,
                        owners: [request.payload.owner]
                    });
                },
                createTarget: ['init', function (endCreateTarget, results) {
                    TargetModel.create(results.init, function (err, target) {
                        if (err) {
                            return endCreateTarget(Boom.badImplementation('DB Error', err));
                        }
                        return endCreateTarget(null, {target: target});
                    });
                }],
                firstCheck: ['createTarget', function (endFirstCheck, results) {
                    results.createTarget.target.check(function (err, response) {
                        LogModel.createFromRequest(results.createTarget.target._id, err, response, function (err, log) {
                            if (err) {
                                return server.log(Boom.badImplementation('DB Error', err));
                            }
                            endFirstCheck(null, {log: log});
                        });
                    });
                }]
            }, function (err, results) {
                if (err) {
                    reply(err);
                }
                else {
                    reply({
                        target: results.createTarget.target,
                        log: results.firstCheck.log
                    });
                }
            });
        },
        config: {
            tags: ['api'],
            validate: {
                payload: {
                    url: Joi.string().uri().required(),
                    method: Joi.string().valid(['GET', 'POST', 'PUT', 'DELETE']),
                    parameters: Joi.object().keys({
                        params: Joi.object().default({}),
                        query: Joi.object().default({}),
                        paryload: Joi.object().default({}),
                        header: Joi.object().default({})
                    }),
                    owner: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
                }
            }
        }
    }
];
