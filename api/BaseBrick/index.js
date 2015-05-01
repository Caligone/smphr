'use strict';

var Brick = require('../lib/Brick');
var BaseBrick = new Brick(__dirname, {
    attributes: {
        name: 'BaseBrick',
        version: '0.1.0'
    }
});

exports.register = BaseBrick;