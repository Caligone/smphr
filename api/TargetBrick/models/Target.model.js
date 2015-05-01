'use strict';

/* Dependencies and constants*/
var uuid = require('node-uuid'),
    _ = require('underscore'),
    RequestTool = require('request');

module.exports = function (mongoose) {
    
    var Schema = mongoose.Schema;

    /* Schema */
    var TargetSchema = new Schema({
        url: {
            type: String,
            required: true
        },
        method: {
            type: String,
            required: true
        },
        parameters: {
            type: Object,
            default: {}
        },
        active: {
            type: Boolean,
            default: true,
            required: true
        },
        owners: {
            type: [Schema.Types.ObjectId],
            default: [],
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now,
            required: true
        },
        last_check: {
            type: Date
        }
    });

    /* Methods */
    TargetSchema.methods.check = function (endCheck) {
        RequestTool({
            uri: this.url,
            method: this.method,
            // TODO Ajouter les paramètres
            time: true
        }, endCheck);
    };

    /* Model */
    var TargetModel;
    if (mongoose.models.Target) {
        TargetModel = mongoose.models.Target;
    }
    else {
        TargetModel = mongoose.model('Target', TargetSchema);
    }

    return TargetModel;
};