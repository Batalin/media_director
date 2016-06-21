

var mongoose = require('mongoose');

var topicMessageSchema = mongoose.Schema({
    topicId: {type: String, required: '{PATH} is required!'},
    date: String,
    author: String,
    message: String,
    authorId: String
});

var TopicMessage = mongoose.model('TopicMessage', topicMessageSchema);

module.exports =  TopicMessage;

function createTopicMessages() {
    TopicMessage.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            TopicMessage.create({
                topicId: 'TestTopicOne',
                date: 'Tomorrow',
                _id: 0,
                author: 'Mr.Someone',
                message: 'Temp',
                authorId: 0

            });
        }
    });
}

//exports.createDefaultTopicMessages = createTopicMessages;