'use strict';

var Brick = require('../lib/Brick');
var TargetBrick = new Brick(__dirname, {
    attributes: {
        name: 'TargetBrick',
        version: '0.1.0'
    }
});

exports.register = TargetBrick;