
var mongoose = require('mongoose');

var topicSchema = mongoose.Schema({
    title: {type: String, required: '{PATH} is required!'},
    date: String,
    author: String,
    lastCommentAuthor: String,
    replies: Number,
    authorId: String
});

var Topic = mongoose.model('Topic', topicSchema);



function createTopics() {
    Topic.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            Topic.create({
                title: 'TestTopicOne',
                date: 'Tomorrow',
                author: 'Mr.Someone',
                lastCommentAuthor: 'Mr.NoBody',
                replies: 0,
                authorId: 0
            });
            Topic.create({
                title: 'TestTopicTwo',
                date: 'Tomorrow',
                author: 'Mr.Someone',
                lastCommentAuthor: 'Mr.NoBody',
                replies: 0,
                authorId: 1
            });
        }
    });
}

//exports.createDefaultTopics = createTopics;

module.exports =  Topic;