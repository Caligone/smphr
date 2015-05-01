'use strict';

/* Dependencies and constants*/
var uuid = require('node-uuid'),
    _ = require('underscore');

module.exports = function (mongoose) {
    
    var Schema = mongoose.Schema;

    /* Schema */
    var UserSchema = new Schema({
        email: {
            type: String,
            required: true
        },
        validation_token: {
            type: String,
            default: uuid.v4,
            required: true
        },
        valid: {
            type: Boolean,
            default: false,
            required: true
        },
        created_at: {
            type: Date,
            default: Date.now,
            required: true
        }
    });

    /* Model */
    var UserModel;
    if (mongoose.models.User) {
        UserModel = mongoose.models.User;
    }
    else {
        UserModel = mongoose.model('User', UserSchema);   
    }

    return UserModel;
};