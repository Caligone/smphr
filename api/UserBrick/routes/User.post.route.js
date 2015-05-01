'use strict';

var Joi = require('joi'),
    Boom = require('boom'),
    _ = require('underscore'),
    async = require('async');
var mongoose = require('mongoose');

module.exports = [
    {
        method: 'POST',
        path: '/users',
        handler: function (request, reply) {
            var UserModel = request.server.plugins.UserBrick.UserModel;

            async.auto({
                init: function (endInit) {
                    endInit(null, {email: request.payload.email});
                },
                checkUser: ['init', function (endCheckUser, results) {
                    UserModel.find(results.init, function (err, users) {
                        if (err) {
                            return endCheckUser(Boom.badImplementation('DB Error', err));
                        }
                        if (users.length > 0) {
                            return endCheckUser(Boom.conflict('Email already use'));
                        }
                        else {
                            endCheckUser();
                        }
                    });
                }],
                createUser: ['init', 'checkUser', function (endCreateUser, results) {
                     UserModel.create(results.init, function (err, user) {
                        if (err) {
                            return endCreateUser(Boom.badImplementation('DB Error', err));
                        }
                        if (!user) {
                            return endCreateUser(Boom.notFound('Invalid email'));
                        }
                        else {
                            return endCreateUser(null, {user: user});
                        }
                    });
                }],
                sendMail: ['createUser', function (endSendMail, results) {
                    var user = results.createUser.user;
                    // Envoi d'email de validation
                    var data = {
                        from: 'caligone@gmx.fr',
                        to: user.email,
                        subject: 'Validate your smphr account',
                        html: {
                            path: 'api/UserBrick/views/validation.email.html'
                        },
                        context: {
                            validation_url: 'http://smphr.io/users/' + user.id + '/validate/' + user.validation_token,
                            url: 'http://smphr.io'
                        }
                    };

                    // Suppression des valeurs sensibles
                    var cleanedUser = _.pick(user, ['_id', 'email', 'valid', 'created_at']);

                    var Mailer = request.server.plugins.mailer;
                    Mailer.sendMail(data, function (err, info) {
                        if (err) {
                            request.server.log(['error', 'mail'], err);
                        }
                    });
                    endSendMail(null, {user: cleanedUser});
                }]
            }, function (err, results) {
                if (err) {
                    reply(err);
                }
                else {
                    reply(results.sendMail.user);
                }
            });
        },
        config: {
            tags: ['api'],
            validate: {
                payload: {
                    email: Joi.string().email().required()
                }
            }
        }
    }
];
