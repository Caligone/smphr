'use strict';

var mongoose = require('mongoose');;

exports.register = function (server, options, next) {
    
    var mongoURL = 'mongodb://' + options.host + ':' + options.port  + '/' + options.name;

    mongoose.connection.on('error',function (err) { 
        throw 'Mongo connection error';
    });

    mongoose.connect(mongoURL, function () {
        server.expose('db', mongoose);
        next();
    });
};

exports.register.attributes = {
    name: 'mongoose'
};