'use strict';

/* Dependencies and constants*/
var uuid = require('node-uuid'),
    _ = require('underscore'),
    RequestTool = require('request');

module.exports = function (mongoose) {
    
    var Schema = mongoose.Schema;

    /* Schema */
    var LogSchema = new Schema({
        target: {
            type: Schema.Types.ObjectId,
            required: true
        },
        responseTime: {
            type: Number,
            required: true
        },
        statusCode: {
            type: Number,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now,
            required: true
        }
    });


    LogSchema.statics.createFromRequest = function (target, err, request, endCreateFromRequest) {
        this.create({
            target: target,
            responseTime: request.elapsedTime,
            statusCode: request.statusCode
        }, endCreateFromRequest);
    };

    /* Model */
    var LogModel;
    if (mongoose.models.Target) {
        LogModel = mongoose.models.Log;
    }
    else {
        LogModel = mongoose.model('Log', LogSchema);
    }

    return LogModel;
};