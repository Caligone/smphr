'use strict';

var Brick = require('../lib/Brick');
var UserBrick = new Brick(__dirname, {
    attributes: {
        name: 'UserBrick',
        version: '0.1.0'
    }
});

exports.register = UserBrick;