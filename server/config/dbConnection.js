/**
 * Created by olegba on 11/01/16.
 */

var mongoose = require('mongoose');
var userModel = require('../model/User');
require('../model/Video');
require('../model/Group');

var assignmentModel = require('../model/Assignment');
var topicModel = require('../model/Topic');
var topicMessageModel = require('../model/TopicMessage')

module.exports = function() {

    mongoose.connect('mongodb://localhost/mebop');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback(){
        console.log(' mebop db opened');
    });


    userModel.createDefaultUsers();
    /*topicModel.createDefaultTopics();
    topicMessageModel.createDefaultTopicMessages();*/

    //assignmentModel.createTestAssignment();
}

