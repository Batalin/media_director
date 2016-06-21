var mongoose = require('mongoose');

var videoSchema = mongoose.Schema({
    "user": String,
    "assignment": String,
    "created": Date,
    "duration": Number,
    "cut": [{
        "time1": Number,
        "time2": Number,
        "camera": Number,
        "final": Boolean
    }],
    "subs": [{
        "sub_text": String,
        "time1": Number,
        "time2": Number
    }],
    "effect": [{
        "time1": Number,
        "time2": Number,
        "type": String
    }]
});

var Video = mongoose.model('Video', videoSchema);