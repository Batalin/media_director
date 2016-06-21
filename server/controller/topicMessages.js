var TopicModel = require('mongoose').model('Topic');
var TopicMessageModel = require('mongoose').model('TopicMessage');
var busboy = require("connect-busboy");
var fs = require('fs');
var mongoose = require('mongoose');
var Topic= new TopicModel();


exports.getTopicMessages = function(req, res) {
    TopicMessageModel.find({}).exec(function(err, collection) {
        console.log(collection);
        res.send(collection);
    });
};


exports.postTopicMessage = function(req,res){
    var data = req.body;
    console.log(data);

    var TopicMessage= new TopicMessageModel();

    TopicMessage.topicId = data.topicId;
    TopicMessage.author = data.author;
    TopicMessage.date = data.date;
    TopicMessage.message = data.message;
    TopicMessage.authorId = data.authorId;

    TopicMessage._id = mongoose.Types.ObjectId();
    /*
    console.log("TopicMessage : ");
    console.log(TopicMessage);
    */

    TopicMessage.save(function(err) {
        if (err) throw err;
        console.log('Message saved successfully!');
    });
    TopicModel.findById(data.topicId, function (err, doc) {
        doc.replies = doc.replies+1;
        doc.date = data.date;
        doc.lastCommentAuthor=data.author;
        doc.save(function (err) {
            if(err) {
                console.log(err);
            }
        })
    });


    console.log("END OF SAVING");
    res.redirect(req.get('referer'));
}
exports.updateTopicMessage = function(req,res){
    var data = req.body.objectData;

    TopicMessageModel.findById(data.id, function (err, doc) {
        doc.message = data.message;
        //doc.date = data.date;
        doc.save(function (err) {
            if(err) {
                console.log(err);
            }
        })
    });
    res.redirect(req.get('referer'));

}
exports.deleteTopicMessage = function(req,res){

    var id=req.params.id;
    var topicId;
    console.log("delete: " + id);
    TopicMessageModel.findOne({_id:id}, function(err,obj) {
        console.log(obj.topicId);
        topicId = obj.topicId;
        var lastCommentAuthor = '';

        TopicModel.findOne({_id:topicId}, function(err,obj) {
            //console.log(obj.replies);
            if(obj.replies!=0) {
                TopicMessageModel.remove({_id:id}, function(err) {
                    if (!err) {

                        //console.log("Message Removed");
                        TopicMessageModel.find({topicId:topicId}).exec(function(err, collection) {
                            //console.log(collection);
                            var array=[];
                            for(var key in collection){
                                var date = collection[key].date;

                                var year = date.slice(date.indexOf('.',date.indexOf('.')+1)+1,date.indexOf('.',date.indexOf('.')+1)+5);
                                var month = ('0'+date.slice(date.indexOf('.')+1,date.indexOf('.',date.indexOf('.')+1))).slice(-2);
                                var day = date.slice(0,date.indexOf('.'));
                                var hours = date.slice(date.indexOf('@')+2,date.indexOf('@')+4);
                                var minutes = date.slice(date.indexOf(':')+1,date.indexOf(':')+3);

                                var date = year+month+day+hours+minutes;

                                var element = {
                                    'date':date,
                                    'author':collection[key].author
                                };
                                array.push(element);
                            }
                            var lastReply=array[0];
                            for(var key=0; key<array.length;key++){
                                if(array[key+1]&&array[key].date<=array[key+1].date){
                                    lastReply=array[key+1];
                                }
                            }
                            lastCommentAuthor=lastReply.author;
                        });
                    } else {
                        console.log("Error!");
                    }
                });
                TopicModel.findById(topicId, function (err, doc) {
                    doc.replies = obj.replies - 1;
                    doc.lastCommentAuthor = lastCommentAuthor;
                    doc.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                });
                res.end('{"success" : "Message", "status" : 200}');
            }else{
                TopicModel.remove({_id:topicId}, function(err) {
                    if (!err) {
                        console.log("Topic Removed");
                        res.end('{"success" : "Topic", "status" : 200}');
                    }
                    else {
                        console.log("Error!");
                    }
                });
            }
        });

    });

}