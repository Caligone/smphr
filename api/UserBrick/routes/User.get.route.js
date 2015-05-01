'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    _ = require('underscore'),
    async = require('async');
var mongoose = require('mongoose');

module.exports = [
    {
        method: 'GET',
        path: '/users/{id_user}/validate/{validation_token}',
        handler: function (request, reply) {
            var UserModel = request.server.plugins.UserBrick.UserModel;

            async.auto({
                init: function (endInit) {
                    endInit(null, {
                        id_user: request.params.id_user,
                        validation_token: request.params.validation_token});
                },
                getUser: ['init', function (endGetUser, results) {
                     UserModel.find({_id: results.init.id_user}, function (err, users) {
                        if (err) {
                            return endGetUser(Boom.badImplementation('DB Error', err));
                        }
                        if (users.length <= 0) {
                            return endGetUser(Boom.notFound('User not found'));
                        }
                        else {
                            return endGetUser(null, {user: users[0]});
                        }
                    });
                }],
                checkValidationToken: ['getUser', function (endCheckValidationToken, results) {
                    if (results.init.validation_token == results.getUser.user.validation_token && !results.getUser.user.valid) {
                        endCheckValidationToken();
                    }
                    else {
                        endCheckValidationToken(Boom.badRequest('Invalid token'));
                    }
                }],
                validateUser: ['checkValidationToken', function (endValidateUser, results) {
                    results.getUser.user.valid = true;
                    results.getUser.user.save(function (err, user) {
                        if (err) {
                            return endGetUser(Boom.badImplementation('DB Error', err));
                        }
                        endValidateUser(null, 'success');
                    });
                }]
            }, function (err, results) {
                if (err) {
                    reply(err);
                }
                else {
                    reply(results.validateUser);
                }
            });
        },
        config: {
            tags: ['api'],
            validate: {
                params: {
                    id_user: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                    validation_token: Joi.string().required()
                }
            }
        }
    }
];
