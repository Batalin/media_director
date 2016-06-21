var TopicModel = require('mongoose').model('Topic');
var TopicMessageModel = require('mongoose').model('TopicMessage');
var busboy = require("connect-busboy");
var fs = require('fs');
var mongoose = require('mongoose');


exports.getTopics = function(req, res) {
    TopicModel.find({}).exec(function(err, collection) {
        res.send(collection);
    });

};


exports.postTopic = function(req,res){
    var Topic= new TopicModel();
    var TopicMessage= new TopicMessageModel();
    var data = req.body;
    console.log(data);


    Topic.title = data.title;
    Topic.author = data.author;
    Topic.date = data.date;
    Topic.lastCommentAuthor = data.author;
    Topic.replies = data.replies;
    Topic.authorId = data.authorId;

    Topic._id = mongoose.Types.ObjectId();

    TopicMessage.topicId= Topic._id;
    TopicMessage.message = data.message;
    TopicMessage.author = data.author;
    TopicMessage.date = data.date;
    TopicMessage.authorId = data.authorId;


    TopicMessage._id = mongoose.Types.ObjectId();
    console.log("Topic : ");
    console.log(Topic);
    console.log("TopicMessage : ");
    console.log(TopicMessage);


    TopicMessage.save(function(err) {
        if (err) throw err;
        console.log('Message saved successfully!');
    });
    Topic.save(function(err){
        if (err) throw err;
        console.log("Topic saved successfully");
    });


    console.log("END OF SAVING");
    res.redirect('back');
}
exports.deleteTopic = function(req,res){

    var id=req.params.id;
    console.log("delete: " + id);
    TopicModel.remove({_id:id}, function(err) {
        if (!err) {
            console.log("Check for success!");
        }
        else {
            console.log("Error!");
        }
    });
    TopicMessageModel.remove({topicId:id}, function(err) {
        if (!err) {
            console.log("Check for success!");
        }
        else {
            console.log("Error!");
        }
    });
    res.end('{"success" : "Updated", "status" : 200}');
}